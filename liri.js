require("dotenv").config();
var Spotify = require('node-spotify-api')
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var request = require("request");
var moment = require("moment");
var fs = require("fs");

var createLine = "========================================"

function askLiri(action, value) {
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
        searchTextFile(value);
        break;

    default:
    console.log("USAGE: node liri.js <command> <input>\n")
    console.log("Commands are:\n concert-this --Seach for concerts by bandname\n spotify-this-song --Display information about song title\n movie-this -- return information regarding specified movie title\n do-what-this-says -- run commands from the specified text file\n Example: node liri.js spotify-this-song Africa\n\n Remember! Put quotes around input if its more than one word!")
        break;
}
fs.writeFile("log.txt", action + "," + value, function(err) {

    // If the code experiences any errors it will log the error to the console.
    if (err) {
      return console.log(err);
    }
  
    // Otherwise, it will print: "logs.txt was updated!"
    console.log("log.txt was updated!");
  
  });
}

askLiri(process.argv[2], process.argv[3])

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
    if (songName == undefined) {
        songName = "The Sign"
        searchSpotifyAPI(songName);
    } else {
    spotify.search({ type: 'track', query: songName })
  .then(function(response) {
    var songData = ""
    songData += createLine + "\n"; 
    songData += "Song: " + response.tracks.items[0].name + "\n";
    songData += "Artist: " + response.tracks.items[0].artists.map(artist => artist.name).join(", ") + "\n";
    songData += "URL: " + response.tracks.items[0].album.external_urls.spotify + "\n";
    songData += "Album: " + response.tracks.items[0].album.name;
    console.log(songData)
  })
  .catch(function(err) {
    console.log(err);
    
  });
}
}

function searchOmdbAPI(movieName) {
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

  // If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200 && movieName != undefined) {
    
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
    searchOmdbAPI(movieName);
}
});
}

function searchTextFile(fileName) {
    fs.readFile(fileName, "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
        console.log(data);
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
      
        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        askLiri(dataArr[0], dataArr[1]);        

      });
}