import L from 'leaflet';
import customMarkerIcon from './markers/MapMarker.png';
import customMarkerIcon2 from './markers/green-marker.png';
import ambulance from './markers/ambulance.svg';

export const customIcon = L.icon({
    iconUrl: customMarkerIcon,
    iconSize: [44, 48],
    iconAnchor: [22, 48],
    popupAnchor: [0, -48]
});

export const customIcon2 = L.icon({
    iconUrl: customMarkerIcon2,
    iconSize: [30, 48],
    iconAnchor: [15, 48],
    popupAnchor: [0, -48]
});

export const turnByTurnMarkerStyle = {
    radius: 5,
    fillColor: "#fff",
    color: "#555",
    weight: 1,
    opacity: 1,
    fillOpacity: 1,
};

export const LiveLocationMarkerIcon = L.icon({
    iconUrl: ambulance,
    iconSize: [40, 64],
    iconAnchor: [20, 64],
    popupAnchor: [0, -64],
});
