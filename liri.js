
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require('moment');
var fs = require("fs");

//original input of user
var userInput = process.argv.slice(2);
//copy of the user input so that it can be manipulated with
var userInputCopy = process.argv.slice(2);
var stringArray = [];
var operation = userInputCopy[0];
userInputCopy.shift();
var searchText = userInputCopy;
var flag = false;


var concertObject = {
  Venue: "",
  Location: "",
  Date: ""
};

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

chooseOperation(operation, searchText);

function chooseOperation(decisions, searches){
  switch (decisions) {

    case "concert-this":
      concert(searches);
      break;

    case "spotify-this-song":
      song(searches);
      break;

    case "movie-this":
      movie(searches);
      break;
    
    case "do-what-it-says":
      doThis();
      break;

  }
}
function concert(text){
  var bandName = "A Static Lullaby";
  if (text.length !== 0 && typeof(text) === "object"){
    bandName = text.join(" ");
  } else if (typeof (text) === "string") {
    text = text.replace(/"/g,"");
    bandName = text;
  }
  
  axios({
    method: "GET",
    url: "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id="+ process.env.BiT
  }).then(concert => {
    for(var i = 0; i < concert.data.length; i++){
      concertObject = {
        Venue: concert.data[i].venue.name,
        Location: concert.data[i].venue.city + ", " + concert.data[i].venue.country,
        Date: moment(concert.data[i].datetime).format("L")
      };
      console.log(printInfo(concertObject));
    }
    flag = false;
  })
}

function song(text) {
  var songName = "The Sign"

  if (text.length !== 0 && typeof(text) === "object") {
    songName = text.join(" ");
  } else if (typeof(text) === "string"){
    songName = text;
  }
  spotify.search({ type: 'track', query: songName }, async function (err, data) { 
    if (err) {
      return console.log('Error occurred: ' + err);
    } else {
      for(var i = 0; i < data.tracks.items.length; i++){
        var itemsArray = data.tracks.items[i];
        var tempArtist = "";

        for(var j= 0; j < itemsArray.artists.length; j++){
          if (j < itemsArray.artists.length - 1){          
            tempArtist += itemsArray.artists[j].name + ", ";
          } else if (j === itemsArray.artists.length -1){
            tempArtist += itemsArray.artists[j].name;
            songObject = {
              "Artist(s)" : tempArtist,
              "Song Name": data.tracks.items[i].name,
              "Preview Link": data.tracks.items[i].preview_url,
              Album: data.tracks.items[i].album.name 
            }
          }
        }
        console.log(printInfo(songObject));
      }
      flag = false;
    }
  })
}

function movie(text) {
  var movieName = "Mr.+Nobody"
  if(text.length !== 0 && typeof(text) === "object"){
    movieName = text.join("+");
  } else if (typeof(text) === "string") {
    movieName = text;
  }
  
  axios({
    method: "GET",
    url: "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + process.env.OMDB_ID
  }).then(movie => {
    var response = movie.data;

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
    console.log(printInfo(movieObject));
    printInfo(movieObject);
    flag = false;
  })
}

function doThis() {
  fs.readFile("random.txt", "utf8", function(err, data){
    if(err){
      return console.log(err);
    }
    data = data.replace(/[\r\n]/gm," ");
    data = data.replace(/  +/g,",");
    var text = data.split(",");

    while(text.length != 0){
      chooseOperation(text[0], text[1]);
      text.shift();
      text.shift();
    }
  })
}

//
function logData(whatIsLove, babyDontHurtMe, noMore){  
  if (flag === false){
    var text = whatIsLove + "," + babyDontHurtMe.join(" ") + "\n";
    fs.appendFile("log.txt", text, function (err) {
      if (err) {
        console.log(err);
      }
    })
  } else {
    var text1 = noMore + "\n";
    fs.appendFile("log.txt", text1, function (err) {
      if (err) {
        console.log(err);
      }
    })
  }
  flag = true;
}

function printInfo(data){
  var stringBuilder = "";

  for(key in data){
    stringBuilder += (key + ": " + data[key] + "\n");
  }
  
  logData(operation, searchText, stringBuilder);
  stringArray.push(stringBuilder);
  return stringBuilder;
}