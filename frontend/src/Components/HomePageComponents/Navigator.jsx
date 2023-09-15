import React, { useEffect, useRef, useState } from 'react';
import L, { circle } from 'leaflet';
import { LiveLocationMarkerIcon } from '../../mapImports/styles';
import {
    createMap,
    createMarkers,
    createPointLayer,
    createRoutingLayer,
    createTurnByTurnFeatures,
    fetchRoutingData,
} from '../../mapImports/documentationCode';

function Navigator({
    sourceX,
    sourceY,
    destinationX,
    destinationY,
    number,
}) {
    const [isMapReady, setIsMapReady] = useState(false);

    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const styles = {
        mapcss: {
            width: '100%',
            height: '100%',
            margin: '0'
        }
    };

    // Handle WebSocket 
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        ws.addEventListener('message', handleMessage);
    }, []);

    function handleMessage(ev) {
        const data = JSON.parse(ev?.data.toString());
        if (data.location && !data.circle) {
            markerRef?.current?.setLatLng([data.lat, data.lng]);
        }
    }

    // Initialize the map when component mounts
    useEffect(() => {
        if (!mapRef.current) {
            const map = createMap(sourceX, sourceY);
            mapRef.current = map;
            setIsMapReady(true);
        }
    }, [sourceX, sourceY]);

    // Fetch routing data and display on the map
    useEffect(() => {
        const map = mapRef.current;
        if (isMapReady && map) {
            fetchRoutingData(sourceX, sourceY, destinationX, destinationY)
                .then((result) => {
                    const turnByTurns = createTurnByTurnFeatures(result);
                    const routingLayer = createRoutingLayer(result);
                    const pointLayer = createPointLayer(turnByTurns);

                    routingLayer
                        .bindPopup((layer) => {
                            return `${layer.feature.properties.distance} ${layer.feature.properties.distance_units}, ${layer.feature.properties.time}`;
                        })
                        .addTo(map);

                    pointLayer
                        .bindPopup((layer) => {
                            return `${layer.feature.properties.instruction}`;
                        })
                        .addTo(map);

                    const Turns = turnByTurns.map((data) => data.geometry.coordinates);
                    createMarkers(map, Turns);

                    // Add a live location marker
                    const LiveLocationMarker = L.marker([sourceX, sourceY], {
                        icon: LiveLocationMarkerIcon,
                    }).addTo(map);

                    markerRef.current = LiveLocationMarker;
                })
                .catch((error) => console.log(error));
        }
    }, [isMapReady, sourceX, sourceY, destinationX, destinationY]);

    return (
        <div className="p-2 h-[70vh] text-center">
            <div className="w-full h-full p-4 bg-white border rounded-md ">
                <div id="my-map" style={styles.mapcss}></div>
                <div className='mt-5'>
                    <span className='text-xl text-gray-500'>
                        Contact Number:
                    </span>
                    <span className='text-2xl font-semibold text-[#A4907C] '>
                        {number}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Navigator;
