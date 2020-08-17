
   
      // This .on("click") function will trigger the AJAX Call
      var currentTimeZoneInSeconds="";
      var totalTimeZoneOffsetInSeconds="";
      $('.farn').hide();
      $('.fefarn').hide();
      $("#find-city").on("click", function(event) {
        let apiKey = '&appid=9a7029fbfe4996b5ec005452b631a685';
        console.log(apiKey);
        event.preventDefault();
        var city = $("#weather-input").val();
        console.log(city);
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
        console.log(queryURL);
    
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
          // dumps all the data in weather-view text area
          $("#weather-view").text(JSON.stringify(response));

          // displays searched city
          $(".serchedCity").text(response.name + "        " );
          var fullDateDay = moment().format('dddd, MMMM Do');
          $(".date").text( fullDateDay);
          var tempF = (response.main.temp - 273.15) * 1.80 + 32;
          $(".temp").text( tempF.toFixed(2));
          var feelsLikeTempF = (response.main.feels_like - 273.15) * 1.80 + 32;
          $(".tempFeelsLike").text("Feels: " + feelsLikeTempF.toFixed(2));
          $('.farn').show();
          $('.fefarn').show();
          $(".sky").text(response.weather[0].description);
          $(".humidity").text("Humidity: " + response.main.humidity +"%");
          $(".wind").text("Wind: " + response.wind.speed + " mph");
          currentTimeZoneInSeconds = new Date().getTimezoneOffset() * 60;
          totalTimeZoneOffsetInSeconds = response.timezone + currentTimeZoneInSeconds;
          var sunriseDateTime = new Date(response.sys.sunrise * 1000);
          sunriseDateTime.setUTCSeconds(totalTimeZoneOffsetInSeconds);
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
    
        var queryURL =`https://api.openweathermap.org/data/2.5/onecall?appid=4e1d3f7a2819df21862189cf606302c7&lat=${cordslat}&lon=${cordslon}`

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
                var tempFeeels = (response.daily[i].feels_like.day - 273.15) * 1.80 + 32;             
                var sunriseDateTime = new Date(response.daily[i].sunrise * 1000);         
                sunriseDateTime.setUTCSeconds(totalTimeZoneOffsetInSeconds);          
                var sunsetDateTime = new Date(response.daily[i].sunset * 1000);
                sunsetDateTime.setUTCSeconds(totalTimeZoneOffsetInSeconds);     
              //  var dayCard =`<div class="col-lg"><div class="card"><p class="card-title">${currentDayb}</p><p><img src="http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}.png"></p><p>Temp: ${temp.toFixed(2)} &#8457;</p><p>Humidity: ${response.daily[i].humidity}%</p><p>Sky: ${response.daily[i].weather[0].description}</p><p>Wind: ${response.daily[i].wind_speed} mph</p><p>UVI: ${response.daily[i].uvi}</p></div></div>`
                $(".date-one").text(currentDayb);  
                $(".temp-day-one").text(temp.toFixed(2));
                $(".tempFeelsLike-day-1").text("Feels: " + tempFeeels.toFixed(2));
                $(".sky-day-1").text(response.daily[i].weather[0].description);
                $(".sunrise-day-1").text("Sunrise: " + sunriseDateTime.toLocaleTimeString());
                $(".sunset-day-1").text("Sunset: " + sunsetDateTime.toLocaleTimeString());
                $(".wind-day-1").text("Wind: " + response.daily[i].wind_speed + " mph");
                $(".humidity-day-1").text("Humidity: " + response.daily[i].humidity);
                var dailyuvindex =response.daily[i].uvi
                if(dailyuvindex< 4){
                    $(".uv-day-1").text("UV Index: " + response.daily[i].uvi);
                    $(".uv-day-1").css("background-color", "green");
                 
                  }else if(dailyuvindex > 4 && dailyuvindex < 7){
                    $(".uv-day-1").text("UV Index: " + response.daily[i].uvi);
                    $(".uv-day-1").css("background-color", "yellow");
                      
                 }else if(dailyuvindex> 7){
                     $(".uv-day-1").text("UV Index: " + response.daily[i].uvi);
                    $(".uv-day-1").css("background-color", "red");   
                  
                  }

              }
          });
      
          
      }