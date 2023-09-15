import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import Layout from '../components/Layout';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';
import { Link } from 'react-router-dom';
import StateCitySelector from '../components/StateCitySelector';

const LocationAutocomplete = ({ onPlaceSelect}) => {
    return (
        <div className='w-1/3 mb-10'>
            <GeoapifyContext apiKey="1bf3fed7c7684f7f9f587c95fae779ad">
                <GeoapifyGeocoderAutocomplete
                    placeholder="Enter Destination Address here"
                    countryCodes={['IN']}
                    placeSelect={onPlaceSelect}
                    format="json"
                />
            </GeoapifyContext>
        </div>
    );
};

const HomePage = () => {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedPlaceName, setSelectedPlaceName] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);
    const [linkAddress, setLinkAddress] = useState(null);
    const [selectedState, setSelectedState] = useState('');
    const [number, setNumber] = useState('');
    const [city,setCity] = useState(null);

    const [ws, setWs] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
    }, []);

    useEffect(() => {
        const fetchLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLatitude(position.coords.latitude);
                        setLongitude(position.coords.longitude);
                    },
                    (error) => {
                        setError(error.message);
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser.');
            }
        };

        fetchLocation();
    }, []);

    function onPlaceSelect(value) {
        setSelectedPlaceName(value?.properties?.formatted);
        if (value?.geometry?.type === 'Point') {
            setSelectedPlace(value?.geometry?.coordinates);
        } else if (value?.geometry?.type === 'LineString') {
            setSelectedPlace(value?.geometry?.coordinates[0]);
        } else if (value?.geometry?.type === 'MultiPolygon') {
            // Handle MultiPolygon if needed
        } else {
            setSelectedPlace(value?.geometry?.coordinates[0][0]);
        }
    }

    useEffect(() => {
        if (selectedPlace) {
            const queryParams = {
                sxcoo: latitude,
                sycoo: longitude,
                dxcoo: selectedPlace[1] || -1,
                dycoo: selectedPlace[0] || -1,
            };
            const queryString = new URLSearchParams(queryParams).toString();
            setLinkAddress(`/Navigate?${queryString}`);
        }
    }, [latitude, longitude, selectedPlace]);

    const sendMessage = () => {
        ws.send(JSON.stringify({
            location: false,
            cirle:false,
            city,
            sxcoo: latitude,
            sycoo: longitude,
            dxcoo: selectedPlace[1] || -1,
            dycoo: selectedPlace[0] || -1,
            number,
        }));
    };

    return (
        <Layout>
            <div className="mt-10">
                <h1 className="mb-4 text-4xl text-center">Select State</h1>
                <div className="max-w-md mx-auto">
                    <StateCitySelector
                        selectedState={selectedState}
                        setSelectedState={setSelectedState}
                        selectedCity={city}
                        setSelectedCity={setCity}
                        className=""
                        number={number}
                        setNumber={setNumber}
                    />
                </div>
            </div>

            {number ? (
                <div className="flex flex-col items-center mt-16">
                    <LocationAutocomplete onPlaceSelect={onPlaceSelect} />
                </div>
            ) : (
                <div onClick={() => alert("Enter Contact number")} className="flex flex-col items-center mt-16">
                    <LocationAutocomplete onPlaceSelect={onPlaceSelect} />
                </div>
            )}

            <div className='flex flex-col max-w-md mx-auto'>
                <div>
                    {latitude && longitude ? (
                        <div className='p-3 px-4 my-1 text-gray-500 border rounded-lg'>
                            <span>Your Location: </span>
                            {latitude}, {longitude}
                        </div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>

                <h2 className='w-full mt-4 text-sm text-gray-500 sm:text-md md:text-xl'>Destination: </h2>
                <textarea id="message" rows="3" className="w-full block p-2.5 text bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={selectedPlaceName}></textarea>

                {selectedPlaceName && (
                    <Link to={linkAddress} className='w-full p-4 mt-5 text-center text-white rounded-lg bg-primary'>
                        <div onClick={sendMessage}>Start Navigation</div>
                    </Link>
                )}
            </div>
        </Layout>
    );
};

export default HomePage;
