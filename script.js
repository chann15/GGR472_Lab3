mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhbm5pNDIiLCJhIjoiY201cjdmdmJxMDdodTJycHc2a3ExMnVqaiJ9.qKDYRE5K3C9f05Cj_JNbWA'; // Add default public map token from your Mapbox account

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lgsmith/cm7l6fly600t401qsfxp1cvyv', // or select existing mapbox style - https://docs.mapbox.com/api/maps/styles/
    center: [-79.3832, 43.6532], // [Longitude, Latitude]
    zoom: 12.5,
});


//This loads the map so it can be seen
map.on('load', () => {
    // This adds the data that outlines the ski resort
    map.addSource('listing_data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/chann15/GGR472_Lab3/refs/heads/main/Data/output_GPT_Testing.geojson' // Corrected URL
    });

    // This provides a physical aesthetic element to the data
    map.addLayer({
        'id': 'listing_data',
        'type': 'circle',
        'source': 'listing_data',
        'paint': {
            'circle-radius': 6,  // Adjust size as needed
            'circle-color': '#0000FF', // blue color
            'circle-opacity': 0.8 // Slight transparency
        }
        
    });
});

    map.on('click', 'listing_data', (e) => {
        // Copy coordinates array.
        if 
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description_first_part = e.features[0].properties.address;
        const description_second_part = e.features[0].properties.units.slice(2,-1);
        const description = description_first_part + " " + description_second_part

        if (['mercator', 'equirectangular'].includes(map.getProjection().name)) {
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
        }

        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    map.on('mouseenter', 'listing_data', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'listing_data', () => {
        map.getCanvas().style.cursor = '';
    });



