mapboxgl.accessToken = 'pk.eyJ1IjoiYmlzaG9wb2Z0dXJrZXkiLCJhIjoiY2s0Y254dW5kMDg2NjNtdDYxZ3l6cHUxYSJ9.fQFZz6tWJFj0quCfrJT37g';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [174.7762, -41.2865],
    zoom: 5
});

//List geoJSON Files here seperated by commas.
// Make sure the files are in the /data directroy
const jsonFiles = [
    "_29.11.19_1204home.geojson",
    "1.1.20am.geojson",
    "1.12.19_1500pm.geojson",
    "2.1.20am.geojson",
    "3.1.20am.geojson",
    "3.1.20lunch.geojson",
    "3.12.19_1553pm.geojson",
    "3.12.19pm.geojson",
    "4.12.19_1345pmtovuw.geojson",
    "4.1.20am.geojson",
    "4.12.19_1438pmtohome.geojson",
    "5.1.20am.geojson",
    "5.12.19_941am.geojson",
    "5.12.19_1219pm.geojson",
    "6.1.20am.geojson",
    "6.1.20pm.geojson",
    "6.12.19_1600eveningdog.geojson",
    "6.12.19pm.geojson",
    "7.12.19_1041amdog.geojson",
    "7.1.20_0842.geojson",
    "7.1.20_1016.geojson",
    "7.1.20_1207.geojson",
    "7.1.20_1521.geojson",
    "7.1.20_1918.geojson",
    "8.12.19_1739_lincolnevening.geojson",
    "9.1.20_1519.geojson",
    "9.12.19_1709lincolnevening.geojson",
    "10.12.19_803amlincoln.geojson",
    "11.12.19_837chcham.geojson",
    "11.1.20_1235.geojson",
    "11.1.20_1404.geojson",
    "13.12.19_1401chchpm.geojson",
    "13.12.19_1732chchevening.geojson",
    "13.12.19_1930chchnight.geojson",
    "15.12.19_1045_sumner.geojson",
    "15.12.19_1329chchpm.geojson",
    "15.12.19_2022airport.geojson",
    "16.12.19_1532pm.geojson",
    "17.12.19_8.24amdog.geojson",
    "17.12.19_9.20amvuw.geojson",
    "17.12.19_1130amtown.geojson",
    "18.12.19_1621pm.geojson",
    "18.12.19_1703_dog.geojson",
    "19.12.19_8.30amdog.geojson",
    "19.12.19_9.23am.geojson",
    "19.12.19pm_1543.geojson",
    "20.12.19am.geojson",
    "21.12.19am.geojson",
    "21.12.19pm.geojson",
    "22.12.19am.geojson",
    "22.12.19pm5ish.geojson",
    "22.12.19pm6ish.geojson",
    "23.12.19am.geojson",
    "23.12.19lunch.geojson",
    "23.12.19pm.geojson",
    "24.12.19am.geojson",
    "25.12.19am.geojson",
    "25.12.19pm.geojson",
    "27.12.19am.geojson",
    "27.12.19lunch.geojson",
    "27.12.19pm12.58.geojson",
    "27.12.19pm15ish.geojson",
    "28.12.19am.geojson",
    "29.12.19am.geojson",
    "31.12.19am.geojson",
    "31.12.19pm_1358.geojson",
    "31.12.19pm_1601.geojson",
    "test.geojson",
    "test2.geojson"
]

let geoJSONData = [];
let fileSelector = document.getElementById("file-selector");

//unable to load files dated 3.12.19 and 6.12.19. Missing data from 8.12.19 1045am (airport)   

function getAllJSONFiles() {
    jsonFiles.forEach((v, i) => {
        getJSON('data/' + v, (err, data) => {
            if (err !== null) {
                alert(`Failed to open data/${v} with error code ${err}`);
                return;
            }
            let bounds = new mapboxgl.LngLatBounds();
            data.features.forEach(function (feature) {
                bounds.extend(feature.geometry.coordinates);
            });
            const layerINFO = {
                data: data,
                filename: v,
                bounds: bounds,
                index: i,
            }
            geoJSONData.push(layerINFO);
            addFilesToSelector(layerINFO, false);
            addGeoJSONtoMap(layerINFO);
        });
    })
}

function addFilesToSelector(layerINFO) {
    var node = document.createElement("option");
    node.innerHTML = layerINFO.filename;
    fileSelector.appendChild(node);
    fileSelector.setAttribute("size", geoJSONData.length)
}

function selectLayers(options) {
    let bounds = new mapboxgl.LngLatBounds();
    for (let i = 0; i < options.length; i++) {
        const selection = options[i];
        const layerINFO = geoJSONData[i];
        if (selection.selected != true) {
            map.setLayoutProperty(layerINFO.filename, 'visibility', 'none');
            continue;
        }
        bounds.extend(layerINFO.bounds);
        map.setLayoutProperty(layerINFO.filename, 'visibility', 'visible');
    }
    map.fitBounds(bounds, { padding: 100 });
}


map.on("load", function () {
    map.loadImage("marker2.png", function (error0, image0) {
        if (error0) throw error0;
        map.addImage("marker", image0, {
            "sdf": "true"
        });
    });
    getAllJSONFiles();
});

function addGeoJSONtoMap(layerINFO) {
    map.addLayer({
        'id': layerINFO.filename,
        'type': 'symbol',
        'source': {
            'type': 'geojson',
            'data': layerINFO.data,
        },
        'layout': {
            'icon-image': 'marker',
            "icon-allow-overlap": true,
            "icon-size": 0.3,
            'visibility': 'none',
        },
        'paint': {
            'icon-color': ['get', 'marker-color']
        }
    })
}

//https://stackoverflow.com/questions/12460378/how-to-get-json-from-url-in-javascript
function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};