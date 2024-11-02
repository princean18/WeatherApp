
var lat = 0.00;
var lng = 0.00;

var apiKey = 'c890d0ab724b62056e06a89cdd664e91'; //apikey for weatherapi

var locationiqKey = "pk.ec0cf909011e86f4f3f767652a52aaa8" // access token for LocationIQ

var jsonApiData = {};

var tempMain = document.getElementById("tempMain");
var feelsLikeMinMax = document.getElementById("feelsLikeMinMax");
var weatherDesc = document.getElementById("weatherDesc");
var pressure = document.getElementById("pressure");
var humidity = document.getElementById("humidity");
var sunrise = document.getElementById("sunrise");
var sunset = document.getElementById("sunset");
var visibility = document.getElementById("visibility");
var windSpeed = document.getElementById("windSpeed");
var windDirImg = document.getElementById("windDirImg");
var sealevel = document.getElementById("sealevel");
var grndlevel = document.getElementById("grndlevel");

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
  { name: "50d", value: "mist.svg" },
];

$('#search-box-input').autocomplete({
  minChars: 3,
  deferRequestBy: 250,
  serviceUrl: 'https://api.locationiq.com/v1/autocomplete',
  paramName: 'q',
  params: {
    // The input parameters to the API goes here
    key: locationiqKey,
    format: "json",
    limit: 5
  },
  ajaxSettings: {
    dataType: 'json'
  },
  formatResult: function (suggestion, currentValue) {
    // Current value is the input query. We can use this to highlight the search phrase in the result
    var format = "<div class='autocomplete-suggestion-name'>" + highlight(suggestion.data.display_place, currentValue) + "</div>" +
      "<div class='autocomplete-suggestion-address'>" + highlight(suggestion.data.display_address, currentValue) + "</div>"
    return format;
  },
  transformResult: function (response) {
    var suggestions = $.map(response, function (dataItem) {
      return {
        value: dataItem.display_name,
        data: dataItem
      };
    })

    return {
      suggestions: suggestions
    };
  },
  onSelect: function (suggestion) {
    //displayLatLon(suggestion.data.display_name, suggestion.data.lat, suggestion.data.lon);
    lat = suggestion.data.lat;
    lng = suggestion.data.lon;
    getWeatherDataApiCall();
  }
});

function highlight(text, focus) {
  var r = RegExp('(' + escapeRegExp(focus) + ')', 'gi');
  return text.replace(r, '<strong>$1</strong>');
}

function escapeRegExp(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}



if (localStorage.getItem("lat") == '' || localStorage.getItem("lat") == null || localStorage.getItem("lng") == '' || localStorage.getItem("lng") == null) {
  // Check if geolocation is supported by the browser
  if ("geolocation" in navigator) {
    // Prompt user for permission to access their location
    navigator.geolocation.getCurrentPosition(
      // Success callback function
      (position) => {
        // Get the user's latitude and longitude coordinates
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        localStorage.setItem("lat", lat);
        localStorage.setItem("lng", lng);
        localStorage.setItem("position", position);

        // Do something with the location data, e.g. display on a map
        console.log(`Latitude: ${lat}, longitude: ${lng}`);
        location.reload();
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
}
else {
  lat = localStorage.getItem("lat");
  lng = localStorage.getItem("lng");
}


setTimeout(getWeatherDataApiCall, 0)

function getWeatherDataApiCall() {

  var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&appid=' + apiKey;
  var forecatApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lng + '&appid=' + apiKey;

  dataService(weatherApiUrl).then((data) => {
    console.log(data);
    tempMain.innerHTML = convertToDeg(data.main.temp);
    feelsLikeMinMax.innerHTML = "Feels like " + convertToDeg(data.main.feels_like) + "<br> Lo: " + convertToDeg(data.main.temp_min) + " - Hi: " + convertToDeg(data.main.temp_max);
    weatherDesc.innerHTML = data.weather[0].main + ", " + data.weather[0].description;
    fileName = dictIcons.find(o => o.name === data.weather[0].icon).value;
    if(fileName==undefined){
      fileName = "day.svg";
    }
    document.getElementById("weatherIcon").src = "assets/icons/animated/" + fileName;

    windSpeed.innerHTML = data.wind.speed + " m/s";
    windDirImg.style.transform = "rotate(" + data.wind.deg + "deg)"
    sunrise.innerHTML = "<i class='fa-solid fa-sun'></i> " + new Date(data.sys.sunrise * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    sunset.innerHTML = "<i class='fa-solid fa-moon'></i> " + new Date(data.sys.sunset * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    visibility.innerHTML = data.visibility / 1000 + " Km";
    pressure.innerHTML = data.main.pressure + " hPa";
    humidity.innerHTML = data.main.humidity + " %";
    sealevel.innerHTML = "<i class='fa-solid fa-water'></i> " + data.main.sea_level + " hPa";
    grndlevel.innerHTML = "<i class='fa-solid fa-earth-americas'></i> " + data.main.grnd_level + " hPa";
  });

  dataService(forecatApiUrl).then((data) => {
    var i = 0;
    var forcastDayInnerHtml = "";
    while (i < data.list.length) {
      if (new Date(data.list[i].dt_txt).getHours() == 12 && i != 0) {
        forcastDayInnerHtml = forcastDayInnerHtml + "<div class='col'><div class='p-2 rounded-4 bg-white'> " + new Date(data.list[i].dt_txt).toLocaleDateString("en-GB", { weekday: 'long' }) + "<br> <img src='assets/icons/animated/" + dictIcons.find(o => o.name === data.list[i].weather[0].icon).value + "' width='50'><p class='display-10'>" + convertToDeg(data.list[i].main.temp) + "</p></div></div>";
        document.getElementById('forcastDays').innerHTML = forcastDayInnerHtml;
      }
      i++;
    }
    //to display last day forecast
    // forcastDayInnerHtml = forcastDayInnerHtml+"<div class='col'><div class='p-3 rounded-4 border-0 bg-white'> "+new Date(data.list[data.list.length-1].dt_txt).toLocaleDateString("en-GB", { weekday: 'long' })+"<br> <img src='assets/icons/animated/"+dictIcons.find(o => o.name === data.list[data.list.length-1].weather[0].icon).value+"' width='50'><p class='display-10'>"+convertToDeg(data.list[data.list.length-1].main.temp)+"</p></div></div>";
    document.getElementById('forcastDays').innerHTML = forcastDayInnerHtml;

  });
}

function convertToDeg(val) {
  return Math.floor(val - 273.15) + "&deg;C";
}

async function dataService(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Network response error');
    }
    return res.json();
  } catch (err) {
    console.error('Fetch error:', error);
  }
}
