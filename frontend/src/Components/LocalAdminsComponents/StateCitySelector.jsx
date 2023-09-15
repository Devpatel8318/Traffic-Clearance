import React, { useState } from 'react';
import {cityStrings , allStates2} from './stateCityData'

const StateCitySelector = ({ selectedState, setSelectedState, selectedCity, setSelectedCity }) => {
    const [index, setIndex] = useState('');
    
    const handleStateChange = (event) => {
        setSelectedState(event.target.value);
        setSelectedCity('');
        setIndex(allStates2.findIndex((s) => s === event.target.value));
    };

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };
    return (
        <div className='flex gap-1 sm:gap-3 md:gap-4'>
            <div className='w-1/2 text-gray-500'>
                <h2 className='mt-1 text-sm sm:text-md md:text-xl'>State: </h2>
                <select className='w-full p-2 my-1 text-sm border rounded-lg sm:text-base sm:p-3' value={selectedState} onChange={handleStateChange}>
                    <option value="">Select State</option>
                    {allStates2.map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                    ))}
                </select>
            </div>
            <div className='w-1/2 text-gray-500'>
                <h2 className='mt-1 text-sm sm:text-md md:text-xl'>City: </h2>
                <select className='w-full p-2 my-1 text-sm border rounded-lg sm:text-base sm:p-3' value={selectedCity} onChange={handleCityChange}>
                    <option value="">Select City</option>
                    {selectedState && cityStrings[index]?.split('|').map((city, index) => (
                        <option key={index} value={city.trim()}>{city.trim()}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
export default StateCitySelector;