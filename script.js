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
        data: 'https://raw.githubusercontent.com/chann15/GGR472_Lab3/refs/heads/main/Data/output_GPT_Testing.geojson', // Corrected URL
        cluster: true,
        clusterMaxZoom: 14, 
        clusterRadius: 50
    });

    map.addLayer({
        'id': 'listing_data',
        'type': 'circle',
        'source': 'listing_data',
        'paint': {
            'circle-radius': [
                'step',
                ['case', ['has', 'point_count'], ['get', 'point_count'], 1], // Default to 1 if not clustered
                6,  // Single points (unclustered)
                2, 14,  // 2 points
                3, 16,  // 3 points
                4, 18,  // 4 points
                5, 20,  // 5 points
                10, 25  // 10+ points
            ],
            'circle-color': [
                'step',
                ['case', ['has', 'point_count'], ['get', 'point_count'], 1], // Default to 1 if not clustered
                '#0066cc',  // Default color for single points
                2, '#8dd3c7', 
                3, '#fdb462', 
                4, '#fb8072', 
                5, '#bebada', 
                10, '#ff5733'
            ],
            'circle-opacity': 1 // Fully opaque
        }
    });
    
    
    
});


    map.on('click', 'listing_data', (e) => {
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description_first_part = e.features[0].properties.address;
        //const description_second_part = e.features[0].properties.units.slice(1,-1);
        const description_units = JSON.parse(e.features[0].properties.units);
        let result = '';
        if (description_units.length > 1) {
            for (let i = 0; i < description_units.length; i++) {
                result += `\nPrice: ${description_units[i].price}\nBeds: ${description_units[i].beds}\n`;
            }
        } else {
            result += `Price: ${description_units[0].price}\nBeds: ${description_units[0].beds}`;
        }
        
        const description = description_first_part + "\n" + "\n" + result;
        

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

map.addControl(new mapboxgl.NavigationControl());