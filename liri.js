var fs = require("fs"); 
var request = require("request");
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require ("spotify");
var movieUrl = "";
var userProcess = process.argv[2];//pick process
var input = process.argv[3];//song or movie input

//use prompts to pick a process and pass 3 argv in.
console.log("Pick a Process: my-tweets, spotify-this-song and a song, movie-this and movie title, and do-what-it-says")  
//This uses case to determine which was selected
switch (userProcess){
	case "my-tweets":
		mytweets();
		break;

	case "spotify-this-song":
		spotifythissong();
		break;

    case "movie-this":
	 	moviethis();
	 	break;

    case "do-what-it-says":
		dowhatitsays();
		break;
}
 

//This will show your last 20 tweets and when they
// were created at in your terminal/bash window. 
 function mytweets(){
//	 Twitter API Credentials
    var client = new twitter({
         consumer_key: keys.twitterKeys.consumer_key,
         consumer_secret: keys.twitterKeys.consumer_secret,
         access_token_key: keys.twitterKeys.access_token_key,
         access_token_secret: keys.twitterKeys.access_token_secret,
    });
    
  	client.get( 'statuses/user_timeline' , {screen_name: 'Terry Bates'},  function (error, tweets, response){
    	for(var i =0; i < tweets.length; i++){

      		var twitterData = tweets[i].text + "\r\n" + tweets[i].created_at;

      		console.log(twitterData);
    }
  });
}//end of tweet function

	

						
//This will show the following information about the song in your terminal/bash window
   function spotifythissong() {
		console.log("Music for DAYS!");

		//variable for search term, test if defined.

		var searchTrack;
		if(!input){
			searchTrack = "The Sign";
		}else{
			searchTrack = input;
		}
	//launch spotify search
		spotify.search({type:'track', query:searchTrack}, function(err,data){
	    	if(err){
	        	console.log('Error occurred: ' + err);
	        	return;
	    	}else{
	        	//tried searching for release year! Spotify doesn't return this!
	  			console.log("Artist: " + data.tracks.items[0].artists[0].name);
	        	console.log("Song: " + data.tracks.items[0].name);
	        	console.log("Album: " + data.tracks.items[0].album.name);
	        	console.log("Preview Here: " + data.tracks.items[0].preview_url);
	    	}
		})
	};//end spotifyMe
      

//This will output movie information to your terminal/bash window
	// Then run a request to the OMDB API with the movie specified
 	function moviethis(){	
		
		if(!input){
			input = "mr nobody";
		}
	 	var movieName = input;	
	
 		var url = 'http://www.omdbapi.com/?t=' + movieName +'&y=&plot=long&tomatoes=true&r=json';
   		request(url, function(error, response, body){
	    if(!error && response.statusCode == 200){

 	        movieResult = JSON.parse(body);
 	        console.log("The Title is: " + movieResult.Title);
  	        console.log("The imdbRating is: " + movieResult.imdbRating);
  	        console.log("The Country is: " + movieResult.Country);
  	        console.log("The Language is: " + movieResult.Language);
  	        console.log("The Plot is: " + movieResult.Plot);
  	        console.log("The Actors are: " + movieResult.Actors);
  	        console.log("The Rotton Tomatoes Rating is: " + movieResult.tomatoRating);
 	        console.log("The Rotton Tomatoes url is: " + movieResult.tomatoURL);
        }
               
			console.log("Error :"+ error);
			return;

 })
 
 };

	//LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
	function dowhatitsays() {
  		fs.readFile("random.txt", "utf8", function(error, data) {
     		console.log(data);
     		//writeToLog(data);
     		var dataArr = data.split(',');
     		userProcess = dataArr[0];
     		input = dataArr[1];
     		console.log(dataArr)
     		spotifythissong();
   		});
  	}//end of function

// 