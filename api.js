 
      // This .on("click") function will trigger the AJAX Call
      $('.farn').hide();
      $('.fefarn').hide();
      $("#find-city").on("click", function(event) {
        let apiKey = '&appid=9a7029fbfe4996b5ec005452b631a685';
        console.log(apiKey);
        // event.preventDefault() can be used to prevent an event's default behavior.
        // Here, it prevents the submit button from trying to submit a form when clicked
        event.preventDefault();

        // Here we grab the text from the input box
        var city = $("#weather-input").val();
        console.log(city);
        // Here we construct our URL
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
        console.log(queryURL);
        // Write code between the dashes below to hit the queryURL with $ajax, then take the response data
        // and display it in the div with an id of movie-view

        // ------YOUR CODE GOES IN THESE DASHES. DO NOT MANUALLY EDIT THE HTML ABOVE.
      
      
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
          // dumps all the data in weather-view text area
          $("#weather-view").text(JSON.stringify(response));

          // displays searched city
          $(".serchedCity").text(response.name + "        " );

          // gets current date and formats into mm/dd/yyy format
       
          var fullDateDay = moment().format('dddd, MMMM Do');

          //displays date next to searched city
          $(".date").text( fullDateDay);
        //  $('.currentCityIcon').show(img src="http://openweathermap.org/img/wn/&.currentCityIcon${response.current.weather[0].icon}.png");

          // Convert the temp to fahrenheit
          var tempF = (response.main.temp - 273.15) * 1.80 + 32;

          //displays temperature in Fahrenheit 
          // toFixed(2) formats only two digits after decimal point
          $(".temp").text( tempF.toFixed(2));
          // Convert the temp to fahrenheit
          var feelsLikeTempF = (response.main.feels_like - 273.15) * 1.80 + 32;

          //displays temperature in Fahrenheit 
          // toFixed(2) formats only two digits after decimal point
          $(".tempFeelsLike").text("feels: " + feelsLikeTempF.toFixed(2));
          $('.farn').show();
          $('.fefarn').show();


          // displays weather description 
          $(".sky").text("Sky: " + response.weather[0].description);

          //displays humidity
          $(".humidity").text("Humidity: " + response.main.humidity +"%");

          // displays wind speed
          $(".wind").text("Wind: " + response.wind.speed + " mph");

          // returns timezone offset difference in minutes for local time 
          //it then converted in seconds and stores in variable
          var currentTimeZoneInSeconds = new Date().getTimezoneOffset() * 60;
          
          
          // here we retain searched city's time date object by taking off local time zone offset 
          //as toLocaleTimeString function formats to readable date and time
          var totalTimeZoneOffsetInSeconds = response.timezone + currentTimeZoneInSeconds;
          
          var sunriseDateTime = new Date(response.sys.sunrise * 1000);
          
          //setUTSSeconds method sets time for the searched time zone time with given total calculated 
          //offset time in seconds as a parameter
          sunriseDateTime.setUTCSeconds(totalTimeZoneOffsetInSeconds);
          
          // time in seconds is converted into readable time format and displayed
          $(".sunrise").text("Sunrise: " + sunriseDateTime.toLocaleTimeString());

          var sunsetDateTime = new Date(response.sys.sunset * 1000);
          sunsetDateTime.setUTCSeconds(totalTimeZoneOffsetInSeconds);
          $(".sunset").text("Sunset: " + sunsetDateTime.toLocaleTimeString());

          var cityCordlat = response.coord.lat;
          var cityCordlon = response.coord.lon;
  
          calcUVIndex(cityCordlat, cityCordlon);
  
          show5DayForecast(cityCordlat, cityCordlon);
        
        });
      })
  
      function calcUVIndex(cordslat,cordslon){

        var queryURL =`http://api.openweathermap.org/data/2.5/uvi?appid=4e1d3f7a2819df21862189cf606302c7&lat=${cordslat}&lon=${cordslon}`;
    
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response){
    
            console.log(response);
            
            var currentDayUV = response.value;
            var searchUVIndex = $('.uv');
            console.log(searchUVIndex);
 //$(".uv").text(": " + response.value);
            searchUVIndex.text("UV Index: " + currentDayUV);
    
           if(currentDayUV < 4){
    
           searchUVIndex.attr("style","background: green;");
    
           }else if(currentDayUV > 4 && currentDayUV < 7){
    
               searchUVIndex.attr("style","background: yellow;");
    
          }else if(currentDayUV > 7){
                
           searchUVIndex.attr("style","background: red;");
    
           }
        });
    
    }
    
    function show5DayForecast(cordslat,cordslon){
        //var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=4e1d3f7a2819df21862189cf606302c7`;
    
        var queryURL =`https://api.openweathermap.org/data/2.5/onecall?appid=4e1d3f7a2819df21862189cf606302c7&lat=${cordslat}&lon=${cordslon}`
    
    
        var dayCardsContainer = $('.dayCards');
    
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function(response){
            console.log(response);
            $("#weather-view2").text(JSON.stringify(response));
            $('.dayCards').empty();
            var dayCounter = 1;

            for(var i = 0; i < 5; i++){

                var currentDayb = moment().add(dayCounter, 'day').format('dddd, MMMM Do');
                var temp = (response.daily[i].temp.day - 273.15) * 1.80 + 32;
              //  $ ('.fiveDayForecast').text("Five Day Forecast");
                
                var dayCard =`<div class="col-lg"><div class="card"><p class="card-title">${currentDayb}</p><p><img src="http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}.png"></p><p>Temp: ${temp.toFixed(2)} &#8457;</p><p>Humidity: ${response.daily[i].humidity}%</p><p>Sky: ${response.daily[i].weather[0].description}</p><p>Wind: ${response.daily[i].wind_speed} mph</p><p>UVI: ${response.daily[i].uvi}</p></div></div>`

//               var dayCard =`<div class="col-lg"><div class="card"><p class="card-title">${currentDayb}</p><p><img src="http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}.png"></p><p>Temp: ${temp.toFixed(2)} &#8457;</p><p>Humidity: ${response.daily[i].humidity}%</p></div></div>`
    
                dayCardsContainer.append(dayCard);
    
                dayCounter++;
            }
        });
    
        
    }
      