require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");

//original input of user
var userInput = process.argv.slice(2);

//copy of the user input so that it can be manipulated with
var userInputCopy = process.argv.slice(2);

// createInfo(userInputCopy);

// function createInfo(input){};
var operation = userInputCopy[0];
userInputCopy.splice(0,1);
var searchText = userInputCopy;

var concertObject = {};
var songObject = {
  "Artist(s)": "",
  "Song Name": "",
  "Preview Link": "",
  Album: "",
};

var movieObject = {
  Title: "",
  Year: "",
  "IMDB Rating": "",
  "Rotten Tomatoes": "",
  Country: "",
  Language: "",
  Plot: "",
  Actors: ""
};


switch (operation) {

  case "concert-this":
    console.log("concert this", operation);
    concert(searchText);
    break;

  case "spotify-this-song":
    console.log("spotify this song", operation);
    console.log(searchText);
    song(searchText);
    break;

  case "movie-this":
    // console.log("move this", operation);
    console.log(movie(searchText));
    break;
  
  case "do-what-it-says":
    console.log("do what it says", operation);
    doThis(searchText);
    break;

}

function concert(text){
  
}

function song(text) {
  var songName = "The Sign"
  if (text.length !== 0) {
    songName = text.join(" ");
  }

  console.log(songName);
  spotify.search({ type: 'track', query: songName }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } else {
      // console.log(data.tracks);
      // console.log(data.tracks.items[0].album.name);
      // var artistName = [];
      for(var i = 0; i < data.tracks.items.length; i++){
        // console.log("crap " + i);
        var itemsArray = data.tracks.items[i];
        songObject = {
          "Song Name": data.tracks.items[i].name,
          "Preview Link": data.tracks.items[i].preview_url,
          Album: data.tracks.items[i].album.name
        }
        var tempArtist = "";

        for(var j= 0; j < itemsArray.artists.length; j++){
          // artistName.push(itemsArray.artists[j].name);
          tempArtist += itemsArray.artists[j].name + ", ";
          songObject = {
            "Artist(s)" : tempArtist
          }
        };
        console.log(songObject);
        // printInfo(songObject);
      }
      // console.log(artistName);
    }
  })
}

function movie(text) {
  var movieName = "Mr.+Nobody"
  if(text.length !== 0){
    movieName = text.join("+");
  }
  
  axios({
    method: "GET",
    url: "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + process.env.OMDB_ID
  }).then(movie => {
    var response = movie.data;
    // console.log(response);
    movieObject = {
      Title: response.Title,
      Year: response.Year,
      "IMDB Rating": response.imdbRating,
      "Rotten Tomatoes": response.Ratings[1].Value,
      Country: response.Country,
      Language: response.Language,
      Plot: response.Plot,
      Actors: response.Actors
    }

    var text = printInfo(movieObject);
    return text;
    // console.log(movieObject);

  })
}

function doThis(text) {

}

function printInfo(data){
  // console.log(Object.keys(data), "i'm in printinfo", Object.values(data));
  var stringBuilder = "";
  for(key in data){
    stringBuilder += (key + ": " + data[key] + "\n");

  }
  return stringBuilder;
}