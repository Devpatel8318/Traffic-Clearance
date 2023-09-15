import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import Layout from '../components/Layout'
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'
import { Link } from 'react-router-dom';


const HomePage = () => {

    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedPlaceName, setSelectedPlaceName] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);
    const [linkAddress, setLinkAddress] = useState(null);

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

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-full">
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
                <div>
                    {latitude && longitude ? (
                        <div>
                            <span>Your Location: </span>
                            {latitude}, {longitude}
                        </div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
                <div className='w-1/2'>
                    <span>Destination: </span>
                    {selectedPlaceName}
                </div>
                <Link to={linkAddress}>Go to Dashboard</Link>
            </div>
        </Layout>
    );
};

export default HomePage;
