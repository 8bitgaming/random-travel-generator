var repoList = document.querySelector('myDiv');
var fetchButton = document.getElementById('generateBtn');
var cityNumber = 0;
var startRow = 0;
var remainder = 0;

// api url
const api_url1 = "http://api.geonames.org/searchJSON?username=lsmith32&country&maxRows=1000&style=Short&cities=cities15000";

// Defining async function
async function getapi(api_url1) {
    
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
    var data2 = await response2.json();
    console.log(data2);

    /*console.log(cityNumber);
    console.log("cityname", data2.geonames[remainder].name);
    console.log("cityid", data2.geonames[remainder].geonameId);
    console.log("country", data2.geonames[remainder].countryCode);*/

    var cityName = data2.geonames[remainder].name;
    var country = data2.geonames[remainder].countryCode;
    var pSelected = document.getElementById('city');
    pSelected.innerText = "Your next destination: " + cityName;


}


fetchButton.addEventListener('click', function(e) {
  if(e.target) {
    console.log("I'm clicked");
    getapi(api_url1);
  }
});


