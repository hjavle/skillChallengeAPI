      
      // This .on("click") function will trigger the AJAX Call
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
        var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
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
          $(".serchedCity").text("Weather for " + response.name);

          // gets current date and formats into mm/dd/yyy format
          var fullDate = new Date(totalTimeZoneOffsetInSeconds).toLocaleDateString();

          //displays date next to searched city
          $(".date").text(" as of " + fullDate);

          // Convert the temp to fahrenheit
          var tempF = (response.main.temp - 273.15) * 1.80 + 32;

          //displays temperature in Fahrenheit 
          // toFixed(2) formats only two digits after decimal point
          $(".temp").text(": " + tempF.toFixed(2));

          // Convert the temp to fahrenheit
          var feelsLikeTempF = (response.main.feels_like - 273.15) * 1.80 + 32;

          //displays temperature in Fahrenheit 
          // toFixed(2) formats only two digits after decimal point
          $(".tempFeelsLike").text(": " + feelsLikeTempF.toFixed(2));


          // displays weather description 
          $(".sky").text(": " + response.weather[0].description);

          //displays humidity
          $(".humidity").text(": " + response.main.humidity +"%");

          // displays wind speed
          $(".wind").text(": " + response.wind.speed + " mph");

          // returns timezone offset difference in minutes for local time 
          //it then converted in seconds and stores in variable
          var currentTimeZoneInSeconds = new Date().getTimezoneOffset() * 60;
          
          // Add the offset difference in seconds to current time zone (in seconds)and store it in variable
          var totalTimeZoneOffsetInSeconds = response.timezone + currentTimeZoneInSeconds;
          
          var sunriseDateTime = new Date(response.sys.sunrise * 1000);
          
          //setUTSSeconds method sets time for the searched time zone time with given total calculated 
          //offset time in seconds as a parameter
          sunriseDateTime.setUTCSeconds(totalTimeZoneOffsetInSeconds);
          
          // time in seconds is converted into readable time format and displayed
          $(".sunrise").text(": " + sunriseDateTime.toLocaleTimeString());

          var sunsetDateTime = new Date(response.sys.sunset * 1000);
          sunsetDateTime.setUTCSeconds(totalTimeZoneOffsetInSeconds);
          $(".sunset").text(": " + sunsetDateTime.toLocaleTimeString());
        });
      })