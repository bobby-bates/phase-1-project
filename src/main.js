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
    // Location lat lngs:
    const centerUS = { lat: 39.833333, lng: -98.583333 }
    const apartment = { lat: 39.832740, lng: -75.152101 }

    // const loader = new Loader({
    const loader = new google.maps.plugins.loader.Loader({
        apiKey: key,
        version: 'weekly',
        authReferrerPolicy: 'origin', // May break if HTTP Referrer Restrictions
        language: 'en',                 // don't match
        region: 'US',
        // libraries: ['places'] // Adds add'l features like Places API
    })
    const mapOptions = {
        center: centerUS,
        zoom: 5,
        mapTypeId: 'terrain',
    }
    loader
        .load()
        .then(() => { // google not needed as arg for some reason 🤔
            const map = new google.maps.Map(document.getElementById('map'), mapOptions)
            console.log('Sweet map.')
            // debugger
            new google.maps.Marker({
                position: apartment,
                map: map,
            })
        })
        .catch(e => console.error('Loader error:', e))
}