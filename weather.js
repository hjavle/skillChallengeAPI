
   
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
          console.log(response);
          // displays searched city
          $(".serchedCity").text(response.name + " Weather Forecast" );
          var fullDateDay = moment().format('dddd, MMMM Do');
          $(".date").text( " Today "+ fullDateDay);
          var tempF = (response.main.temp - 273.15) * 1.80 + 32;
          $(".temp").text( tempF.toFixed(2));
          var feelsLikeTempF = (response.main.feels_like - 273.15) * 1.80 + 32;
          $(".tempFeelsLike").text("Feels: " + feelsLikeTempF.toFixed(2));
          $('.farn').show();
          $('.fefarn').show();
          var iconcode = response.weather[0].icon;
          var iconurl = "http://openweathermap.org/img/wn/" + iconcode + ".png";
          $('#wicon').attr('src', iconurl);
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

 //            for(var i = 0; i < 5; i++){
              
                var currentDayb = moment().add(dayCounter, 'day').format('dddd, MMMM Do');
                var temp = (response.daily[0].temp.day - 273.15) * 1.80 + 32;
                var tempFeeels = (response.daily[0].feels_like.day - 273.15) * 1.80 + 32;             
                var sunriseDateTime = new Date(response.daily[0].sunrise * 1000);         
                sunriseDateTime.setUTCSeconds(totalTimeZoneOffsetInSeconds);          
                var sunsetDateTime = new Date(response.daily[0].sunset * 1000);
                sunsetDateTime.setUTCSeconds(totalTimeZoneOffsetInSeconds);     
              //  var dayCard =`<div class="col-lg"><div class="card"><p class="card-title">${currentDayb}</p><p><img src="http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}.png"></p><p>Temp: ${temp.toFixed(2)} &#8457;</p><p>Humidity: ${response.daily[i].humidity}%</p><p>Sky: ${response.daily[i].weather[0].description}</p><p>Wind: ${response.daily[i].wind_speed} mph</p><p>UVI: ${response.daily[i].uvi}</p></div></div>`
                $(".date-one").text(currentDayb);  
                $(".temp-day-one").text(temp.toFixed(2));
                $(".tempFeelsLike-day-1").text("Feels: " + tempFeeels.toFixed(2));
                var iconcodeDayOne = response.daily[0].weather[0].icon;
                var iconurlDayOne = "http://openweathermap.org/img/w/" + iconcodeDayOne + ".png";
                $('#wicon-day-1').attr('src', iconurlDayOne);
                $(".sky-day-1").text(response.daily[0].weather[0].description);
                $(".sunrise-day-1").text("Sunrise: " + sunriseDateTime.toLocaleTimeString());
                $(".sunset-day-1").text("Sunset: " + sunsetDateTime.toLocaleTimeString());
                $(".wind-day-1").text("Wind: " + response.daily[0].wind_speed + " mph");
                $(".humidity-day-1").text("Humidity: " + response.daily[0].humidity);
                var dailyuvindex =response.daily[0].uvi
                if(dailyuvindex< 4){
                    $(".uv-day-1").text("UV Index: " + response.daily[0].uvi);
                    $(".uv-day-1").css("background-color", "green");
                 
                  }else if(dailyuvindex > 4 && dailyuvindex < 7){
                    $(".uv-day-1").text("UV Index: " + response.daily[0].uvi);
                    $(".uv-day-1").css("background-color", "yellow");
                      
                 }else if(dailyuvindex> 7){
                     $(".uv-day-1").text("UV Index: " + response.daily[0].uvi);
                    $(".uv-day-1").css("background-color", "red");   
                  
                  }
                
                var currentDayb = moment().add(dayCounter+1, 'day').format('dddd, MMMM Do');
                var temp = (response.daily[1].temp.day - 273.15) * 1.80 + 32;
                var tempFeeels = (response.daily[1].feels_like.day - 273.15) * 1.80 + 32;             
                var sunriseDateTimeOne = new Date(response.daily[1].sunrise * 1000);         
                sunriseDateTimeOne.setUTCSeconds(totalTimeZoneOffsetInSeconds);          
                var sunsetDateTimeOne = new Date(response.daily[1].sunset * 1000);
                sunsetDateTimeOne.setUTCSeconds(totalTimeZoneOffsetInSeconds);     
              //  var dayCard =`<div class="col-lg"><div class="card"><p class="card-title">${currentDayb}</p><p><img src="http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}.png"></p><p>Temp: ${temp.toFixed(2)} &#8457;</p><p>Humidity: ${response.daily[i].humidity}%</p><p>Sky: ${response.daily[i].weather[0].description}</p><p>Wind: ${response.daily[i].wind_speed} mph</p><p>UVI: ${response.daily[i].uvi}</p></div></div>`
                $(".date-two").text(currentDayb);  
                $(".temp-day-two").text(temp.toFixed(2));
                $(".tempFeelsLike-day-2").text("Feels: " + tempFeeels.toFixed(2));
                var iconcodeDayTwo = response.daily[1].weather[0].icon;
                var iconurlDayTwo = "http://openweathermap.org/img/w/" + iconcodeDayTwo + ".png";
                $('#wicon-day-2').attr('src', iconurlDayTwo);
                $(".sky-day-2").text(response.daily[1].weather[0].description);
                $(".sunrise-day-2").text("Sunrise: " + sunriseDateTimeOne.toLocaleTimeString());
                $(".sunset-day-2").text("Sunset: " + sunsetDateTimeOne.toLocaleTimeString());
                $(".wind-day-2").text("Wind: " + response.daily[1].wind_speed + " mph");
                $(".humidity-day-2").text("Humidity: " + response.daily[1].humidity);
                var dailyuvindex =response.daily[1].uvi
                if(dailyuvindex< 4){
                    $(".uv-day-2").text("UV Index: " + response.daily[1].uvi);
                    $(".uv-day-2").css("background-color", "green");
                 
                  }else if(dailyuvindex > 4 && dailyuvindex < 7){
                    $(".uv-day-2").text("UV Index: " + response.daily[1].uvi);
                    $(".uv-day-2").css("background-color", "yellow");
                      
                 }else if(dailyuvindex> 7){
                     $(".uv-day-2").text("UV Index: " + response.daily[1].uvi);
                    $(".uv-day-2").css("background-color", "red");   
                  
                  } 

              
                var currentDayb = moment().add(dayCounter+2, 'day').format('dddd, MMMM Do');
                var temp = (response.daily[2].temp.day - 273.15) * 1.80 + 32;
                var tempFeeels = (response.daily[2].feels_like.day - 273.15) * 1.80 + 32;             
                var sunriseDateTimeTwo = new Date(response.daily[2].sunrise * 1000);         
                sunriseDateTimeTwo.setUTCSeconds(totalTimeZoneOffsetInSeconds);          
                var sunsetDateTimeTwo = new Date(response.daily[2].sunset * 1000);
                sunsetDateTimeTwo.setUTCSeconds(totalTimeZoneOffsetInSeconds);     
              //  var dayCard =`<div class="col-lg"><div class="card"><p class="card-title">${currentDayb}</p><p><img src="http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}.png"></p><p>Temp: ${temp.toFixed(2)} &#8457;</p><p>Humidity: ${response.daily[i].humidity}%</p><p>Sky: ${response.daily[i].weather[0].description}</p><p>Wind: ${response.daily[i].wind_speed} mph</p><p>UVI: ${response.daily[i].uvi}</p></div></div>`
                $(".date-three").text(currentDayb);  
                $(".temp-day-three").text(temp.toFixed(2));
                $(".tempFeelsLike-day-3").text("Feels: " + tempFeeels.toFixed(2));
                var iconcodeDayThree = response.daily[2].weather[0].icon;
                var iconurlDayThree = "http://openweathermap.org/img/w/" + iconcodeDayThree + ".png";
                $('#wicon-day-3').attr('src', iconurlDayThree);
                $(".sky-day-3").text(response.daily[2].weather[0].description);
                $(".sunrise-day-3").text("Sunrise: " + sunriseDateTime.toLocaleTimeString());
                $(".sunset-day-3").text("Sunset: " + sunsetDateTime.toLocaleTimeString());
                $(".wind-day-3").text("Wind: " + response.daily[2].wind_speed + " mph");
                $(".humidity-day-3").text("Humidity: " + response.daily[2].humidity);
                var dailyuvindex =response.daily[2].uvi
                if(dailyuvindex< 4){
                    $(".uv-day-3").text("UV Index: " + response.daily[2].uvi);
                    $(".uv-day-3").css("background-color", "green");
                 
                  }else if(dailyuvindex > 4 && dailyuvindex < 7){
                    $(".uv-day-3").text("UV Index: " + response.daily[2].uvi);
                    $(".uv-day-3").css("background-color", "yellow");
                      
                 }else if(dailyuvindex> 7){
                     $(".uv-day-3").text("UV Index: " + response.daily[2].uvi);
                    $(".uv-day-3").css("background-color", "red");   
                  
                  } 

                  var currentDayb = moment().add(dayCounter+3, 'day').format('dddd, MMMM Do');
                  var temp = (response.daily[3].temp.day - 273.15) * 1.80 + 32;
                  var tempFeeels = (response.daily[3].feels_like.day - 273.15) * 1.80 + 32;             
                  var sunriseDateTimeThree = new Date(response.daily[3].sunrise * 1000);         
                  sunriseDateTimeThree.setUTCSeconds(totalTimeZoneOffsetInSeconds);          
                  var sunsetDateTimeThree = new Date(response.daily[3].sunset * 1000);
                  sunsetDateTimeThree.setUTCSeconds(totalTimeZoneOffsetInSeconds);     
                //  var dayCard =`<div class="col-lg"><div class="card"><p class="card-title">${currentDayb}</p><p><img src="http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}.png"></p><p>Temp: ${temp.toFixed(2)} &#8457;</p><p>Humidity: ${response.daily[i].humidity}%</p><p>Sky: ${response.daily[i].weather[0].description}</p><p>Wind: ${response.daily[i].wind_speed} mph</p><p>UVI: ${response.daily[i].uvi}</p></div></div>`
                  $(".date-four").text(currentDayb);  
                  $(".temp-day-four").text(temp.toFixed(2));
                  $(".tempFeelsLike-day-4").text("Feels: " + tempFeeels.toFixed(2));
                  var iconcode = response.daily[3].weather[0].icon;
                  var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                  $('#wicon-day-4').attr('src', iconurl);
                  $(".sky-day-4").text(response.daily[3].weather[0].description);
                  $(".sunrise-day-4").text("Sunrise: " + sunriseDateTime.toLocaleTimeString());
                  $(".sunset-day-4").text("Sunset: " + sunsetDateTime.toLocaleTimeString());
                  $(".wind-day-4").text("Wind: " + response.daily[3].wind_speed + " mph");
                  $(".humidity-day-4").text("Humidity: " + response.daily[3].humidity);
                  var dailyuvindex =response.daily[3].uvi
                  if(dailyuvindex< 4){
                      $(".uv-day-4").text("UV Index: " + response.daily[3].uvi);
                      $(".uv-day-4").css("background-color", "green");
                   
                    }else if(dailyuvindex > 4 && dailyuvindex < 7){
                      $(".uv-day-4").text("UV Index: " + response.daily[3].uvi);
                      $(".uv-day-4").css("background-color", "yellow");
                        
                   }else if(dailyuvindex> 7){
                       $(".uv-day-4").text("UV Index: " + response.daily[3].uvi);
                      $(".uv-day-4").css("background-color", "red");   
                    
                    } 

                    var currentDayb = moment().add(dayCounter+3, 'day').format('dddd, MMMM Do');
                    var temp = (response.daily[4].temp.day - 273.15) * 1.80 + 32;
                    var tempFeeels = (response.daily[4].feels_like.day - 273.15) * 1.80 + 32;             
                    var sunriseDateTimeFour = new Date(response.daily[4].sunrise * 1000);         
                    sunriseDateTimeFour.setUTCSeconds(totalTimeZoneOffsetInSeconds);          
                    var sunsetDateTimeFour = new Date(response.daily[4].sunset * 1000);
                    sunsetDateTimeFour.setUTCSeconds(totalTimeZoneOffsetInSeconds);     
                  //  var dayCard =`<div class="col-lg"><div class="card"><p class="card-title">${currentDayb}</p><p><img src="http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}.png"></p><p>Temp: ${temp.toFixed(2)} &#8457;</p><p>Humidity: ${response.daily[i].humidity}%</p><p>Sky: ${response.daily[i].weather[0].description}</p><p>Wind: ${response.daily[i].wind_speed} mph</p><p>UVI: ${response.daily[i].uvi}</p></div></div>`
                    $(".date-five").text(currentDayb);  
                    $(".temp-day-five").text(temp.toFixed(2));
                    $(".tempFeelsLike-day-5").text("Feels: " + tempFeeels.toFixed(2));
                    var iconcodeDayFive = response.daily[4].weather[0].icon;
                    var iconurlDayFive = "http://openweathermap.org/img/w/" + iconcodeDayFive + ".png";
                    $('#wicon-day-5').attr('src', iconurlDayFive);  
                    $(".sky-day-5").text(response.daily[4].weather[0].description);
                    $(".sunrise-day-5").text("Sunrise: " + sunriseDateTime.toLocaleTimeString());
                    $(".sunset-day-5").text("Sunset: " + sunsetDateTime.toLocaleTimeString());
                    $(".wind-day-5").text("Wind: " + response.daily[4].wind_speed + " mph");
                    $(".humidity-day-5").text("Humidity: " + response.daily[4].humidity);
                    var dailyuvindex =response.daily[3].uvi
                    if(dailyuvindex< 4){
                        $(".uv-day-5").text("UV Index: " + response.daily[4].uvi);
                        $(".uv-day-5").css("background-color", "green");
                     
                      }else if(dailyuvindex > 4 && dailyuvindex < 7){
                        $(".uv-day-5").text("UV Index: " + response.daily[4].uvi);
                        $(".uv-day-5").css("background-color", "yellow");
                          
                     }else if(dailyuvindex> 7){
                         $(".uv-day-5").text("UV Index: " + response.daily[4].uvi);
                        $(".uv-day-5").css("background-color", "red");   
                      
                      } 
    
  


              




              




              








          









         })
      
          
      }