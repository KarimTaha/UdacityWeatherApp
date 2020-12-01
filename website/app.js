/* Global Variables */

// Personal API Key for OpenWeatherMap API
const API_KEY = '11bb4a7e38d91f2b817c0f102753cae6';
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather'
const LOCAL_URL = 'http://localhost:8000'

// Event listener to add function to existing HTML DOM element
document.querySelector(`#generate`).addEventListener('click', fetchData)

/* Function called by event listener */
function fetchData(e) {
    const zipCode = document.getElementById('zip').value;
    if (!zipCode || zipCode.length <1) {
        return;
    }
    getWeatherData(BASE_URL, zipCode, API_KEY)
    .then(function(data) {
        const feelings = document.querySelector('#feelings').value;
        const dataToPost = {
            "temperature": data.main.temp,
            "date": d,
            "content": feelings
        }
        postData(LOCAL_URL + '/addEntry', dataToPost)
    })
    .then(function() {
        updateUI();
    })
}

/* Function to GET Web API Data*/
const getWeatherData = async (url, zipCode, key) => {
    const res = await fetch(`${url}?zip=${zipCode},us&appid=${key}`)
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("Error ocurred while getting weather data", error);
    }
}

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    try {
        const returnedData = await response.json();
        return returnedData;
    } catch (error) {
        console.log("Error ocurred while posting data to local server", error)
    }
}

/* Function to GET Project Data */
const getData = async (url = '') => {
    const res = await fetch(url)
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("Error ocurred while getting data from local server", error);
    }
}

/* Function to update the UI of the app */
const updateUI = async () => {
    const allData = await getData(LOCAL_URL + '/getEntries');

    document.querySelector('#date').innerHTML = allData[0].date
    document.querySelector('#temp').innerHTML = allData[0].temperature
    document.querySelector('#content').innerHTML = allData[0].content
}

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();