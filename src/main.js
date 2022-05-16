// require('dotenv').config()

document.addEventListener('DOMContentLoaded', () => {
    console.log('Hello, World!')
    // console.log(process.env)
})

function apiKey() {
    fetch('API_KEY.txt')
        .then(r => r.text())
        .then(KEY => console.log(KEY))
        .catch(error => console.log(error))
}
apiKey()

let map

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.832920, lng: -75.151920 },
        zoom: 16,
    })
}

window.apiKey = apiKey
window.initMap = initMap