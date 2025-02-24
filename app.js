// Weather Widget using Open Meteo API
document.addEventListener('DOMContentLoaded', () => 
    {
    const form = document.querySelector('form');
    const locationElement = document.querySelector('.location');
    const temperatureElement = document.querySelector('.temperature');
    const conditionsElement = document.querySelector('.conditions');
const humidityElement = document.querySelector('.humidity');
console.log('Humidity Element:', humidityElement); // Debugging log

const windElement = document.querySelector('.wind');
console.log('Wind Element:', windElement); // Debugging log


    form.addEventListener('submit', async (e) => {
        console.log('Form submitted'); // Debugging log
        document.querySelector('.weather-widget').style.display = 'none'; // Hide widget on new submission

        e.preventDefault();
        const location = form.querySelector('input').value.trim();
        console.log('Location entered:', location); // Debugging log

        if (location) {
            try {
                // Get coordinates for the location
                const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1`);
                if (!geoResponse.ok) {
                    throw new Error(`Geocoding API error: ${geoResponse.status} ${await geoResponse.text()}`);
                }
                const geoData = await geoResponse.json();

                console.log('Geocoding response:', geoData); // Debugging log

                if (geoData.results && geoData.results.length > 0) {
                    const { latitude, longitude } = geoData.results[0];

                    // Get weather data
                    console.log('Fetching weather data for:', latitude, longitude); // Debugging log
                    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`);
                    if (!weatherResponse.ok) {
                        throw new Error(`Weather API error: ${weatherResponse.status} ${await weatherResponse.text()}`);
                    }
                    const weatherData = await weatherResponse.json();
                    console.log('Weather response:', weatherData); // Debugging log

                    // Convert temperature to Fahrenheit
                    const temperatureF = (weatherData.current.temperature_2m * 9/5) + 32;

                    // Update UI with current weather data including feels like temperature
if (locationElement) {
    locationElement.textContent = geoData.results[0].name;
} else {
    console.error('Location element not found');
}

if (temperatureElement) {
    temperatureElement.textContent = `${temperatureF.toFixed(1)}°F`; // Display in Fahrenheit
} else {
    console.error('Temperature element not found');
}

if (humidityElement) {
    humidityElement.textContent = `${weatherData.current.relative_humidity_2m}% Humidity`;
} else {
    console.error('Humidity element not found');
}

const feelsLikeF = (weatherData.current.apparent_temperature * 9/5) + 32; // Convert to Fahrenheit
console.log('Humidity:', weatherData.current.relative_humidity_2m); // Debugging log for humidity
console.log('Wind Speed:', weatherData.current.wind_speed_10m); // Debugging log for wind speed

if (windElement) {
    windElement.textContent = `${weatherData.current.wind_speed_10m} km/h Wind`;
} else {
    console.error('Wind element not found');
}


                    // Convert weather code to readable condition
                    const weatherCodes = {
                        0: 'Clear sky',
                        1: 'Mainly clear',
                        2: 'Partly cloudy',
                        3: 'Overcast',
                        45: 'Fog',
                        48: 'Depositing rime fog',
                        51: 'Light drizzle',
                        53: 'Moderate drizzle',
                        55: 'Dense drizzle',
                        56: 'Light freezing drizzle',
                        57: 'Dense freezing drizzle',
                        61: 'Slight rain',
                        63: 'Moderate rain',
                        65: 'Heavy rain',
                        66: 'Light freezing rain',
                        67: 'Heavy freezing rain',
                        71: 'Slight snow fall',
                        73: 'Moderate snow fall',
                        75: 'Heavy snow fall',
                        77: 'Snow grains',
                        80: 'Slight rain showers',
                        81: 'Moderate rain showers',
                        82: 'Violent rain showers',
                        85: 'Slight snow showers',
                        86: 'Heavy snow showers',
                        95: 'Thunderstorm',
                        96: 'Thunderstorm with slight hail',
                        99: 'Thunderstorm with heavy hail'
                    };

if (conditionsElement) {
    conditionsElement.textContent = weatherCodes[weatherData.current.weather_code] || 'Unknown weather';
} else {
    console.error('Conditions element not found');
}


                    // Hide the blank card and show the weather widget
                    document.querySelector('.blank-card').style.display = 'none';
                    document.querySelector('.weather-widget').style.display = 'block'; // Show the weather widget
                    console.log('Weather data displayed'); // Debugging log

                } else {
                    alert('Location not found');
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
                alert('Error fetching weather data. Please check the console for more details: ' + error.message);
            }
        } else {
            alert('Please enter a location');
        }
    });
});

