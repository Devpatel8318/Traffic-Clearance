import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import L from 'leaflet';
import '../components/map.css';
import { createMap, createMarkers, createPointLayer, createRoutingLayer, createTurnByTurnFeatures, fetchRoutingData } from '../mapImports/documentationCode';
import { getDistanceFromLatLonInKm } from '../mapImports/util';
import { LiveLocationMarkerIcon } from '../mapImports/styles';
import { withSwal } from 'react-sweetalert2';

const DISTANCE_FROM_CIRCLE_TO_CLOSE_IT = 300; // in meters
const AMBULANCE_IS_PASSING_CIRCLE_DISTANCE = 10; // in meters

let newTurns = [];
let AmbulanceOnCircleX = null;
let AmbulanceOnCircleY = null;

function Navigator({ swal }) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sxcoo = queryParams.get('sxcoo');
    const sycoo = queryParams.get('sycoo');
    const dxcoo = queryParams.get('dxcoo');
    const dycoo = queryParams.get('dycoo');

    const [ws, setWs] = useState(null);
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
        // ws.addEventListener('message', handleMessage);
    }, []);

    function sendMessage(lat, lng) {
        ws.send(JSON.stringify({
            location: true,
            cirle: false,
            lat,
            lng
        }));
    }

    function apiCall(lat, lng, type) {
        ws.send(JSON.stringify({
            location: false,
            circle: true,
            lat,
            lng,
            type,
        }));
    }

    const [listOfCircleToBeClosed, setListOfCircleToBeClosed] = useState([]);
    const [closedCircles, setClosedCircles] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [onCircle, setOnCircle] = useState([]);
    const [map, setMap] = useState(null);

    const handleLiveLocationDragEnd = (LiveLocationMarker, setListOfCircleToBeClosed) => {
        const { lat, lng } = LiveLocationMarker.getLatLng();
        sendMessage(lat, lng); //send LocalAdmin current location

        let closestTurn = null;
        let closestDistance = Infinity;

        //check distance between current location and all circles and get Coordinates of circle having least distance(closest).
        newTurns.forEach((coords) => {
            const distance = getDistanceFromLatLonInKm(coords[1], coords[0], lat, lng);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestTurn = coords;
            }
        });

        //gives list of all circles having distance <= DISTANCE_FROM_CIRCLE_TO_CLOSE_IT.
        const nearbyCoordinates = newTurns.filter((coords) => {
            const distance = getDistanceFromLatLonInKm(coords[1], coords[0], lat, lng) * 1000; // Convert distance to meters
            return distance <= DISTANCE_FROM_CIRCLE_TO_CLOSE_IT;
        });

        setListOfCircleToBeClosed(nearbyCoordinates);

        //Until now logic of Closing Circle is done

        // Now comes logic to open Circles
        // used to tell open the circle when ambulance passes through closed circle
        // api call to open the circle


        // ambulance is on circle ,task is to see, whether it is 'coming' to cirlce or 'going' from circle.
        if (closestDistance < AMBULANCE_IS_PASSING_CIRCLE_DISTANCE / 1000) {
            ambulanceComingToCircle(closestTurn[1], closestTurn[0]);
        } else {
            ambulanceHavePassedCircle();
        }
    };

    function ambulanceComingToCircle(x, y) {
        setOnCircle(prevOnCircle => {
            if (prevOnCircle?.length === 0) // if !==0   it means that, we have already registered that ambulance is coming to that circle. 
            {
                console.log("Ambulance on circle", y, x);
                AmbulanceOnCircleX = x;
                AmbulanceOnCircleY = y;
                return [x, y]; // register current circle as 'ambulance coming to this circle'
            } else {
                return prevOnCircle; //no change
            }
        });
    }

    function ambulanceHavePassedCircle() {
        setOnCircle(prev => {
            if (prev.length !== 0) {  // if === 0   it means that there is no circle through which amublance is going out.
                console.log("Ambulance passed circle: ", AmbulanceOnCircleX, AmbulanceOnCircleY);
                console.log("Sent Signal to Open Circle: ", AmbulanceOnCircleX, AmbulanceOnCircleY);
                viewToast([[AmbulanceOnCircleY, AmbulanceOnCircleX]], 'success');
                newTurns = newTurns.filter((coords) => {
                    return coords[1] !== AmbulanceOnCircleX && coords[0] !== AmbulanceOnCircleY; //remove current circle from list of circles
                });
                return []; //remove current circle as closed.
            }
            else {
                return prev;  //no change
            }
        });
    }


    // once we have source coordinates, then only render map.
    useEffect(() => {
        const newMap = createMap(sxcoo, sycoo);
        setMap(newMap);

        return () => {
            if (newMap) {
                newMap.remove();
            }
        };
    }, [sxcoo, sycoo]);

    useEffect(() => {
        //Documentation code to get map and markers
        if (map) {
            fetchRoutingData(sxcoo, sycoo, dxcoo, dycoo)
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
                    newTurns = Turns.slice(1);
                    createMarkers(map, Turns);

                    const LiveLocationMarker = L.marker([sxcoo, sycoo], {
                        draggable: true,
                        icon: LiveLocationMarkerIcon,
                    }).addTo(map);

                    // Drag End event
                    LiveLocationMarker.on("dragend", function (e) {
                        handleLiveLocationDragEnd(LiveLocationMarker, setListOfCircleToBeClosed);
                    });
                })
                .catch((error) => console.log(error));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, sxcoo, sycoo, dxcoo, dycoo]);

    // once we have list of circles to be closed, we need to send signal to close them,
    // But we have to keep track of circles already closed, so i use closedCircles. 
    useEffect(() => {

        // list of circles which are required to be closed and have not already been told to RTO to close them
        const newCircles = listOfCircleToBeClosed.filter((coords) => !closedCircles.includes(coords));

        // send signal to close new circles
        newCircles.forEach((c) => {
            console.log("Sent Signal to close Circle: ", c[1], c[0]);
        });

        viewToast(newCircles, 'warning'); // to show alert message

        // now add those to list of already closed circels
        setClosedCircles((prev) => [...prev, ...newCircles]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listOfCircleToBeClosed]);


    async function viewToast(listOfCircles, type) {
        const Toast = swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', swal.stopTimer)
                toast.addEventListener('mouseleave', swal.resumeTimer)
            }
        })

        for (const circle of listOfCircles) {
            apiCall(circle[1], circle[0], type === 'warning' ? false : true) //api call to RTO/Traffic Management system
            await Toast.fire({
                icon: type,
                title: `${type === 'warning' ? 'Closed' : 'Opened'} circle at ${circle[1]} ${circle[0]}`
            });
        }
    }

    return (
        <Layout>
            <div className="mb-10">
                <a href="/" className="px-4 py-2 border">
                    back
                </a>
            </div>
            <div className='border rounded-md p-4 h-5/6'>
                <div className='-z-0 rounded-lg' id="my-map"></div>
            </div>
        </Layout>
    );
}


export default withSwal(({ swal }, ref) => <Navigator swal={swal} />);