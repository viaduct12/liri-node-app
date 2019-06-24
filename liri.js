require("dotenv").config();
// var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);
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
var songObject = {};
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

}

function movie(text) {
  var movieName = "Mr.+Nobody"
  if(text.length !== 0){
    movieName = text.join("+");
  }
  
  axios({
    method: "GET",
    url: "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=BLANK"
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