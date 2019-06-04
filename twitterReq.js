const secrets = require("./secrets");
const https = require("https"); //https is core node module

module.exports.getToken = function getToken(callback) {
    // concatenate the credentials into a one line (laut dokumentation)
    let concatCreds = secrets.consumerKey + ":" + secrets.consumerSecret;
    let encodedCreds = Buffer.from(concatCreds).toString("base64");

    // ----------------- options & cb for request method OPEN
    let options = {
        method: "POST",
        path: "/oauth2/token", // path is an endpoint
        host: "api.twitter.com",
        headers: {
            Authorization: `Basic ${encodedCreds}`,
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
    };

    let cb = response => {
        if (response.statusCode !== 200) {
            callback(response.statusCode);
        }
        let body = "";
        response.on("data", chunk => {
            body += chunk;
        });

        response.on("end", () => {
            try {
                let parsedBody = JSON.parse(body);
                // bearerToken!!!!
                let bearerToken = parsedBody.access_token;
                // callback won't run untill bearerToken is defined
                callback(null, bearerToken); // null - no errors so far occured, I've got my bearerToken
            } catch (err) {
                // catch runs if 'body' is valid JS, NOT JSON
                //console.log("err in JSON.parse: ", err);
                callback(err);
            }
        });
    };
    // ----------------- options & cb for request method CLOSED

    //makes request to twitter, cb- a callback that runs once twitter send us the response
    https.request(options, cb).end("grant_type=client_credentials");
};

module.exports.getTweets = function getTweets(bToken, callback) {
    //console.log("callback: ", callback);
    // this function gets tweets from Twitter API

    // another http requerst to api, format http request, we have to pass the bearer token and endpoint is different
    // ----------------- options & cb for request method OPEN -----
    let options = {
        method: "GET",
        path:
            "/1.1/statuses/user_timeline.json?screen_name=nytimes&count=100&tweet_mode=extended", // path is an endpoint
        host: "api.twitter.com",
        headers: {
            Authorization: `Bearer ${bToken}`
        }
    };

    let cb = response => {
        // if smth goes wrong
        if (response.statusCode !== 200) {
            callback(response.statusCode);
            return;
        }
        //here will info from twitter will come in
        let body = "";
        response.on("data", chunk => {
            body += chunk;
            //console.log("body: ", body);
        });
        response.on("end", () => {
            try {
                callback(null, JSON.parse(body));
            } catch (err) {
                callback(err);
            }
        });
    };
    // The body of the response from this endpoint will be an array of objects representing tweets
    https.request(options, cb).end();
};

module.exports.filterTweets = function filterTweets(tweets) {
    //console.log("tweets[0].full_text: ", tweets[0].full_text);
    console.log("tweets[0].entities.urls: ", tweets[0].entities.urls);

    console.log(
        "tweets[0].entities.urls[0].url: ",
        tweets[0].entities.urls[0].url
    );

    let headlines = [];

    for (var i = 0; i < tweets.length; i++) {
        let headline = {};
        if (tweets[i].entities.urls && tweets[i].entities.urls.length == 1) {
            let formattedHref = tweets[i].entities.urls[0].url;
            let formattedText = tweets[i].full_text.slice(
                0,
                tweets[i].full_text.indexOf("http")
            );
            headline.text = formattedText;
            headline.href = formattedHref;

            headlines.push(headline);
            console.log(headline);
        }
    }
    console.log(headlines);
    return headlines;
};
