
var lat = 10.37;
var lng = 50.09;

// Check if geolocation is supported by the browser
if ("geolocation" in navigator) {
    // Prompt user for permission to access their location
    navigator.geolocation.getCurrentPosition(
        // Success callback function
        (position) => {
            // Get the user's latitude and longitude coordinates
            lat = position.coords.latitude;
            lng = position.coords.longitude;

            // Do something with the location data, e.g. display on a map
            console.log(`Latitude: ${lat}, longitude: ${lng}`);
        },
        // Error callback function
        (error) => {
            // Handle errors, e.g. user denied location sharing permissions
            console.error("Error getting user location:", error);
        }
    );
} else {
    // Geolocation is not supported by the browser
    console.error("Geolocation is not supported by this browser.");
}

var apiKey = 'c890d0ab724b62056e06a89cdd664e91';

var jsonApiData = {};

//array to match filename with response icon code
var fileName = "";
let dictIcons = [
    { name: "01d", value: "day.svg" },
    { name: "01n", value: "night.svg" },
    { name: "02d", value: "cloudy-day-1.svg" },
    { name: "02n", value: "cloudy-night-1.svg" },
    { name: "03d", value: "cloudy.svg" },
    { name: "03n", value: "cloudy-night-2.svg" },
    { name: "04d", value: "cloudy.svg" },
    { name: "04n", value: "cloudy-night-3.svg" },

    { name: "09d", value: "rainy-5.svg" },
    { name: "09n", value: "rainy-6.svg" },
    { name: "10d", value: "rainy-3.svg" },
    { name: "10n", value: "rainy-6.svg" },
    { name: "11d", value: "thunder.svg" },
    { name: "11n", value: "thunder.svg" },
    { name: "13d", value: "mist.svg" },
    { name: "13n", value: "mist.svg" },
];

setTimeout(getWeatherDataApiCall,2000)
//getWeatherDataApiCall();

var tempMain = document.getElementById("tempMain");
var feelsLike = document.getElementById("feelsLike");

function getWeatherDataApiCall() {

    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&appid=' + apiKey)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response error');
            }
            return response.json();
        })
        .then(data => {
            jsonApiData = data;
            console.log(jsonApiData);
            tempMain.innerHTML = Math.floor(jsonApiData.main.temp - 273.15) + "&deg;C";
            feelsLike.innerHTML = "Feels like " + Math.floor(jsonApiData.main.feels_like - 273.15) + "&deg;C";
            fileName = dictIcons.find(o => o.name === jsonApiData.weather[0].icon).value;
            //console.log(fileName);
            document.getElementById("weatherIcon").src = "assets/icons/animated/" + fileName;

        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}
