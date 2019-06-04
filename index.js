const express = require("express");
const app = express();

// tells the server to look for static files like html, css, frontend js files
app.use(express.static("./ticker"));

const { getToken, getTweets, filterTweets } = require("./twitterReq");

app.get("/data.json", (req, res) => {
    /* code to authenticate ourselves
    authenticateSelf();
    getTweets();
    */

    // we use callbacks to handle ASYNCHRONOUS behavior
    // the "bearerToken" variable is the actual bearerToken that we need to make requests to the Twitter API
    getToken(function(err, bearerToken) {
        if (err) {
            console.log("err in getToken callback: ", err);
            return;
        }

        getTweets(bearerToken, function(err, tweets) {
            if (err) {
                console.log("err in getTweets callback: ", err);
                return;
            }

            // filterTweets doesn't take a callback because
            // it's SYNCHRONOUS
            let filteredTweets = filterTweets(tweets);

            // send the filtered tweets back to the ticker
            res.json(filteredTweets);
        });
    });
});

app.listen(8080, () => console.log("listening!"));
