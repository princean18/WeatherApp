
var lat = 51.37;
var lon = -0.09;
var apiKey = 'c890d0ab724b62056e06a89cdd664e91';

var jsonApiData = {};

getWeatherDataApiCall();

var tempMain = document.getElementById("tempMain");
var currentDay = document.getElementById("currentDay");

function getWeatherDataApiCall(){
    
    fetch('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+apiKey)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response error');  
        }
        return response.json();
    })
    .then(data => {
        jsonApiData = data;
        console.log(jsonApiData);
        tempMain.innerHTML = Math.floor(jsonApiData.main.temp-273.15) + "&deg;C";
        currentDay.innerHTML = "Feels like "+Math.floor(jsonApiData.main.feels_like-273.15) + "&deg;C";
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

//main temparature
