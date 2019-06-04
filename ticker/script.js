(function() {
    var headlines = $(".headline");
    var myHtml = "";

    // first - ajax request
    $.ajax({
        url: "/data.json",
        //method: "GET",
        success: function(data) {
            // loop through the json object, create an html and put it on the page
            for (var i = 0; i < data.length; i++) {
                myHtml +=
                    "<a href='" + data[i].href + "'>" + data[i].text + "</a>";
            }
            headlines.html(myHtml);
            animate();
        }
    });

    var left = headlines.offset().left; // returns number

    function animate() {
        var first = headlines.children().first();
        console.log("first is ", first); // returns first object
        left--;
        if (left <= 0 - first.outerWidth()) {
            headlines.append(first);
            left = 0;
        }
        headlines.css("left", left + "px");
        myReq = requestAnimationFrame(animate); //  имеет функцию цикла
    }

    // jQuery event listeners
    headlines.on("mouseover", function() {
        cancelAnimationFrame(myReq);
        headlines.children().css("color", "#4682b4");
        headlines.css("text-decoration", "underline");
    });

    headlines.on("mouseout", function() {
        animate();
        headlines.children().css("color", "#8b008b");
        headlines.css("text-decoration", "none");
    });
})();
