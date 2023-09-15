import L from 'leaflet';
import startMarkerImage from './markers/MapMarker.png';
import endMarkerImage from './markers/green-marker.png';
import ambulance from './markers/ambulance.svg';

const turnByTurnMarkerStyle = {
    radius: 5,
    fillColor: "#fff",
    color: "#555",
    weight: 1,
    opacity: 1,
    fillOpacity: 1,
};

const startIcon = L.icon({
    iconUrl: startMarkerImage,
    iconSize: [44, 48],
    iconAnchor: [22, 48],
    popupAnchor: [0, -48]
});

const endIcon = L.icon({
    iconUrl: endMarkerImage,
    iconSize: [30, 48],
    iconAnchor: [15, 48],
    popupAnchor: [0, -48]
});


const LiveLocationMarkerIcon = L.icon({
    iconUrl: ambulance,
    iconSize: [40, 64],
    iconAnchor: [20, 64],
    popupAnchor: [0, -64],
});


export {
    startIcon,
    endIcon,
    turnByTurnMarkerStyle,
    LiveLocationMarkerIcon,
};