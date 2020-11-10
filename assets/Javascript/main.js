
//bug do not save a none search 
// not resolved. 

$(document).ready(function () {

	// Aside bar 
	const citySearchBar = $("#city-search");

	const citySearchButton = $("#search-btn")
	citySearchButton.click(getSearchBarValue);
	// citySearchButton.click(saveCitySearch);

	const cityListItem = $("#previous-searches");
	cityListItem.on("click", "li", historyButtonClicked);

	const dropdownHistory = $("#dropdown-history");
	dropdownHistory.on("click", "a", historyButtonClicked);

	const fetchStatus = $("#fetch-status");

	//Article top 

	const cityNameTitle = $("#city-name");
	const cityTemp = $("#temperature");
	const cityHumid = $("#humidity");
	const cityWind = $("#wind-speed");
	const cityUV = $("#uv-index");

	let displayLastCity = JSON.parse(localStorage.getItem("lastSearch"));

	// Icon list 
	var symbolDictionary = {
		'01d': 'wi-day-sunny',
		'02d': 'wi-day-cloudy',
		'03d': 'wi-cloud',
		'04d': 'wi-cloudy',
		'09d': 'wi-showers',
		'10d': 'wi-day-rain-mix',
		'11d': 'wi-thunderstorm',
		'13d': 'wi-snow',
		'50d': 'wi-fog',
		'01n': 'wi-night-clear',
		'02n': 'wi-night-alt-cloudy',
		'03n': 'wi-night-alt-cloudy-high',
		'04n': 'wi-cloudy',
		'09n': 'wi-night-alt-sprinkle',
		'10n': 'wi-night-alt-showers',
		'11n': 'wi-night-alt-thunderstorm',
		'13n': 'wi-night-alt-snow',
		'50n': 'wi-night-fog'
	};

	//state variables 
	let cityLatLong;
	let cityLat;
	let cityLon;
	let citySearchString;
	let lastSearchedCity;
	// console.log("lastSearchedCity =", lastSearchedCity);

	// when city name is typed into search field  return city name as lowercase string. 
	function getSearchBarValue() {
		let searchBarString = citySearchBar.val().toLowerCase();
		// console.log("search bar entry = ", citySearchBar.val());
		// console.log(typeof(searchBarString));

		if(searchBarString == ""){
			// console.log("empty string");
			citySearchBar.attr("placeholder", "Please enter a valid search");
		} else {
			searchCity(searchBarString);
			saveCitySearch(searchBarString);
			savelastSearchedCity(searchBarString);
		}

	}

	function savelastSearchedCity(lastcity){
		// console.log("lastcity =",lastcity);
		lastSearchedCity = lastcity;
		localStorage.setItem("lastSearch", JSON.stringify(lastcity));
	}

	function displayLastSearchedCity(lastSearchedCity){
		if (lastSearchedCity != null){
			searchCity(lastSearchedCity);

		}
	}

	function searchCity(citySearchString) {
		// console.log("searchCity function is running with value =", citySearchString);

		//API 
		const apiKey = "6596f8a519cb058366e60eae7ab55b85";
		const currentWeatherUrl =
			"https://api.openweathermap.org/data/2.5/weather?" +
			"q=" + citySearchString +
			"&units=metric" +
			"&appid=" + apiKey;

		// get api call 
		$.ajax({ url: currentWeatherUrl, method: "GET" }).then(function (cityData) {

			[cityLat, cityLon] = dealWithCityData(cityData)
			searchCoordinates(cityLat, cityLon);

		});

		return citySearchString;
	}

	function searchCoordinates(cityLat, cityLon) {
		// console.log("lat and long = ", cityLat, cityLon);

		const apiKey = "6596f8a519cb058366e60eae7ab55b85";
		const oneCallApiUrl =
			"https://api.openweathermap.org/data/2.5/onecall?" +
			"lat=" + cityLat +
			"&lon=" + cityLon +
			"&exclude=" + "hourly,minutely" +
			"&cnt=" + "5" +
			"&units=metric" +
			"&appid=" + apiKey;

		// get api call 
		$.ajax({ url: oneCallApiUrl, method: "GET" }).then(function (oneCallData) {
			dealWithOneCallData(oneCallData);
		});
	}

	// when the city name has been received show the:
	// city name
	// temperature
	// humidity
	// wind speed

	function dealWithCityData(cityData) {
		// console.log('cityData =', cityData);
		//   console.log('cityData =', symbolDictionary[cityData.weather[0].icon] );
		cityNameTitle.html(
			cityData.name + " " + '<i class="wi ' + symbolDictionary[cityData.weather[0].icon] + ' main-icon"></i>'
		);

		cityTemp.html("Temperature: " + cityData.main.temp + '<span class="units"> ºCelsius </span>');
		cityHumid.html("Humidity: " + cityData.main.humidity + '<span class="units"> % </span>');
		cityWind.html("Wind Speed: " + cityData.wind.speed + '<span class="units"> meter/sec </span>');

		// get lat and long coordinates to search for uv from second api
		cityLon = cityData.coord.lon
		cityLat = cityData.coord.lat
		// console.log([cityLat, cityLon]);
		return [cityLat, cityLon];
	}

	// when the coordinates have been received show the: UV
	// ONE CALL API DEALS WITH THE UV AND THE 5 DAY FORCAST
	function dealWithOneCallData(oneCallData) {
		// console.log('oneCallData =', oneCallData);

		// WHEN I view the UV value
		// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
		let currentUV = oneCallData.current.uvi;
		if (currentUV < 3) {
			// console.log("UV rating Low");
			cityUV.html('UV Index: ' + '<span class="uv-index uv-index-low">' + oneCallData.current.uvi + '</span>');

		} else if ((currentUV >= 3) && (currentUV < 6)) {
			// console.log("UV rating Moderate");
			cityUV.html('UV Index: ' + '<span class="uv-index uv-index-moderate">' + oneCallData.current.uvi + '</span>');

		} else if ((currentUV >= 6) && (currentUV < 8)) {
			// console.log("UV rating High");
			cityUV.html('UV Index: ' + '<span class="uv-index uv-index-high">' + oneCallData.current.uvi + '</span>');

		} else if ((currentUV >= 8) && (currentUV < 10)) {
			// console.log("UV rating very High");
			cityUV.html('UV Index: ' + '<span class="uv-index uv-index-vhigh">' + oneCallData.current.uvi + '</span>');

		} else if (currentUV >= 10) {
			// console.log("UV rating Extream");
			cityUV.html('UV Index: ' + '<span class="uv-index uv-index-extream">' + oneCallData.current.uvi + '</span>');
		};

		// show 5 day forcast
		// get day 1 and add value 0 
		let dayOne = $("#day-one").html(
			'<h5>' + moment().add(1, 'days').format('dddd') + '</h5>' +
			'<i class="wi ' + symbolDictionary[oneCallData.daily[0].weather[0].icon] + ' forecast-icon"></i>' +
			'<p class="five-day">Temp: ' + oneCallData.daily[0].temp.day + ' ºc </p>' +
			'<p class="five-day">Humidity: ' + oneCallData.daily[0].humidity + ' % </p>'
			// '<img src="http://openweathermap.org/img/w/' + oneCallData.daily[0].weather[0].icon + '.png" />'
		)
		// console.log(symbolDictionary[oneCallData.daily[0].weather[0].icon]);

		let dayTwo = $("#day-two").html(
			'<h5>' + moment().add(2, 'days').format('dddd') + '</h5>' +
			'<i class="wi ' + symbolDictionary[oneCallData.daily[1].weather[0].icon] + ' forecast-icon"></i>' +
			'<p class="five-day">Temp: ' + oneCallData.daily[1].temp.day + ' ºc </p>' +
			'<p class="five-day">Humidity: ' + oneCallData.daily[1].humidity + ' % </p>'
			// '<img src="http://openweathermap.org/img/w/' + oneCallData.daily[1].weather[0].icon + '.png" />'
		)
		// console.log(symbolDictionary[oneCallData.daily[1].weather[0].icon]);

		let dayThree = $("#day-three").html(
			'<h5>' + moment().add(3, 'days').format('dddd') + '</h5>' +
			'<i class="wi ' + symbolDictionary[oneCallData.daily[2].weather[0].icon] + ' forecast-icon"></i>' +
			'<p class="five-day">Temp: ' + oneCallData.daily[2].temp.day + ' ºc </p>' +
			'<p class="five-day">Humidity: ' + oneCallData.daily[2].humidity + ' % </p>'
			// '<img src="http://openweathermap.org/img/w/' + oneCallData.daily[2].weather[0].icon + '.png" />'
		)
		// console.log(symbolDictionary[oneCallData.daily[0].weather[0].icon]);

		let dayFour = $("#day-four").html(
			'<h5>' + moment().add(4, 'days').format('dddd') + '</h5>' +
			'<i class="wi ' + symbolDictionary[oneCallData.daily[3].weather[0].icon] + ' forecast-icon"></i>' +
			'<p class="five-day">Temp: ' + oneCallData.daily[3].temp.day + ' ºc </p>' +
			'<p class="five-day">Humidity: ' + oneCallData.daily[3].humidity + ' % </p>'
			// '<img src="http://openweathermap.org/img/w/' + oneCallData.daily[3].weather[0].icon + '.png" />'
		)

		let dayFive = $("#day-five").html(
			'<h5>' + moment().add(5, 'days').format('dddd') + '</h5>' +
			'<i class="wi ' + symbolDictionary[oneCallData.daily[4].weather[0].icon] + ' forecast-icon "></i>' +
			'<p class="five-day">Temp: ' + oneCallData.daily[4].temp.day + ' ºc </p>' +
			'<p class="five-day">Humidity: ' + oneCallData.daily[4].humidity + ' % </p>'
			// '<img src="http://openweathermap.org/img/w/' + oneCallData.daily[4].weather[0].icon + '.png" />'
		)

	}

	function initialScreenDisplay() {
		let dayOne = $("#day-one").html(
			'<h5>' + moment().add(1, 'days').format('dddd') + '</h5>'
		)

		let dayTwo = $("#day-two").html(
			'<h5>' + moment().add(2, 'days').format('dddd') + '</h5>'
		)

		let dayThree = $("#day-three").html(
			'<h5>' + moment().add(3, 'days').format('dddd') + '</h5>'
		)

		let dayFour = $("#day-four").html(
			'<h5>' + moment().add(4, 'days').format('dddd') + '</h5>'
		)

		let dayFive = $("#day-five").html(
			'<h5>' + moment().add(5, 'days').format('dddd') + '</h5>'
		)
	}


	function saveCitySearch(citySearchString) {
		// console.log("city search is saving");
		let searchHistory = JSON.parse(localStorage.getItem("save city search data")) || [];
		// console.log(searchHistory, "Getting from LS");

		let isOldSearch = checkCitySearchHistory(citySearchString, searchHistory);
		// console.log("isOldSearch = ", isOldSearch);

		if (isOldSearch == true) {
			// console.log("this has been searched before");

		} else {
			if (searchHistory.length == 9) {
				searchHistory.shift();
			}
			searchHistory.push(citySearchString);
			// console.log("searchHistory = ", searchHistory);
			// Add to history
			localStorage.setItem("save city search data", JSON.stringify(searchHistory));
		}
		//Display history
		displaySearchHistory();
	}

	// CALLED AT THE END FOR AUTO RELOAD AND IN - SaveCitySearch()
	function displaySearchHistory() {
		cityListItem.empty();
		dropdownHistory.empty();
		let searchHistory = JSON.parse(localStorage.getItem("save city search data")) || [];
		for (let index = 0; index < searchHistory.length; index++) {
			// console.log("index =", index);
			let titledSearchHistory = titleCase(searchHistory[index]);
			cityListItem.prepend('<li class="list-group-item">' + titledSearchHistory + '</li>');
			dropdownHistory.prepend('<a class="dropdown-item">' + titledSearchHistory + '</a>');
		}

	}

	// Moisset,S.(2016).Three ways to title case a sentence in javascript. freecodecamp.org. https://www.freecodecamp.org/news/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27/
	function titleCase(stringToConvert) {
		stringToConvert = stringToConvert.toLowerCase().split(' ');
		for (var i = 0; i < stringToConvert.length; i++) {
			stringToConvert[i] = stringToConvert[i].charAt(0).toUpperCase() + stringToConvert[i].slice(1);
		}
		return stringToConvert.join(' ');
	}

	//CALLED IN - SaveCitySearch()
	function checkCitySearchHistory(citySearch, searchHistory) {
		// console.log("citySearch = ", citySearch);
		let cityHistory = searchHistory.includes(citySearch);
		// console.log("has the city been search before? = ", cityHistory);
		return cityHistory;

	}

	//CALLED BY EVENT LISTENER
	function historyButtonClicked() {
		// console.log("history button clicked = ", $(this).text());

		// when button clicked, get the value back
		let clickedValue = $(this).text();
		// console.log("the button clicked is =", clickedValue);

		//set the search as this value.
		searchCity(clickedValue);
		savelastSearchedCity(clickedValue);
	}

	initialScreenDisplay();
	displayLastSearchedCity(displayLastCity);
	displaySearchHistory();

});