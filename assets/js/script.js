var repoList = document.querySelector('p');
var cityName = document.getElementById('generate-btn');

//generateName function is called when the 'generate' button is clicked (link with button after pull)
function generateName() {
    var requestCity = 'http://api.geonames.org/countryInfo?';

    fetch(requestCity)
      then(function(response) {
          return response.json();
      })
      then(function(data) {

        for (var i = 0; i < data.lenth; i++) {
      //create element
      var displayLocation = document.createElement('div');

      //text of div element to .html_url property
      displayLocation.textContent

      //apend location element
      repoList.appendChild(displayLocation);
      }
    });
};

cityName.addEventListener('click', generateName);