import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import L from 'leaflet';
import '../components/myCss.css';
import { myAPIKey, getDistanceFromLatLonInKm, customIcon, customIcon2, turnByTurnMarkerStyle, LiveLocationMarkerIcon } from '../util'

const DISTANCE_FROM_CIRCLE_TO_CLOSE_IT = 100; // in meters
const LIVE_LOCATION_UPDATE_INTERVAL = 3000; // in milliSeconds
let newTurns = [];
function Navigator() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const sxcoo = queryParams.get('sxcoo');
    const sycoo = queryParams.get('sycoo');
    const dxcoo = queryParams.get('dxcoo');
    const dycoo = queryParams.get('dycoo');

    const [isMapReady, setIsMapReady] = useState(false);
    const [liveXcoo, setLiveXcoo] = useState(null);
    const [liveYcoo, setLiveYcoo] = useState(null);

    const mapRef = useRef(null);
    const markerRef = useRef(null);


    useEffect(() => {
        const fetchLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLiveXcoo(position.coords.latitude);
                        setLiveYcoo(position.coords.longitude);
                        updateMarker(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            } else {
                console.log('Geolocation is not supported by this browser.');
            }
        };
        fetchLocation();
        const interval = setInterval(fetchLocation, LIVE_LOCATION_UPDATE_INTERVAL);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        if (!mapRef.current) {
            const map = L.map('my-map').setView([sxcoo, sycoo], 14);
            mapRef.current = map;

            const isRetina = L.Browser.retina;
            const baseUrl =
                'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}';
            const retinaUrl =
                'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}';
            L.tileLayer(isRetina ? retinaUrl : baseUrl, {
                attribution:
                    'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" rel="nofollow" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" rel="nofollow" target="_blank">© OpenStreetMap</a> contributors',
                apiKey: myAPIKey,
                maxZoom: 20,
                id: 'osm-bright',
            }).addTo(map);

            setIsMapReady(true);
        }
    }, [sxcoo, sycoo]);


    useEffect(() => {
        const map = mapRef.current;
        if (isMapReady && map) {
            const fromWaypoint = [sxcoo, sycoo];
            const toWaypoint = [dxcoo, dycoo];

            fetch(
                `https://api.geoapify.com/v1/routing?waypoints=${fromWaypoint.join(
                    ","
                )}|${toWaypoint.join(",")}&mode=drive&apiKey=${myAPIKey}`
            )
                .then((res) => res.json())
                .then((result) => {
                    L.geoJSON(result, {
                        style: (feature) => {
                            return {
                                color: "rgba(20, 137, 255, 0.7)",
                                weight: 5,
                            };
                        },
                    })
                        .bindPopup((layer) => {
                            return `${layer.feature.properties.distance} ${layer.feature.properties.distance_units}, ${layer.feature.properties.time}`;
                        })
                        .addTo(map);

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

                    L.geoJSON(
                        {
                            type: "FeatureCollection",
                            features: turnByTurns,
                        },
                        {
                            pointToLayer: function (feature, latlng) {
                                return L.circleMarker(latlng, turnByTurnMarkerStyle);
                            },
                        }
                    )
                        .bindPopup((layer) => {
                            return `${layer.feature.properties.instruction}`;
                        })
                        .addTo(map);
                    newTurns = turnByTurns.map((data) => data.geometry.coordinates);
                    L.marker([newTurns[newTurns.length - 1][1], newTurns[newTurns.length - 1][0]], { icon: customIcon2 }).addTo(map).bindPopup("1125 G Street Southeast, Washington, DC 20003, United States of America");
                    L.marker([newTurns[0][1], newTurns[0][0]], { icon: customIcon }).addTo(map).bindPopup("1125 G Street Southeast, Washington, DC 20003, United States of America");

                    const LiveLocationMarker = L.marker([sxcoo, sycoo], {
                        icon: LiveLocationMarkerIcon,
                    }).addTo(map);
                    markerRef.current = LiveLocationMarker;

                }).catch((error) => console.log(error));
        }
    }, [isMapReady]);

    function updateMarker(x, y) {
        console.log(x, y);
        if (x && y) {
            console.log("live lcation updated");
            markerRef?.current?.setLatLng([x, y]);
        }

        let closestTurn = null;
        let closestDistance = Infinity;

        newTurns.forEach((coords) => {
            const distance = getDistanceFromLatLonInKm(coords[1], coords[0], x, y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestTurn = coords;
            }
        });

        console.log("Meters: " + closestDistance * 1000);

        if (closestDistance < DISTANCE_FROM_CIRCLE_TO_CLOSE_IT / 1000) {
            console.log("close");
        }

        if (closestDistance < 1.7) {
            L.popup()
                .setLatLng([closestTurn[1], closestTurn[0]])
                .setContent("<p>This Circle</p>")
                .openOn(mapRef?.current);
        } else {
            console.log("no");
        }
    };
    return (
        <Layout>
            <div className="mb-10">
                <a href="/" className="px-4 py-2 border">
                    back
                </a>
            </div>
            <div id="my-map"></div>
        </Layout>
    );
}

export default Navigator;











