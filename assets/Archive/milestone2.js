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
    citySearchButton.click(searchCity);
    citySearchButton.click(saveCitySearch);

    const cityListItem      =$("#previous-searches");
    cityListItem.click(historyButtonClicked);

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

    function searchCity(){
        citySearchString  = citySearchBar.val().toLowerCase();
        console.log("search bar entry = ", citySearchString);

        //API 
        const apiKey = "6596f8a519cb058366e60eae7ab55b85";
        const currentWeatherUrl = 
          "https://api.openweathermap.org/data/2.5/weather?"  +
          "q=" + citySearchString + 
          "&units=metric" + 
          "&appid=" + apiKey; 

        // get api call 
        $.ajax({ url: currentWeatherUrl, method: "GET" }).then( function(cityData){
            [cityLat, cityLon] = dealWithCityData(cityData).then(searchCoordinates(cityLat, cityLon));
              
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

        cityNameTitle.html(
            cityData.name +
            " " );
        cityTemp.html("Temperature: " + cityData.main.temp + '<span class="units"> ºCelsius </span>');
        cityHumid.html("Humidity: " + cityData.main.humidity + '<span class="units"> % </span>');
        cityWind.html("Wind Speed: " + cityData.wind.speed + '<span class="units"> meter/sec </span>');

        // get lat and long coordinates to search for uv from second api
        cityLon = cityData.coord.lon
        cityLat = cityData.coord.lat
        // console.log([cityLat, cityLon]);
        
        return [cityLat, cityLon];
    }

    // when the coordinates have been received show the:
    // UV
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
        
        // show 5 day forcast
        // get day 1 and add value 0 
        let dayOne = $("#day-one").html(
            '<h5>Date...</h5>' +
            '<p class="five-day">Temp: ' + oneCallData.daily[0].temp.day + ' ºc </p>' +
            '<p class="five-day">Humidity: ' + oneCallData.daily[0].humidity + ' % </p>'
        )

        let dayTwo = $("#day-two").html(
            '<h5>Date...</h5>' +
            '<p class="five-day">Temp: ' + oneCallData.daily[1].temp.day + ' ºc </p>' +
            '<p class="five-day">Humidity: ' + oneCallData.daily[1].humidity + ' % </p>'
        )

        let dayThree = $("#day-three").html(
            '<h5>Date...</h5>' +
            '<p class="five-day">Temp: ' + oneCallData.daily[2].temp.day + ' ºc </p>' +
            '<p class="five-day">Humidity: ' + oneCallData.daily[2].humidity + ' % </p>'
        )

        let dayFour = $("#day-four").html(
            '<h5>Date...</h5>' +
            '<p class="five-day">Temp: ' + oneCallData.daily[3].temp.day + ' ºc </p>' +
            '<p class="five-day">Humidity: ' + oneCallData.daily[3].humidity + ' % </p>'
        )

        let dayFive = $("#day-five").html(
            '<h5>Date...</h5>' +
            '<p class="five-day">Temp: ' + oneCallData.daily[4].temp.day + ' ºc </p>' +
            '<p class="five-day">Humidity: ' + oneCallData.daily[4].humidity + ' % </p>'
        )

    }


   // let searchHistory= [];
    
    function saveCitySearch(){
        console.log("city search is saving");
        
        // if (localStorage.getItem("save city search data") == null) {
            let retrieveStorageItem = JSON.parse(localStorage.getItem("save city search data")) || [];
            console.log(retrieveStorageItem, "Getting from LS")
          //  const storageItem = JSON.parse(retrieveStorageItem);
            
        // }
            let isNewSearch = checkCitySearchHistory(citySearchString, retrieveStorageItem);
            console.log("isNewSearch = ", isNewSearch);

            if (isNewSearch == true){
                console.log("this has been searched before");

            } else {
                if(retrieveStorageItem.length == 4){
                    retrieveStorageItem.shift();
                }
             //   searchHistory.push(citySearchString);
                retrieveStorageItem.push(citySearchString);
              console.log("searchHistory after = ", retrieveStorageItem);
                localStorage.setItem("save city search data", JSON.stringify(retrieveStorageItem));
            }
        
            
            //Display history
           // console.log("storageItem before =" , storageItem);
           // console.log("storageItem after =" , storageItem);
           // console.log("storageItem.length =" , storageItem.length);
            
            // Add to history
            displaySearchHistory();
            
        

    }

    function displaySearchHistory() {
        cityListItem.empty();
        let retrieveStorageItem = JSON.parse(localStorage.getItem("save city search data")) || [];
        for (let index = 0; index < retrieveStorageItem.length; index++) {
            console.log("index =", index);
            cityListItem.prepend('<li class="list-group-item" onclick="#">' + retrieveStorageItem[index] + '</li>')
        }
    }

    function checkCitySearchHistory(citySearch, retrieveStorageItem){
        // I want to search searchHistory 
        console.log("citySearch = ", citySearch);

        let cityHistory = retrieveStorageItem.includes(citySearch);
        console.log("has the city been search before? = ", cityHistory);

        return cityHistory;
    }

    function historyButtonClicked(){
        console.log("history button clicked = ");
    }

    




    displaySearchHistory();



});