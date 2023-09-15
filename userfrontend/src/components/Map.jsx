// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker } from 'react-leaflet';
// import L from 'leaflet';
// import markerIcon from '../MapMarker.png';

// const customIcon = L.icon({
//     iconUrl: markerIcon,
//     iconSize: [64, 64],
// });

// function Map({ coordinates }) {
//     const [coord, setCoord] = useState(null);

//     useEffect(() => {
//         if (coordinates?.type === 'Point') {
//             setCoord(coordinates.coordinates);
//         } else if (coordinates?.type === 'LineString') {
//             setCoord(coordinates.coordinates[0]);
//         } else if (coordinates?.type === 'MultiPolygon') {
//             // Handle MultiPolygon coordinates if needed
//         } else {
//             setCoord(coordinates?.coordinates[0][0]);
//         }
//     }, [coordinates]);

//     return (
//         <>
//                 <MapContainer
//                     center={[ 23.2368281, 72.6348286]}
//                     zoom={18}
//                     className="h-[70vh]"
//                 >
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                     <Marker position={[ 23.2368281, 72.6348286]} icon={customIcon} />
//                 </MapContainer>
//         </>
//     );
// }

// export default Map;


import React from 'react'

function Map() {
  return (
    <div>Map</div>
  )
}

export default Map