
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require('moment');
var fs = require("fs");

//original input of user, wanted to make a deep copy of this just for practicing
var userInput = process.argv.slice(2);
//copy of the user input so that it can be manipulated with
var userInputCopy = process.argv.slice(2);

//wanted to store all my strings into this array but couldn't figure out how to access it after the promise
var stringArray = [];

var operation = userInputCopy[0];
userInputCopy.shift();
var searchText = userInputCopy;
var flag = false;

// actually forgot what i was gonna do with this, think i abandoned the idea because of broken promises 
// var concertObject = {
//   Venue: "",
//   Location: "",
//   Date: ""
// };

// var songObject = {
//   "Artist(s)": "",
//   "Song Name": "",
//   "Preview Link": "",
//   Album: "",
// };

// var movieObject = {
//   Title: "",
//   Year: "",
//   "IMDB Rating": "",
//   "Rotten Tomatoes": "",
//   Country: "",
//   Language: "",
//   Plot: "",
//   Actors: ""
// };

//begins the search using the operation and search text
chooseOperation(operation, searchText);

//function that calls the following operations depending on what the user wanted to do
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

//parses the json file to retrieve the necessary information
function concert(text){
  //initializes bandName with a default setting
  var bandName = "Taking Back Sunday";
  //if there is items in the array and text is not an object it will join them together with a space
  if (text.length !== 0 && typeof(text) === "object"){
    bandName = text.join(" ");
    //if the text is a string then it will replace quotation marks with nothing
  } else if (typeof (text) === "string") {
    text = text.replace(/"/g,"");
    bandName = text;
  }
  
  //using axios to fetch the json file so that it will parse through it, also the api key is hidden using dotenv
  axios({
    method: "GET",
    url: "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id="+ process.env.BiT
  }).then(concert => {
    for(var i = 0; i < concert.data.length; i++){
      //stores the information into an object, using moment to convert the date format in the json file to MM/DD/YYYY
      var concertObject = {
        Venue: concert.data[i].venue.name,
        Location: concert.data[i].venue.city + ", " + concert.data[i].venue.country,
        Date: moment(concert.data[i].datetime).format("L")
      };
      //converts the object into a readible string in the printInfo function
      console.log(printInfo(concertObject));
    }
    flag = false;
  })
}
//parses the json file to retrieve the necessary information
function song(text) {
  //initializes songName with a default setting
  var songName = "The Sign"
  
  //if there is items in the array and text is not an object it will join them together with a space
  if (text.length !== 0 && typeof(text) === "object") {
    songName = text.join(" ");
  //if the text is a string then set the songName to the text
  } else if (typeof(text) === "string"){
    songName = text;
  }
  //uses the npm spotify module to parse through they json file
  spotify.search({ type: 'track', query: songName }, async function (err, data) { 
    //if an error occurs it will output it
    if (err) {
      return console.log('Error occurred: ' + err);
    } else {
      //double for loop to get all the artists names
      for(var i = 0; i < data.tracks.items.length; i++){
        var itemsArray = data.tracks.items[i];
        //creates a string
        var tempArtist = "";

        for(var j= 0; j < itemsArray.artists.length; j++){
          if (j < itemsArray.artists.length - 1){          
            tempArtist += itemsArray.artists[j].name + ", ";
          } else if (j === itemsArray.artists.length -1){
            tempArtist += itemsArray.artists[j].name;
            //stores the information into the object
            var songObject = {
              "Artist(s)" : tempArtist,
              "Song Name": data.tracks.items[i].name,
              "Preview Link": data.tracks.items[i].preview_url,
              Album: data.tracks.items[i].album.name 
            }
          }
        }
        //converts the object into a readible string in the printInfo function
        console.log(printInfo(songObject));
      }
      flag = false;
    }
  })
}
//parses the json file to retrieve the necessary information
function movie(text) {

  //initializes movieName with a default setting
  var movieName = "Mr.+Nobody"
  //if there is items in the array and text is not an object it will join them together with a +
  if(text.length !== 0 && typeof(text) === "object"){
    movieName = text.join("+");
  //if the text is a string then set the movieName to the text
  } else if (typeof(text) === "string") {
    movieName = text;
  }
  
  //using axios to fetch the json file so that it will parse through it, also the api key is hidden using dotenv
  axios({
    method: "GET",
    url: "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + process.env.OMDB_ID
  }).then(movie => {
    var response = movie.data;
    //stores the information into the object
    var movieObject = {
      Title: response.Title,
      Year: response.Year,
      "IMDB Rating": response.imdbRating,
      "Rotten Tomatoes": response.Ratings[1].Value,
      Country: response.Country,
      Language: response.Language,
      Plot: response.Plot,
      Actors: response.Actors
    }
    //converts the object into a readible string in the printInfo function
    console.log(printInfo(movieObject));
    flag = false;
  })
}

//function that reads a txt file and does the commands written in there
function doThis() {
  //a way to parse the file
  fs.readFile("random.txt", "utf8", function(err, data){
    //if an error occurs it will output it
    if(err){
      return console.log(err);
    }
    //because of the way i set up my random.txt file i had to replace the return and new line with a space
    data = data.replace(/[\r\n]/gm," ");
    //after replacing it created two consecutive spaces so i had to replace the two spaces to a comma
    data = data.replace(/  +/g,",");
    //then i used the comma as a way to split it and put it in an array
    var text = data.split(",");

    //loops through the array and pushing in the information into the chooseOperation
    //used the array as a queue hence why i had to shift twice because it was already read
    while(text.length != 0){
      chooseOperation(text[0], text[1]);
      text.shift();
      text.shift();
    }
  })
}

//the logData works fine where it has an operator and search info, it becomes weird when i read
//a text file to issue the commands. also when its only just an operator and no search info
//have an idea on how to fix it but it's late and i was running out of variable names
function logData(whatIsLove, babyDontHurtMe, noMore){

  if (flag === false){
    //appends the command and search text to the very top once and then appends the data below it
    var text = whatIsLove + "," + babyDontHurtMe.join(" ") + "\n";
    fs.appendFile("log.txt", text, function (err) {
      //if an error occurs it will output it
      if (err) {
        console.log(err);
      }
    })
  }
  var text1 = noMore + "\n";
  fs.appendFile("log.txt", text1, function (err) {
  //if an error occurs it will output it
    if (err) {
      console.log(err);
    }
  })
  flag = true;
}
//wanted to make a stringBuilder similiar to one in java
function printInfo(data){
  var stringBuilder = "";
  //for in statement that prints the keys and values and concatenates it in a legible way
  for(key in data){
    stringBuilder += (key + ": " + data[key] + "\n");
  }
  //sends the information to the log the data in the text
  logData(operation, searchText, stringBuilder);
  //promises defeated me
  stringArray.push(stringBuilder);
  return stringBuilder;
}