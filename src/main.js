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

    // The Loader object constructs the script loading URL with all its params
    const loader = new google.maps.plugins.loader.Loader({
        apiKey: key,
        version: 'weekly',
        authReferrerPolicy: 'origin', // May break if HTTP Referrer Restrictions
        language: 'en',                 // don't match
        region: 'US',
        libraries: ['places'],
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
    // NOTE: loader is the async call to GMaps API
    loader
        .load()
        .then(() => { // google not needed as arg for some reason 🤔
            // debugger
            map = new google.maps.Map(document.getElementById('map'), mapOptions)
            // new google.maps.Marker({
            //     position: apartment,
            //     map: map,
            // })
            // debugger
            initAutocomplete(map)
        })
        .catch(e => console.error('Loader error:', e))
        .finally(() => console.log('🗺💯'))
    // debugger
    let autocomplete
    const initAutocomplete = (map) => {
        // debugger
        const input = document.getElementById('autocomplete')
        const options = {
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
                // NOTE: No actual photos are returned
                'photos',
                // types returns arr of types for this Place
                // 'types',
            ],
            // Bounds of continental US:
            bounds: {
                east: -66.9513812,
                north: 49.3457868,
                south: 24.7433195,
                west: -124.7844079
            },
            strictBounds: true,
        }

        autocomplete = new google.maps.places.Autocomplete(input, options)
        // debugger
        autocomplete.addListener('place_changed', onPlaceChanged)
    }
    const onPlaceChanged = (e) => {
        // debugger
        const placeData = autocomplete.getPlace()
        console.log(`placeData: ${JSON.stringify(placeData, null, 2)}`)
        let placeholder = document.getElementById('autocomplete').placeholder
        const alert = document.getElementById('alert')
        // let alertMsg = document.getElementById('alert').innerText

        // autocomplete.bindTo('bounds', map)
        if (!placeData.geometry) {
            // User did not select a prediction; reset the input field
            placeholder = 'Enter a place'
            alert.innerText = `What is ${placeData.name} even? Select a suggestion from the dropdown`
            alert.id = 'error'
        } else {
            // debugger
            alert.innerText = `Marker for ${placeData.name} added!
            Click its marker on the map for more info.
            See below for superb photos of ${placeData.name}.`
            alert.id = 'green'
            // document.getElementById('details').innerText = JSON.stringify(placeData, null, 2)

            const contentStr = 
            '<div id="content">' +
            '<div id="siteNotice">' +
            "</div>" +
            `<h1 id="firstHeading" class="firstHeading">${placeData.name}</h1>` +
            "</div>"

            const infowindow = new google.maps.InfoWindow({
                content: contentStr,
            })

            const marker = new google.maps.Marker({
                position: placeData.geometry.location,
                title: placeData.name,
                map,
            })

            marker.addListener('click', () => {
                infowindow.open({
                    anchor: marker,
                    map,
                    shouldFocus: true,
                })
            })

            // Update viewport using placeData.viewport
            // debugger
            // console.log(JSON.parse(JSON.stringify(placeData.geometry.viewport)))
            // autocomplete.setBounds(JSON.parse(JSON.stringify(placeData.geometry.viewport)))

            // Make Place Details request:
            // const request = {
            //     placeId: placeData.place_id,
            //     fields: ['photos']
            // }
            // const service = new google.maps.places.PlacesService(map)
            // const callback = (place, status) => {
            //     if(status === google.maps.places.PlacesServiceStatus.OK){
            //         console.log('Places Details success!')
            //         console.log(place)
            //     }
            // }
            // service.getDetails(request, callback)

            // Build photo galery:
            const gallery = document.getElementById('photo-gallery')
            placeData.photos.forEach(photo => {
                // debugger
                // console.log(photo.getUrl())
                const img = document.createElement('img')
                img.id = 'photo'
                img.src = photo.getUrl({maxWidth: 200, maxHeight: 200})
                img.innerHTML = photo.html_attributions
                gallery.appendChild(img)
            });

            // Reset the text box
            document.getElementById('autocomplete').placeholder = 'Enter a place'
        }
    }
}