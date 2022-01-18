//Global variables
let apiKey = 'fbf31d182481f35e3b9fc07c433c4e62'
var repoList = document.querySelector('myDiv');
var fetchButton = document.getElementById('generateBtn');
var cityNumber = 0;
var startRow = 0;
var remainder = 0;
let units = 'imperial'
let tempUnits = '°F'
let windSpeedUnits = 'MPH'
let cityLat = 0;
let cityLong = 0;
let cityName = ''
let months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
  ];

// First API call to get list of potential cities from geonames
const api_url1 = "http://api.geonames.org/searchJSON?username=lsmith32&country&maxRows=1000&style=Short&cities=cities15000";

// Defining async function
async function getRandomCity(api_url1) {
    
    // Storing response
    const response = await fetch(api_url1);
    
    // Storing data in form of JSON
    var data1 = await response.json();
    //console.log(data1);

    var totalCities = data1.totalResultsCount;
    console.log("cityNumber", totalCities);

    //randomly generates number in array
    cityNumber = Math.floor(Math.random()*totalCities);
    

    startRow = Math.floor(cityNumber/1000);
    remainder = cityNumber%1000;

    const api_url2 = `http://api.geonames.org/searchJSON?username=lsmith32&country&maxRows=1000&style=Full&cities=cities15000&startRow=${startRow}`;

    const response2 = await fetch(api_url2);
    $("#loading-message").text("You're going to ...")
    var data2 = await response2.json();
    
    console.log(data2);

    cityName = data2.geonames[remainder].name;
    var country = data2.geonames[remainder].countryCode;
    cityLat = data2.geonames[remainder].lat
    cityLong = data2.geonames[remainder].lng
    var pSelected = document.getElementById('city');
    $("#loading-message").text(`${cityName}!`)
    pSelected.innerText = "Your next destination: " + cityName;

    //Make the call to get the weather details
    getWeather(cityLat, cityLong, units)

    //Make the call to get the Wikipedia summary
    getWikiSummary(cityName)

}

  //Get the current forecast/weather for the city
  const getWeather = (cityLat, cityLong, units) => {
    //clear historical if it exists
    $("#historical-weather").empty()

    if (cityLat && cityLong) {
      let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&units=${units}&exclude=hourly,minutely,alerts&appid=${apiKey}`
  
      fetch(apiURL).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {

            console.log(data)

            for (let i = 1; i < 6 ; i++) {
              let sevenForecastDate = moment.unix(data.daily[i].dt).format('L')
              let sevenTemp = data.daily[i].temp.day;
              let sevenWind = data.daily[i].wind_speed;
              let sevenHumidity = data.daily[i].humidity;
              let sevenIcon = data.daily[i].weather[0].icon;
  
              let forecastIcon = document.createElement("img")
              forecastIcon.setAttribute("src",`http://openweathermap.org/img/wn/${sevenIcon}.png`)
  
              //add formatting to the forecast boxes
  
              let forecastBox = document.createElement("div")
              forecastBox.id = `weather-day-${[i]}`
              forecastBox.classList.add("w3-card-4", "w3-blue", "w3-col", "m3", "l2", "w3-round")
              let forecastDate = document.createElement("h4")
              forecastDate.textContent = sevenForecastDate
              let forecastTemp = document.createElement("p")
              forecastTemp.textContent = `Temp: ${sevenTemp} ${tempUnits}`
              let forecastWind = document.createElement("p")
              forecastWind.textContent = `Wind: ${sevenWind} ${windSpeedUnits}`
              let forecastHumidity = document.createElement("p")
              forecastHumidity.textContent = `Humidity: ${sevenHumidity}%`
  
              $("#7-day-forecast").append(forecastBox)
              $("#weather-day-"+i).append(forecastDate, forecastIcon, forecastTemp, forecastWind, forecastHumidity)
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    }
  }

  //Event listener to start the search process and get the details for a random city
  fetchButton.addEventListener('click', function(e) {
    if(e.target) {
      console.log("I'm clicked");
      getRandomCity(api_url1);
    }
  });

  //Event listener to switch weather units, and recall the weather details
  let unitsButton = $("#units-button")
  unitsButton.on("click", function () {
      if (units === 'imperial') {
        units='metric'
        unitsButton.text('Metric')
      } else {
        units = 'imperial'
        unitsButton.text('Imperial')
      }

      if (tempUnits === '°F') {
        tempUnits ='°C'
      } else 
      {tempUnits = '°F'
        }

      if (windSpeedUnits === 'MPH') {
        windSpeedUnits='m/s'
      } else 
      {windSpeedUnits = 'MPH'
        }

    //first clear all the HTMl elements, then recall with new values
    $("#7-day-forecast").empty()
    getWeather(cityLat, cityLong, units)

  })

  //event listener for historical weather call
  let historicalButton = $("#historical-button")
  historicalButton.on("click", function () {

    //Switch Button Text
    if (historicalButton.text() === 'Current'){
      historicalButton.text('Historical')
      getHistoricalWeather()
    } else {
      historicalButton.text('Current')
      getWeather(cityLat, cityLong, units)
    }

    
  })

  const getHistoricalWeather =  async () => {

        //clear weather section
        $("#7-day-forecast").empty()

        //Iterate through 12 months of weather data
        for (let i=1; i < 13; i++){

          let historicalWeatherApi = `https://history.openweathermap.org/data/2.5/aggregated/month?lat=${cityLat}&lon=${cityLong}&month=${i}&appid=${apiKey}`
          const response = await fetch(historicalWeatherApi);
          let last12Weather = await response.json();
          console.log(last12Weather)

          //get month
          let month = last12Weather.result.month

          //get temp and convert temp from Kelvin since the API does not support units
          let monthAvgHigh = last12Weather.result.temp.average_max
          if (units === 'imperial') {
            monthAvgHigh = Math.floor(((monthAvgHigh-273.15)*1.8)+32)
          } else {
            monthAvgHigh = Math.floor(monthAvgHigh-273.15)
          }


          let historicalForecastBox = document.createElement("div")
          historicalForecastBox.id = `historical-month${i}`
          historicalForecastBox.classList.add("w3-card-4", "w3-blue", "w3-col", "m2", "l2", "w3-round")
          
          //finding the correct month in the array - need to subtract one as the month array starts a zero vs the result starts at 1
          let monthTitle = document.createElement("h4")
          monthTitle.textContent = months[month - 1]
          
          let avgHighTemp = document.createElement("p")
          avgHighTemp.textContent = `Avg High: ${monthAvgHigh} ${tempUnits}`

          $("#historical-weather").append(historicalForecastBox)
          $("#historical-month"+i).append(monthTitle, avgHighTemp)

          

          

      
        }
  }
//Connect to Wikipedia article summary for the city
  const getWikiSummary = async (city) => {

    //use regex to check for white space and replace with _ as required by API
    let regex = /\s/g;
    city = city.replaceAll(regex, "_" )

    let wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${city}`
    const response = await fetch(wikiUrl);
    let wikiSummary = await response.json();
    console.log(wikiSummary)
    let summary = wikiSummary.extract
    let link = wikiSummary.content_urls.desktop.page

    //build summary div
    let summaryEl = $("#summary")
    // summaryEl.classList.add("w3-blue", "w3-container", "w3-round")
    summaryEl.text(summary)

    let linkEl = document.createElement("a")
    linkEl.setAttribute("href", link)
    linkEl.setAttribute("target", "_blank")
    linkEl.textContent = "Link to full article"
    $("#link").append(linkEl)

    //clear any previous images that may exist
    $("#city-thumbnail").empty()

    //if not a disambiguation page, get the thumbnail add add to summary div
    if (wikiSummary.thumbnail.source) {
      let thumbnail = wikiSummary.thumbnail.source
      let thumbnailEl = document.createElement("img")
      thumbnailEl.classList.add("w3-margin", "w3-round", "w3-image")
      thumbnailEl.setAttribute("src", `${thumbnail}`)
      thumbnailEl.setAttribute("alt", `Picture of ${cityName}`)
      $("#city-thumbnail").append(thumbnailEl)
      
      }
    // $("#summary").append(summaryEl)
  }

  
  

