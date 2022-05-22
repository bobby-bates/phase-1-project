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
    // Initial location lat lngs:
    const centerUS = { lat: 39.833333, lng: -98.583333 }
    const apartment = { lat: 39.832740, lng: -75.152101 }

    // Places autocomplete text box:
    let autocomplete
    const initAutocomplete = () => {
        autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('autocomplete'),
            {
                // types: ['establishment'],
                componentRestrictions: { 'country': ['US'] },
                // fields narrows results = less $ per search:
                fields: [
                    // geometry returns location & viewport objects
                    'geometry', 
                    // name returns user's raw text input, exercise caution!
                    'name',
                    // 'place_id',
                    // photos returns <= 10 PlacePhoto objects of Place
                    'photos',
                    // types returns arr of types for this Place
                    'types',
                ]
            })
        autocomplete.addListener('place_changed', onPlaceChanged)
    }
    const onPlaceChanged = () => {
        const place = autocomplete.getPlace()
        console.log(`place: ${JSON.stringify(place, null, 2)}`)
        if (!place.geometry) {
            // User did not select a prediction; reset the input field
            document.getElementById('autocomplete').placeholder = 'Enter a place'
        } else {
            // Display details about the valid place
            // TODO: Where to put details on page?
            document.getElementById('details').innerText = JSON.stringify(place, null, 2)
        }
    }
    // const loader = new Loader({
    // The Loader object constructs the script loading URL with all its params
    const loader = new google.maps.plugins.loader.Loader({
        apiKey: key,
        version: 'weekly',
        authReferrerPolicy: 'origin', // May break if HTTP Referrer Restrictions
        language: 'en',                 // don't match
        region: 'US',
        libraries: ['places'], // Adds add'l features like Places API
        authReferrerPolicy: 'origin'
    })
    const mapOptions = {
        center: centerUS,
        zoom: 5,
        mapTypeId: 'terrain',
    }
    // Calling loader is the acutal "runner" "function"; all init calls need
        // to be in .then's anon arrow function!
    loader
        .load()
        .then(() => { // google not needed as arg for some reason 🤔
            const map = new google.maps.Map(document.getElementById('map'), mapOptions)
            new google.maps.Marker({
                position: apartment,
                map: map,
            })
            initAutocomplete()
        })
        .catch(e => console.error('Loader error:', e))
        .finally(() => console.log('🗺💯'))
}