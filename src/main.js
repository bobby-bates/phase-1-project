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

    // Going global with map variable
    let map

//=== For DYNAMIC Google Map script loading: ===//
function initMap(key) {
    // Initial location lat lngs:
    const centerUS = { lat: 39.833333, lng: -98.583333 }
    const apartment = { lat: 39.832740, lng: -75.152101 }

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
        zoom: 4.5,
        mapTypeId: 'terrain',
    }
    // debugger
    // Calling loader is the acutal "runner" "function"; all init calls need
        // to be in .then's anon arrow function!
    loader
        .load()
        .then(() => { // google not needed as arg for some reason 🤔
            // debugger
            map = new google.maps.Map(document.getElementById('map'), mapOptions)
            new google.maps.Marker({
                position: apartment,
                map: map,
            })
            // debugger
            initAutocomplete(map)
            new google.maps.Marker()
        })
        .catch(e => console.error('Loader error:', e))
        .finally(() => console.log('🗺💯'))
    // debugger
    // Places autocomplete text box:
    let autocomplete
    const initAutocomplete = (map) => {
        // debugger
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
                    // 'photos',
                    // types returns arr of types for this Place
                    // 'types',
                ],
                bounds: {
                    east: -66.9513812,
                    north: 49.3457868,
                    south: 24.7433195,
                    west: -124.7844079
                },
                strictBounds: true,
            })
            const theMap = map
            // debugger
        autocomplete.addListener('place_changed', onPlaceChanged)
    }
    const onPlaceChanged = () => {
        // debugger
        const placeData = autocomplete.getPlace()
        console.log(`placeData: ${JSON.stringify(placeData, null, 2)}`)
        // autocomplete.bindTo('bounds', map)
        if (!placeData.geometry) {
            // User did not select a prediction; reset the input field
            document.getElementById('autocomplete').placeholder = 'Enter a place'
        } else {
            // debugger
            // Display details about the valid place
            document.getElementById('alert').innerText = `Marker for ${placeData.name} added!`
            // document.getElementById('details').innerText = JSON.stringify(placeData, null, 2)
            // Add marker at placeData.location
            new google.maps.Marker({
                position: placeData.geometry.location,
                map: map,
            })
            
            // Update viewport using placeData.viewport
            // map.setBounds(placeData.geometry.viewport)

            
            // STRETCH: Build photo galery with placeData.photos

        }
    }
}