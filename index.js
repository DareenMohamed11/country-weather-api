
require("dotenv").config();

const readline = require("readline");

// Create terminal interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const API_KEY = process.env.OPENWEATHER_API_KEY;

// Function to fetch data and handle API errors
async function fetchData(url) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (response.status === 401) {
      throw new Error("Invalid API key!");
    }

    if (response.status === 403) {
      throw new Error("API access denied. Check your API key or plan.");
    }

    if (response.status === 429) {
      throw new Error("Too many API requests. Try again later.");
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TimeoutError" ||
        error.name === "AbortError") {
      throw new Error("Request timed out. Try again.");
    }

    if (error instanceof TypeError) {
      throw new Error("Network error. Check your internet connection.");
    }

    throw error;
  }
}

// Main function
async function getWeather(countryName) {
  try {
    if (!countryName.trim()) {
      throw new Error("Please enter a country name.");
    }

    if (!API_KEY) {
      throw new Error("API key is missing. Check your .env file.");
    }

    // Step 1: Get countries and their coordinates
    const countriesURL =
      "https://countriesnow.space/api/v0.1/countries/positions";

    const countriesData = await fetchData(countriesURL);

    if (countriesData.error || !Array.isArray(countriesData.data)) {
      throw new Error("Country API is unavailable or returned invalid data.");
    }

    // Step 2: Find the requested country
    const country = countriesData.data.find(
      (item) =>
        item.name.toLowerCase() === countryName.trim().toLowerCase()
    );

    if (!country) {
      throw new Error("Country not found. Please check the spelling.");
    }

    const latitude = Number(country.lat);
    const longitude = Number(country.long);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error("Invalid coordinates received from the API.");
    }

    // Step 3: Get current temperature
    const weatherURL =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${latitude}&lon=${longitude}` +
      `&appid=${API_KEY}&units=metric`;

    const weatherData = await fetchData(weatherURL);

    if (typeof weatherData.main?.temp !== "number") {
      throw new Error("Temperature data is unavailable.");
    }

    // Step 4: Display results
    console.log("\n===== Country Weather Information =====");
    console.log(`Country: ${country.name}`);
    console.log(`Temperature: ${weatherData.main.temp}°C`);
    console.log(`Latitude: ${latitude}`);
    console.log(`Longitude: ${longitude}`);
    console.log("=======================================\n");

  } catch (error) {
    console.error("\nError:", error.message);
  } finally {
    rl.close();
  }
}

// Ask the user to enter a country
rl.question("Enter a country name: ", (countryName) => {
  getWeather(countryName);
});
