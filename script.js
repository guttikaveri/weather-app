const API_KEY = '5a21223367002f5673cf918f3c976fd0'; // Replace with your OpenWeatherMap API Key
let isCelsius = true;

document.getElementById('search-btn').addEventListener('click', searchWeather);
document.getElementById('unit-toggle').addEventListener('click', toggleUnits);

function searchWeather() {
  const city = document.getElementById('city-input').value;
  if (city) {
    fetchWeather(city);
    saveSearch(city);
  } else {
    alert('Please enter a city name!');
  }
}

function toggleUnits() {
  isCelsius = !isCelsius;
  const city = document.getElementById('city-name').textContent;
  if (city !== 'City Name') {
    fetchWeather(city);
  }
}

async function fetchWeather(city) {
  const units = isCelsius ? 'metric' : 'imperial';
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`
  );
  const data = await response.json();

  if (response.ok) {
    displayCurrentWeather(data);
    fetchForecast(city);
  } else {
    alert(data.message);
  }
  

}

function displayCurrentWeather(data) {
  const { name, main, weather } = data;
  document.getElementById('city-name').textContent = name;
  document.getElementById('temperature').textContent = `Temperature: ${main.temp}°${isCelsius ? 'C' : 'F'}`;
  document.getElementById('weather-description').textContent = `Weather: ${weather[0].description}`;
  document.getElementById('humidity').textContent = `Humidity: ${main.humidity}%`;
  document.getElementById('unit-toggle').textContent = `Switch to °${isCelsius ? 'F' : 'C'}`;
}

async function fetchForecast(city) {
  const units = isCelsius ? 'metric' : 'imperial';
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${units}`
  );
  const data = await response.json();

  if (response.ok) {
    displayForecast(data.list);
  } else {
    console.error('Error fetching forecast:', data.message);
  }
}

function displayForecast(forecastList) {
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.innerHTML = ''; // Clear previous forecasts
  forecastList.slice(0, 5).forEach((forecast) => {
    const date = new Date(forecast.dt_txt);
    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <h4>${date.toLocaleDateString()}</h4>
      <p>${forecast.main.temp}°${isCelsius ? 'C' : 'F'}</p>
      <p>${forecast.weather[0].description}</p>
    `;
    forecastContainer.appendChild(card);
  });
}

function saveSearch(city) {
  const historyList = document.getElementById('history-list');
  const listItem = document.createElement('li');
  listItem.textContent = city;
  listItem.addEventListener('click', () => fetchWeather(city));
  historyList.appendChild(listItem);
}


document.getElementById('clear-history').addEventListener('click', () => {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';
});






