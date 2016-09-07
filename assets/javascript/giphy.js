// Movie Gifaru 
// This app is designed to search Giphy for the most relevant gifs based on a user's input

$(document).ready(function(){

	// Element variables
	var $gifDiv = $("#gifDiv");
	var $buttonDiv = $('#buttonDiv');
	var $movieInput = $('#movieInput');
	var $addSearch = $('#addSearch')




	// holds the movie searches that will be made into buttons, including ones the user
	// inputs
	var buttonArray = ["Indiana Jones", "Star Wars", "The Godfather", "Back to the Future",
	"Jaws", "Close Encounters of the Third Kind", "The Goonies"];


	// General Functions ////////////////////////////////////////////////////////////////////

	function renderButtons(){

		// empty the button div each time buttons are rendered so that they are not repeated

		$buttonDiv.empty();

		// Loop through the array

		for(var i = 0; i < buttonArray.length; i++){

			// create button elements
			var button = $('<button>');

			// give the buttons a class, data 'name', and text
			button.addClass('movie btn btn-info');
			button.attr('data-name', buttonArray[i]);
			button.text(buttonArray[i]);

			// add the button to the button div
			$buttonDiv.append(button);

		};
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
	}


	// function for when the user clicks the "Get Gifs!" button for the form in the navbar
	$addSearch.on('click', function(){

		// Take input from text box and add to button array for rendering
		var movie = $movieInput.val().trim();
		console.log($movieInput.val())

		buttonArray.push(movie);

		// render the buttons in the buttonArray
		renderButtons();

		// return false so that users can hit 'enter' without changing pages
		return false;
	});

	$(document).on("click", '.movie', function(){

		var movie = makeMovieQuery($(this).data('name'));
		var limit = "&limit=10";
		var publicKey = "&api_key=dc6zaTOxFJmzC";
		var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + movie + publicKey + limit;

		$.ajax({url: queryURL, method: 'GET'}).done(function(response) {

			console.log(response)
			var url = response.embed_url;
			var rating = response.rating;


		})




	});


	// render the default buttons on page load
	renderButtons();


}); // end of jQuery