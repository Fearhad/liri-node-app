require("dotenv").config();
// var keys = require("keys.js");
// var spotify = new Spotify(keys.spotify);
var request = require("request");
var moment = require("moment");

var action = process.argv[2];
var value = process.argv[3];
var createLine = "========================================"

switch (action) {
    case "concert-this":
        searchBandsAPI(value);
        break;

    case "spotify-this-song":

        break;

    case "movie-this":

        break;

    case "do-what-it-says":

        break;

    default:

        break;
}

function searchBandsAPI(bandName) {
    request("https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            var objectBody = JSON.parse(body);
            for (i = 0; i < objectBody.length; i++) {
                console.log(createLine);
                console.log("Venue: " + objectBody[i].venue.name);
                console.log("City: " + objectBody[i].venue.city + ", " + objectBody[i].venue.country);
                console.log(moment(objectBody[i].datetime).format("MM/DD/YY"));
            }
    
            // console.log("The rating of Remember The Titans is: " + JSON.parse(body).imdbRating);
        } else {
            console.log(error);
        }
    });
}