mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhbm5pNDIiLCJhIjoiY201cjdmdmJxMDdodTJycHc2a3ExMnVqaiJ9.qKDYRE5K3C9f05Cj_JNbWA';

//This creates the map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lgsmith/cm7l6fly600t401qsfxp1cvyv',
    center: [-79.3832, 43.6532],
    zoom: 12.5,
});


//This loads the map data so it can beseen
map.on('load', () => {
    // This adds the data that outlines the listings
    map.addSource('listing_data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/chann15/GGR472_Lab3/refs/heads/main/Data/output_GPT_Testing.geojson', // Corrected URL
        cluster: true,
        clusterMaxZoom: 14, 
        clusterRadius: 50
    });
    
    //This changes the aesthetic layout of the data, in paritucalr what size and colour, depending on thje zooming in and grouping level.
    map.addLayer({ 
        'id': 'listing_data',
        'type': 'circle',
        'source': 'listing_data',
        'paint': {
            'circle-radius': [
                'step',
                ['case', ['has', 'point_count'], ['get', 'point_count'], 1], 
                6, 
                2, 14, 
                3, 16,  
                4, 18,
                5, 20,  
                10, 25  
            ],
            'circle-color': [
                'step',
                ['case', ['has', 'point_count'], ['get', 'point_count'], 1], 
                '#0066cc',  
                2, '#8dd3c7', 
                3, '#fdb462', 
                4, '#fb8072', 
                5, '#bebada', 
                10, '#ff5733'
            ],
            'circle-opacity': 1 
        }
    });
    
    
    
});


    //This allows the uers to click the actual data point, as well as dispalys the existing data. 
    map.on('click', 'listing_data', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description_first_part = e.features[0].properties.address;
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

    // This changes the mouse icon
    map.on('mouseenter', 'listing_data', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // This changes the mouse icon
    map.on('mouseleave', 'listing_data', () => {
        map.getCanvas().style.cursor = '';
    });

    //this just adds in map controls
map.addControl(new mapboxgl.NavigationControl(),'top-left');
