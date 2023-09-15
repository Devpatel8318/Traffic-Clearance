import L from 'leaflet';
import { baseUrl, retinaUrl } from './util';
import { customIcon, customIcon2, turnByTurnMarkerStyle } from './styles';

export const createMap = (sxcoo, sycoo) => {
    const map = L.map('my-map').setView([sxcoo, sycoo], 17);
    const isRetina = L.Browser.retina;
    L.tileLayer(isRetina ? retinaUrl : baseUrl, {
        attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" rel="nofollow" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" rel="nofollow" target="_blank">© OpenStreetMap</a> contributors',
        apiKey: process.env.REACT_APP_GEOAPIFY_MAP_API_KEY,
        maxZoom: 20,
        id: "osm-bright",
    }).addTo(map);
    return map;
};

export const createTurnByTurnFeatures = (result) => {
    const turnByTurns = [];
    result.features.forEach((feature) =>
        feature.properties.legs.forEach((leg, legIndex) =>
            leg.steps.forEach((step) => {
                const pointFeature = {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: feature.geometry.coordinates[legIndex][step.from_index],
                    },
                    properties: {
                        instruction: step.instruction.text,
                    },
                };
                turnByTurns.push(pointFeature);
            })
        )
    );
    return turnByTurns;
};

export const fetchRoutingData = (sxcoo, sycoo, dxcoo, dycoo) => {
    const fromWaypoint = [sxcoo, sycoo];
    const toWaypoint = [dxcoo, dycoo];
    return fetch(
        `https://api.geoapify.com/v1/routing?waypoints=${fromWaypoint.join(",")}|${toWaypoint.join(",")}&mode=drive&apiKey=${process.env.REACT_APP_GEOAPIFY_MAP_API_KEY}`
    ).then((res) => res.json());
};


export const createPointLayer = (turnByTurns) => {
    return L.geoJSON(
        {
            type: "FeatureCollection",
            features: turnByTurns,
        },
        {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, turnByTurnMarkerStyle);
            },
        }
    );
};

export const createRoutingLayer = (result) => {
    return L.geoJSON(result, {
        style: (feature) => {
            return {
                color: "rgba(20, 137, 255, 0.7)",
                weight: 5,
            };
        },
    });
};

export const createMarkers = (map, Turns) => {
    L.marker([Turns[Turns.length - 1][1], Turns[Turns.length - 1][0]], { icon: customIcon2 }).addTo(map);
    L.marker([Turns[0][1], Turns[0][0]], { icon: customIcon }).addTo(map);
};