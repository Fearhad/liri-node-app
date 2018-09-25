require("dotenv").config();
var Spotify = require('node-spotify-api')
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
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
        searchSpotifyAPI(value);
        break;

    case "movie-this":
        searchOmdbAPI(value);
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
        } else {
            console.log(error);
        }
    });
}

function searchSpotifyAPI(songName) {
    spotify.search({ type: 'track', query: songName })
  .then(function(response) {
    var songData = ""
    songData += createLine; 
    songData += "Song: " + response.tracks.items[0].name + "\n";
    songData += "Artist: " + response.tracks.items[0].artists.map(artist => artist.name).join(", ") + "\n";
    songData += "URL: " + response.tracks.items[0].album.external_urls.spotify + "\n";
    songData += "Album: " + response.tracks.items[0].album.name;
    console.log(songData)
  })
  .catch(function(err) {
    console.log(err);
    spotify.search({ type: 'track', query: 'The Sign' })
  .then(function(response) {
    var songData = ""
    songData += createLine; 
    songData += "Song: " + response.tracks.items[0].name + "\n";
    songData += "Artist: " + response.tracks.items[0].artists.map(artist => artist.name).join(", ") + "\n";
    songData += "URL: " + response.tracks.items[0].album.external_urls.spotify + "\n";
    songData += "Album: " + response.tracks.items[0].album.name;
    console.log(songData)
  })
  });
}

function searchOmdbAPI(movieName) {
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

  // If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200) {
    console.log(createLine);
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Year Released: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].value);
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot Summary: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);
  } else {
      movieName = "Nobody's Fool"
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
        console.log(createLine);
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Year Released: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].value);
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot Summary: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);
  })
}
});
}