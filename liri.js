require("dotenv").config();

var axios = require("axios");
var fs = require("fs");
var moment = require('moment'); 
moment().format()

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var term = process.argv[2]; 
var search = process.argv[3];
var divider = "\n--------------------------------------------------------------------"
UserInputs(term, search);

function UserInputs (term, search){
    switch (term) {
    case 'concert-this':
        concertInfo(search);
        break;
    case 'spotify-this-song':
        songInfo(search);
        break;
    case 'movie-this':
        movieInfo(search);
        break;
    case 'do-what-it-says':
        whatItSays();
        break;
    default: 
        console.log("Invalid Request. \nPlease type one of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
    }
}

function concertInfo(artist){
    
var URL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
var label= "\n*******Concert Information for " + artist+ "*******";

axios.get(URL).then(function(response) {
    console.log(label);
    fs.appendFileSync("log.txt","\n*******Concert Information for " + artist+ "*******")
    for (var i = 0; i < response.data.length; i++) {
      
        var datetime = response.data[i].datetime; 
        var dateArr = datetime.split('T'); 
        
       
        var concertResults = 
            divider +
                "\nVenue Name: " + response.data[i].venue.name + 
                "\nVenue Location: " + response.data[i].venue.city +
                "\nDate of the Event: " + moment(dateArr[0], "YYYY-MM-DD").format("MM-DD-YYYY"); //dateArr[0] should be the date separated from the time
      
        console.log(concertResults);
        fs.appendFileSync("log.txt",concertResults+"\n");
    }

})
.catch(function (error) {
    console.log(error);
});
};

function songInfo(song){
    var label= "\n*******Song Information for " + song+ "*******";
    fs.appendFileSync("log.txt", "\n*******Information for " + song+ "*******")
    if(!song){
        song = "The Sign";
    }
    spotify.search({ type: 'track', query: song })
    .then(function(data) {
        for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
            var spotifyResults =
            "\n"+divider+
                    "\nArtist(s): " + data.tracks.items[0].artists[i].name + 
                    "\nSong Name: " + data.tracks.items[0].name +
                    "\nPreview Link: " + data.tracks.items[0].preview_url +
                    "\nAlbum Name: " + data.tracks.items[0].album.name + "\n"
                    ;
                    
            console.log(spotifyResults);
            fs.appendFileSync("log.txt", spotifyResults +"\n");
        }
    })
    .catch(function(err) {
        console.log(err);
       

   
      });
}

function movieInfo(movie){
var URL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=b3c0b435";
var label= "\n*******Movie Information for " + movie + "*******";
fs.appendFileSync("log.txt","\n*******Movie Information for " + movie + "*******")
axios.get(URL).then(function(response) {
    
    var jsonData = (response.data)

    var movieData = [
        divider+
        "Title: " + jsonData.Title,
        "Year: " + jsonData.Year,
        "imdb Rating: " + jsonData.Ratings[0].Value,
        "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
        "Country: " + jsonData.Country,
        "Language: " + jsonData.Language,
        "Pilot: " +jsonData.Plot,
        "Actors: "+ jsonData.Actors,


    ].join("\n\n");
    console.log(movieData);
    fs.appendFileSync("log.txt", movieData +"\n");
    })
}

function whatItSays(){
	fs.readFile('random.txt', 'utf8', function(error, data){
		if (error){ 
			return console.log(error);
		}
        var dataArr = data.split(',');
        UserInputs(dataArr[0], dataArr[1]);
        fs.appendFileSync("log.txt", data);
	});
}