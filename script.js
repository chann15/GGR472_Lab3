mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhbm5pNDIiLCJhIjoiY201cjdmdmJxMDdodTJycHc2a3ExMnVqaiJ9.qKDYRE5K3C9f05Cj_JNbWA'; // Add default public map token from your Mapbox account

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lgsmith/cm7l6fly600t401qsfxp1cvyv', // or select existing mapbox style - https://docs.mapbox.com/api/maps/styles/
    center: [-105, 65],
    zoom: 2.5,
    maxBounds: [
        [140,0], // Southwest
        [25, 85]  // Northeast
    ],
});