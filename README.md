# liri-node-app

## Description
LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a Language Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data.

## Software Installations

- Node.js - download the latest version of Node (https://nodejs.org/en/).

- Clone the liri-node-app repo (https://github.com/viaduct12/liri-node-app).

- On the terminal of the root folder of the liri-node-app; npm install

## Built With
- Visual Studio Code

- Node.js

## Node Packages

- [axios](https://www.npmjs.com/package/axios)

- [spotify api](https://www.npmjs.com/package/node-spotify-api)

- [moment](https://www.npmjs.com/package/moment)

- [dotENV](https://www.npmjs.com/package/dotenv)

## Functionality

- ``` node liri.js concert-this '<artist/band name here>' ```

* Uses the Bands in Town API and npm axios to search for concert events using the artist or band as a search key. The response will render information regarding the following :

  * Name of the venue
  * Venue location
  * Date of the Event (using the format "MM/DD/YYYY")

- ``` node liri.js spotify-this-song '<song name here>' ```

* Uses the npm spotify to search for songs using the song name as a search key. The response will render information regarding the following:

  * Artist(s)
  * The song's name
  * A preview link of the song from Spotify
  * The album containing the song
  * If no song is provided, the program defaults to "The Sign" by Ace of Base.

- ``` node liri.js movie-this '<movie name here>' ```

* Uses the OMDB api and npm axios to search for movies using the movie name as a search key. The response will render information regarding the following:

  * Title
  * Year movie was released
  * IMDB Rating
  * Rotten Tomatoes Rating
  * Country where movie was produced
  * Language(s)
  * Plot of the movie
  * Actors in the movie
  * If the user does not enter a movie selection, the program outputs data for the movie 'Mr. Nobody.'

- ``` node liri.js do-what-it-says```

* It reads in a file in random.txt and passes it's values to either of the three choices above, depending on what was written in the file. It will take in multiple searches.

## Video Demo
------
[LIRI Demo](https://vimeo.com/344738507)

## Author
Lawrence Fiesta