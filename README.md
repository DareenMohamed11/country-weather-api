
# Country Weather Application

## Description
A Node.js backend application that allows users to enter
a country name through the terminal and retrieves the
current temperature, latitude, and longitude using APIs.

## Technologies Used
- Node.js
- JavaScript
- CountriesNow API
- OpenWeatherMap API
- dotenv

## Features
- Accepts a country name from the terminal.
- Fetches latitude and longitude.
- Retrieves the current temperature in Celsius.
- Handles invalid country names.
- Handles invalid or missing API keys.
- Handles API and network errors.
- Displays the results in the terminal.

## Installation

1. Clone the repository.
2. Open the project folder.
3. Install dependencies:

   npm install

4. Create a `.env` file using `.env.example`.
5. Add your OpenWeatherMap API key to `.env`.

## Run the Application

Run:

    node index.js

Enter a country name when prompted.

## Example Output

    Enter a country name: Egypt

    ===== Country Weather Information =====
    Country: Egypt
    Temperature: 20.68°C
    Latitude: 27
    Longitude: 30
    =======================================

Note: Temperature values change according to live weather
conditions and represent the country's reference coordinates.

## Error Handling
The application handles:
- Country not found
- Missing or invalid API key
- API service errors
- Network errors
- Request timeouts
