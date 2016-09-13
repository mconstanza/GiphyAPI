// Movie Gifaru
// This app is designed to search Giphy for the most relevant gifs based on a user's input

$(document).ready(function(){

	// Element variables
	var $gifDiv = $("#gifDiv");
	var $buttonDiv = $('#buttonDiv');
	var $movieInput = $('#movieInput');
	var $addButton = $('#addButton');
	var $movieDataDiv = $('#movieDataDiv');

	// holds the movie searches that will be made into default buttons, including
	// ones the user inputs
	var buttonArray = ["Indiana Jones", "Star Wars", "The Godfather", "Back to the Future",
	"Jaws", "Close Encounters of the Third Kind", "The Goonies"];


// General Functions ////////////////////////////////////////////////////////////////////

	// creates buttons from the buttonArray
	function renderButtons(){

		// empty the button div each time buttons are rendered so that they are not repeated

		$buttonDiv.empty();

		// Loop through the array

		for(var i = 0; i < buttonArray.length; i++){

			// create button elements
			var button = $('<button>');

			// give the buttons a class, data 'name', and text
			button.addClass('movie btn');
			button.attr('data-name', buttonArray[i]);
			button.text(buttonArray[i]);

			// add the button to the button div
			$buttonDiv.append(button);

		};
	};

	// checks if movie title is already in the buttonArray
	function movieTitleValid(movie){

		for( var i = 0; i < buttonArray.length; i++){
			if(movie.toLowerCase() == buttonArray[i].toLowerCase()){
				$('#movieExistsAlert').show();
				return false;
			};
		};
		return true;
	};

	// converts an array to a string without commas between elements
	function arrayToString(array){
		var string = ""
		for (i in array) {
			string += array[i];
		}
		return string
	};

	// change the name contained in the button to a string usable in the API query
	function makeMovieQuery(movieTitle){

		var movie = movieTitle.split("");

		for( var i = 0; i < movie.length; i++){

			if(movie[i] == " "){
				movie[i] = "+"; // replace spaces with '+'
			};
		};

		return arrayToString(movie);
	};

	// takes an array of gifs (or a jQuery selector of all gifs) and stops them from playing
	function stopGifs(gifs){

		for(var i = 0; i < gifs.length; i++){

			$(gifs[i]).attr('src', $(gifs[i]).data('gifStill'));
		}
	};

	// AJAX call to get gifs from the Giphy API. Also assigns relevant attributes and writes to DOM
	function getGifs(title){

		// create the query url
		var movie = makeMovieQuery(title.data('name'));
		var publicKey = "&api_key=dc6zaTOxFJmzC";
		var limit = "&limit=10";
		var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + movie + publicKey + limit;

		$.ajax({url: queryURL, method: 'GET'}).done(function(response) {

			// response is an array of objects
			// iterate through the array and assign relevant properties to variables

			for(var i = 0; i < response.data.length; i++){

				var stillUrl = response.data[i].images.original_still.url;
				var url = response.data[i].images.original.url;
				var rating = response.data[i].rating;

				// create div for images and ratings
				var $gifAndRatingDiv = $('<div>');
				$gifAndRatingDiv.attr('class', 'gifAndRating');

				// create span for rating and apply data and class attributes
				var $rating = $('<span>');
				$rating.attr('class', 'rating text-center');
				$rating.data('rating', rating);
				$rating.text("Rating: " + rating.toUpperCase());

				// append the rating span to the gifAndRatingDiv
				$gifAndRatingDiv.append($rating);

				// create the images
				var $gif = $('<img>');
				$gif.attr('class', 'gif');

				// save the animated gif url
				$gif.data('gif', url);
				// save the still image url
				$gif.data('gifStill', stillUrl);
				// set the gif's default src to the still image
				$gif.attr('src', stillUrl);
				// add the gif to the gifAndRatingDiv
				$gifAndRatingDiv.append($gif);
				// add the gifAndRatingDiv to the gifDiv
				$gifDiv.append($gifAndRatingDiv);

			};
		});
	};

	// Call the movieDB API to get information on the movie selected
	function movieInfo(title){

		// create the query URL
		var movie = makeMovieQuery(title.data('name'));
		var publicKey = '3c00a4ce42778575918daaa89b4dfde2';
		var query = "?api_key=" + publicKey + "&query=" + movie
		//var encodedURI = encodeURI(uri);
		var queryURL =  'https://api.themoviedb.org/3/search/movie' + query


		$.ajax({url: queryURL, method: 'GET'}).done(function(response) {

			console.log(response)

			// accept the first result of the search and set variables
			var movie = response.results[0];

			var movieID = movie.id;

			var title = movie.title;
			console.log(title);

			var release = movie.release_date;
			console.log(release);

			var plot = movie.overview;
			console.log(plot);

			var posterPath = movie.poster_path;

			var posterSrc = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2'+ posterPath
			// clear the movie data div
			$movieDataDiv.empty();

			// create divs for movie data


			var $titleDiv = $('<div>');
			$titleDiv.attr('id', 'titleDiv')
			var $title = $('<p>');
			$title.text(title);
			$titleDiv.append($title, '<hr>');

			var $releaseDiv = $('<div>');
			$releaseDiv.attr('id', 'releaseDiv')
			var $release = $('<p>');
			$release.text(release);
			$releaseDiv.append($release, '<hr>');

			var $plotDiv = $('<div>');
			$plotDiv.attr('id', 'plotDiv')
			var $plot = $('<p>');
			$plot.text(plot);
			$plotDiv.append($plot);

			var $posterDiv = $('<div>');
			$posterDiv.attr('id', 'posterDiv');
			var $poster = $('<img>')
			$poster.attr('src', posterSrc);
			$posterDiv.append($poster);

			$movieDataDiv.append($posterDiv, $titleDiv, $releaseDiv, $plotDiv);






		});
	};

// On click functions /////////////////////////////////////////////////////////////////////


	// function for when the user clicks the "Add Movie!" button for the form in the navbar
	$addButton.on('click', function(){

		// hide the error message if it is shown
		$('#movieExistsAlert').hide();

		// Take input from text box and add to button array for rendering
		var movie = $movieInput.val().trim();

		// verify user input before pushing to array

		if(movieTitleValid(movie)){
			buttonArray.push(movie);
		};

		// render the buttons in the buttonArray
		renderButtons();

		// clears the form of the user's previous input
		$movieInput.val('');

		// return false so that users can hit 'enter' without changing pages
		return false;
	});


	// when the user clicks on an individual movie button
	$(document).on("click", '.movie', function(){

		// clear the div of all gifs
		$gifDiv.empty();

		// call the giphy API with the button clicked as an argument
		getGifs($(this));

		movieInfo($(this));
	});


	// when the user click on a gif
	$(document).on('click', '.gif', function(){

		// create variable for event
		var $gif = $(this);
		// create array of all current gifs
		var $gifs = $('.gif');

		// if a gif is currently playing, stop it
		if($gif.attr('src') == $gif.data('gif')){

			$gif.attr('src', $gif.data('gifStill'))

		}else{

			// stop all gifs
			stopGifs($gifs);

			// play the current gif
			$gif.attr('src', $gif.data('gif'))
		}
	});

	// make sure alert is hidden to start
	$('#movieExistsAlert').hide();

	// render the default buttons on page load
	renderButtons();


}); // end of jQuery
