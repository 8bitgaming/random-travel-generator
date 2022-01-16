
let apiKey = 'fbf31d182481f35e3b9fc07c433c4e62'

//initial call to get city name and coordinates for use by the getWeather api call
const getCityLatLong = (city) => {

    let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units&appid=${apiKey}`
  
    fetch(apiURL).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          let cityLat = data.coord.lat
          let cityLong = data.coord.lon
          let cityName = data.name
          getWeather(cityLat, cityLong, cityName);    
        })
      } else {
        alert("City Not Found!")
        invalidCity = true
        
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  const getWeather = (cityLat, cityLong, cityName) => {
    if (cityLat && cityLong) {
      let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLong}&units=imperial&exclude=hourly,minutely,alerts&appid=${apiKey}`
  
      fetch(apiURL).then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {

            console.log(data)
        
            for (let i = 1; i < data.daily.length ; i++) {
              let fiveForecastDate = moment.unix(data.daily[i].dt).format('L')
              let fiveTemp = data.daily[i].temp.day;
              let fiveWind = data.daily[i].wind_speed;
              let fiveHumidity = data.daily[i].humidity;
              let fiveIcon = data.daily[i].weather[0].icon;
  
              let forecastIcon = document.createElement("img")
              forecastIcon.setAttribute("src",`http://openweathermap.org/img/wn/${fiveIcon}.png`)
  
              //add formatting to the forecast boxes
  
              let forecastBox = document.createElement("div")
              forecastBox.id = `weather-day-${[i]}`
              forecastBox.classList.add("w3-card-4", "w3-blue", "w3-col", "m3", "l2", "w3-round", "w3-container")
              let forecastDate = document.createElement("h4")
              forecastDate.textContent = fiveForecastDate
              let forecastTemp = document.createElement("p")
              forecastTemp.textContent = `Temp: ${fiveTemp}°F`
              let forecastWind = document.createElement("p")
              forecastWind.textContent = `Wind: ${fiveWind} MPH`
              let forecastHumidity = document.createElement("p")
              forecastHumidity.textContent = `Humidity: ${fiveHumidity}%`
  
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

  getCityLatLong("Detroit")

  let url = `https://en.wikipedia.org/w/rest.php/v1/page/cities?search=10`;

fetch(url)
.then(function(response) {
  if(response.ok) {
    response.json()
    .then(function(data) {
      console.log(data);
    }
    )
  } 
}
)