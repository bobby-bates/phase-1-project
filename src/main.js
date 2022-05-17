// require('dotenv').config()
// import { Loader } from '@googlemaps/js-api-loader'
// import { Loader } from './node_modules/@googlemaps/js-api-loader'


document.addEventListener('DOMContentLoaded', () => {
    // console.log(process.env)
    apiKey()
})

function apiKey() {
    fetch('API_KEY.txt')
        .then(r => r.text())
        .then(key => initMap(key))
        .catch(e => console.error('Fetch error:', e))
}

//=== For INLINE Google Map script loading: ===//
// let map
// function initMap() {
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: { lat: 39.832920, lng: -75.151920 },
//         zoom: 16,
//     })
// }
// window.apiKey = apiKey
// window.initMap = initMap

//=== For DYNAMIC Google Map script loading: ===//
function initMap(key) {
    // const loader = new Loader({
    const loader = new google.maps.plugins.loader.Loader({
        apiKey: key,
        version: 'weekly',
        // libraries: ['places']
    })

    const mapOptions = {
        center: {
            lat: 39.832920,
            lng: -75.151920
        },
        zoom: 16
    }

    loader
        .load()
        .then(() => { // google not needed as arg for some reason 🤔
            new google.maps.Map(document.getElementById('map'), mapOptions)
        })
        .catch(e => console.error('Loader error:', e))
}