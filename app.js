// Weather Widget using Open Meteo API
const form = document.querySelector('form');
const locationElement = document.querySelector('.location');
const temperatureElement = document.querySelector('.temperature');
const conditionsElement = document.querySelector('.conditions');
const humidityElement = document.querySelector('.humidity');
const windElement = document.querySelector('.wind');

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
            const geoData = await geoResponse.json();
            
            if (geoData.results && geoData.results.length > 0) {
                const { latitude, longitude } = geoData.results[0];
                
                // Get weather data
    console.log('Fetching weather data for:', latitude, longitude); // Debugging log
    const weatherResponse = await fetch(



                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
                );
                const weatherData = await weatherResponse.json();
                
                // Convert temperature to Fahrenheit
                const temperatureF = (weatherData.current.temperature_2m * 9/5) + 32;
                
                // Update UI with current weather data including feels like temperature

                locationElement.textContent = geoData.results[0].name;
                temperatureElement.textContent = `${temperatureF.toFixed(1)}°F`; // Display in Fahrenheit
                humidityElement.textContent = `${weatherData.current.relative_humidity_2m}% Humidity`;
                const feelsLikeF = (weatherData.current.apparent_temperature * 9/5) + 32; // Convert to Fahrenheit

                windElement.textContent = `${weatherData.current.wind_speed_10m} km/h Wind`;
                
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
                
                conditionsElement.textContent = weatherCodes[weatherData.current.weather_code] || 'Unknown weather';
                
                conditionsElement.textContent = weatherCodes[weatherData.current.weather_code] || 'Unknown weather';
                

                
                // Hide the blank card and show the weather widget

                document.querySelector('.blank-card').style.display = 'none';
                document.querySelector('.weather-widget').style.display = 'block'; // Show the weather widget
                console.log('Weather data displayed'); // Debugging log

            } else {
                alert('Location not found');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data');
        }
    } else {
        alert('Please enter a location');
    }
});
