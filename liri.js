require("dotenv").config();

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var term = process.argv[2]; 
var search = process.argv[3];

UserInputs(term, search);

function UserInputs (term, search){
    switch (term) {
    case 'concert-this':
        showConcertInfo(search);
        break;
    case 'spotify-this-song':
        showSongInfo(search);
        break;
    case 'movie-this':
        showMovieInfo(search);
        break;
    case 'do-what-it-says':
        showSomeInfo();
        break;
    default: 
        console.log("Invalid Option. Please type any of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
    }
}