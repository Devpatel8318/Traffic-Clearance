import customMarkerIcon from './MapMarker.png';
import customMarkerIcon2 from './green-marker.png';
import ambulance from './ambulance.svg';
import L from 'leaflet';

export const myAPIKey = "bed8b866464f4b369ab39767ba49258d";

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

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
