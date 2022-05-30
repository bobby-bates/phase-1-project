document.addEventListener('DOMContentLoaded', () => {
    apiKey()
})

function apiKey() {
    fetch('API_KEY.txt')
        .then(r => r.text())
        .then(key => initMap(key))
        .catch(e => console.error('Fetch error:', e))
}

// Going global with map variable
let map

//=== For DYNAMIC Google Map script loading: ===//
function initMap(key) {
    // Initial location lat lngs:
    const centerUS = { lat: 39.833333, lng: -98.583333 }
    const contUSBounds = {
        east: -66.9513812,
        north: 49.3457868,
        south: 24.7433195,
        west: -124.7844079
    }

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
        // Slightly reduce UI controls size (default: 40):
        controlSize: 35,
        // So smooth...
        isFractionalZoomEnabled: true,
        mapTypeId: 'terrain',
    }
    // Calling loader is the acutal "runner" "function"; all init calls need
        // to be in .then's anon arrow function!
    // NOTE: loader is the async call to GMaps API
    loader
        .load()
        .then(() => { // google not needed as arg for some reason 🤔
            map = new google.maps.Map(document.getElementById('map'), mapOptions)
            initAutocomplete(map)
        })
        .catch(e => console.error('Loader error:', e))
        .finally(() => console.log('🗺💯'))

    let autocomplete
    function initAutocomplete(){
        const input = document.getElementById('autocomplete')
        const options = {
            componentRestrictions: { 'country': ['US'] },
            // fields narrow the results == less $ per search:
            fields: [
                'formatted_address',
                // geometry returns location & viewport objects
                'geometry',
                // name returns user's raw text input, exercise caution!
                'name',
                // 'place_id',
                // photos returns <= 10 PlacePhoto objects of Place
                'photos',
                // types returns arr of types for this Place (e.g.,
                    // ["political", "locality"] or ["restaurant", "establishment"])
                // 'types',
            ],
            // Set search bounds within continental US:
            bounds: contUSBounds,
            strictBounds: true,
        }

        autocomplete = new google.maps.places.Autocomplete(input, options)
        autocomplete.addListener('place_changed', onPlaceChanged)
    }
    function onPlaceChanged() {
        // Function-wide variables:
        const placeholderText = 'Enter a place'
        const placeData = autocomplete.getPlace()
        let placeholder = document.getElementById('autocomplete').placeholder
        const alert = document.getElementById('alert')
        
        if (!placeData.geometry) {
            // User did not select a prediction; reset the input field
            placeholder = placeholderText
            alert.id = 'error'
            alert.innerText = `What is ${placeData.name} even? Select a suggestion from the dropdown`
        } else {
            const loc = placeData.geometry.location
            const fullAddr = placeData.formatted_address
            alert.id = 'green'
            alert.innerText = `Marker for ${placeData.name} added!
            Click its marker on the map for more info.
            See below for superb photos of ${placeData.name}.`

            const contentStr =
                '<div id="content">' +
                '<div id="siteNotice">' +
                "</div>" +
                `<h1 id="firstHeading" class="firstHeading">${fullAddr}</h1>` + "</div>"

            const infowindow = new google.maps.InfoWindow({
                content: contentStr,
            })

            const marker = new google.maps.Marker({
                position: loc,
                title: fullAddr,
                map,
            })

            marker.addListener('click', () => {
                infowindow.open({
                    anchor: marker,
                    map,
                    shouldFocus: true,
                })
                map.setZoom(15)
                map.panTo(loc)
            })

            // TODO: Update viewport using placeData.viewport
            // autocomplete.setBounds(JSON.parse(JSON.stringify(placeData.geometry.viewport)))

            // Build photo gallery:
            const gallery = document.getElementById('photo-gallery')
            placeData.photos.forEach(photo => {
                // Weed out the low-rez photos:
                if(photo.width > 500){
                    const img = document.createElement('img')
                    img.id = 'photo'
                    img.src = photo.getUrl()
                    gallery.appendChild(img)
                }
            })

            // Reset the input field
            placeholder = placeholderText
        }
    }
}