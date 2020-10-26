// GIVEN a weather dashboard with form inputs
    //yes
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city
    //yes
//and that city is added to the search history
    //yes - server side.
    // no - client side.
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, 
// the temperature, the humidity, the wind speed, and the UV value. 
    //yes
// WHEN I view the UV value
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
    //Yes

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, 
//an icon representation of weather conditions, 
    //no
//the temperature, 
    //yes
//and the humidity,
    //yes
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast

//bug - clear last seached data
    //resolved by updating all html in the line and replacing the append()
//bug do not save a none search 
    // not resolved. 

$(document).ready(function(){

    // Aside bar 
    const citySearchBar     =$("#city-search");
    
    const citySearchButton  =$("#search-btn")
    citySearchButton.click(getSearchBarValue);
    // citySearchButton.click(saveCitySearch);

    const cityListItem      =$("#previous-searches");
    cityListItem.on("click", "li",historyButtonClicked);

    const fetchStatus       = $("#fetch-status");

    //Article top 

    const cityNameTitle =$("#city-name");
    const cityTemp      =$("#temperature");
    const cityHumid     =$("#humidity");
    const cityWind      =$("#wind-speed");
    const cityUV        =$("#uv-index");

    // Icon list 


    //state variables 
    let cityLatLong;
    let cityLat;
    let cityLon;
    let citySearchString;


    //Article bottom

    // check the storage for search history. 
    // let searchHistory = {}

    // if (localStorage.getItem("") == )

    
    // when city name is typed into search field 
    // on click 
    // return city name as lowercase string. 

    function getSearchBarValue(){
        let searchBarString  = citySearchBar.val().toLowerCase();
        console.log("search bar entry = ", searchBarString);

        searchCity(searchBarString);
        saveCitySearch(searchBarString);

    }

    function searchCity(citySearchString){
        console.log("searchCity function is running with value =",citySearchString);

        //API 
        const apiKey = "6596f8a519cb058366e60eae7ab55b85";
        const currentWeatherUrl = 
          "https://api.openweathermap.org/data/2.5/weather?"  +
          "q=" + citySearchString + 
          "&units=metric" + 
          "&appid=" + apiKey; 

        // get api call 
        $.ajax({ url: currentWeatherUrl, method: "GET" }).then( function(cityData){
            
            [cityLat, cityLon] = dealWithCityData(cityData)
            searchCoordinates(cityLat, cityLon);
            
        });

        return citySearchString;
    };

    function searchCoordinates(cityLat, cityLon) {
        console.log("lat and long = ", cityLat, cityLon);

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
        $.ajax({ url: oneCallApiUrl, method: "GET" }).then(function(oneCallData){
            dealWithOneCallData(oneCallData);
        });
    }

    // when the city name has been received show the:
    // city name
    // temperature
    // humidity
    // wind speed

    function dealWithCityData(cityData){
        console.log('cityData =', cityData);

        // let icon = cityData.weather[0].icon;

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

          console.log('cityData =', symbolDictionary[cityData.weather[0].icon] );

        // cityNameTitle.html(
            // cityData.name + " " + '<img src="http://openweathermap.org/img/w/' + cityData.weather[0].icon + '.png" />');
        
        cityNameTitle.html(
            cityData.name + " " + '<i class="wi '+ symbolDictionary[cityData.weather[0].icon] +' main-icon"></i>');

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
    function dealWithOneCallData(oneCallData){
        console.log('oneCallData =', oneCallData);

        // WHEN I view the UV value
        // THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
        let currentUV = oneCallData.current.uvi;
        if (currentUV < 3){
            // console.log("UV rating Low");
            cityUV.html('UV Index: ' + '<span class="uv-index uv-index-low">' + oneCallData.current.uvi + '</span>');

        }else if ((currentUV >= 3) && (currentUV < 6)) {
            // console.log("UV rating Moderate");
            cityUV.html('UV Index: ' + '<span class="uv-index uv-index-moderate">' + oneCallData.current.uvi + '</span>');

        }else if ((currentUV >= 6) && (currentUV < 8)) {
            // console.log("UV rating High");
            cityUV.html('UV Index: ' + '<span class="uv-index uv-index-high">' + oneCallData.current.uvi + '</span>');
            
        }else if ((currentUV >= 8) && (currentUV < 10)) {
            // console.log("UV rating very High");
            cityUV.html('UV Index: ' + '<span class="uv-index uv-index-vhigh">' + oneCallData.current.uvi + '</span>');
            
        }else if (currentUV >= 10) {
            // console.log("UV rating Extream");
            cityUV.html('UV Index: ' + '<span class="uv-index uv-index-extream">' + oneCallData.current.uvi + '</span>');
        };

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

          
        
        // show 5 day forcast
        // get day 1 and add value 0 
        let dayOne = $("#day-one").html(
            '<h5>' + moment().add(1, 'days').format('dddd') + '</h5>' +
            '<i class="wi '+ symbolDictionary[oneCallData.daily[0].weather[0].icon] +' forecast-icon"></i>' +
            '<p class="five-day">Temp: ' + oneCallData.daily[0].temp.day + ' ºc </p>' +
            '<p class="five-day">Humidity: ' + oneCallData.daily[0].humidity + ' % </p>' 
            // '<img src="http://openweathermap.org/img/w/' + oneCallData.daily[0].weather[0].icon + '.png" />'
        )
            console.log(symbolDictionary[oneCallData.daily[0].weather[0].icon]);

        let dayTwo = $("#day-two").html(
            '<h5>' + moment().add(2, 'days').format('dddd') + '</h5>' +
            '<i class="wi '+ symbolDictionary[oneCallData.daily[1].weather[0].icon] +' forecast-icon"></i>' +
            '<p class="five-day">Temp: ' + oneCallData.daily[1].temp.day + ' ºc </p>' +
            '<p class="five-day">Humidity: ' + oneCallData.daily[1].humidity + ' % </p>' 
            // '<img src="http://openweathermap.org/img/w/' + oneCallData.daily[1].weather[0].icon + '.png" />'
        )
            console.log(symbolDictionary[oneCallData.daily[1].weather[0].icon]);

        let dayThree = $("#day-three").html(
            '<h5>' + moment().add(3, 'days').format('dddd') + '</h5>' +
            '<i class="wi '+ symbolDictionary[oneCallData.daily[2].weather[0].icon] +' forecast-icon"></i>' +
            '<p class="five-day">Temp: ' + oneCallData.daily[2].temp.day + ' ºc </p>' +
            '<p class="five-day">Humidity: ' + oneCallData.daily[2].humidity + ' % </p>' 
            // '<img src="http://openweathermap.org/img/w/' + oneCallData.daily[2].weather[0].icon + '.png" />'
        )
            console.log(symbolDictionary[oneCallData.daily[0].weather[0].icon]);

        let dayFour = $("#day-four").html(
            '<h5>' + moment().add(4, 'days').format('dddd') + '</h5>' +
            '<i class="wi '+ symbolDictionary[oneCallData.daily[3].weather[0].icon] +' forecast-icon"></i>' +
            '<p class="five-day">Temp: ' + oneCallData.daily[3].temp.day + ' ºc </p>' +
            '<p class="five-day">Humidity: ' + oneCallData.daily[3].humidity + ' % </p>' 
            // '<img src="http://openweathermap.org/img/w/' + oneCallData.daily[3].weather[0].icon + '.png" />'
        )

        let dayFive = $("#day-five").html(
            '<h5>' + moment().add(5, 'days').format('dddd') + '</h5>' +
            '<i class="wi '+ symbolDictionary[oneCallData.daily[4].weather[0].icon] +' forecast-icon "></i>' +
            '<p class="five-day">Temp: ' + oneCallData.daily[4].temp.day + ' ºc </p>' +
            '<p class="five-day">Humidity: ' + oneCallData.daily[4].humidity + ' % </p>' 
            // '<img src="http://openweathermap.org/img/w/' + oneCallData.daily[4].weather[0].icon + '.png" />'
        )

    }

    function initialScreenDisplay(){
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

    
    function saveCitySearch(citySearchString){
        console.log("city search is saving");
        
        // if (localStorage.getItem("save city search data") == null) {
        //     searchHistory = [];
        // }else {
        //     let retrieveStorageItem = localStorage.getItem("save city search data");
        //     searchHistory = JSON.parse(retrieveStorageItem);
        //     searchHistory.push(citySearchString);
        // }

        let searchHistory = JSON.parse(localStorage.getItem("save city search data")) || [];
            console.log(searchHistory, "Getting from LS");

        let isOldSearch = checkCitySearchHistory(citySearchString, searchHistory);
        console.log("isOldSearch = ", isOldSearch);

        if (isOldSearch == true){
            console.log("this has been searched before");

        } else {
            if(searchHistory.length == 9){
                searchHistory.shift();
            }

            searchHistory.push(titleCase(citySearchString));
            console.log("searchHistory = ", searchHistory);
            // Add to history
            localStorage.setItem("save city search data", JSON.stringify(searchHistory));

        }
        
        //Display history
        displaySearchHistory();    
        
    }

    // CALLED AT THE END FOR AUTO RELOAD AND IN - SaveCitySearch()
    function displaySearchHistory(){

        cityListItem.empty();
        let searchHistory = JSON.parse(localStorage.getItem("save city search data")) || [];
        for (let index = 0; index < searchHistory.length; index++) {
            console.log("index =", index);
            cityListItem.prepend('<li class="list-group-item">' + searchHistory[index] + '</li>')
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
    function checkCitySearchHistory(citySearch, searchHistory){

        // I want to search searchHistory array 
        console.log("citySearch = ", citySearch);

        let cityHistory = searchHistory.includes(citySearch);
        console.log("has the city been search before? = ", cityHistory);

        return cityHistory;

    }

    //CALLED BY EVENT LISTENER
    function historyButtonClicked(){

        console.log("history button clicked = ", $(this).text());

        // when button clicked, get the value back
        let clickedValue = $(this).text();
        console.log("the button clicked is =", clickedValue);

        //set the search as this value.
         
        searchCity(clickedValue);

    }

    displaySearchHistory();
    initialScreenDisplay();







});