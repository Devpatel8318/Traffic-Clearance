import React, { useState } from 'react';
import Layout from '../Components/Layout';
import AllAdmins from '../Components/LocalAdminsComponents/AllAdmins';
import axios from 'axios';
import PassKeyVerification from '../Components/LocalAdminsComponents/PassKeyVerification';
import NavigationButtons from '../Components/LocalAdminsComponents/NavigationButtons';
import NewLocalAdminForm from '../Components/LocalAdminsComponents/NewLocalAdminForm';

function LocalAdmins() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [active, setActive] = useState(true);
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [number, setNumber] = useState('');
    const [city, setCity] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [selectedState, setSelectedState] = useState('');

    const handlePhoneNumberChange = (event) => {
        const inputValue = event.target.value.trim();
        setIsValid(/^\d{10}$/.test(inputValue));
        setNumber(inputValue);
    };

    const addLocalAdmin = async (ev) => {
        ev?.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/registerLocalAdmin', {
                username,
                password,
                city,
                number,
            });
            if (response.status === 201) { //success 
                alert(response.data.message);
            } else if (response.status === 409) { // Local Admin already exists
                alert(response.data.message);
            } else {
                alert('An error occurred while registering Local Admin');
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    };

    const handleLogin = () => {
        setLoggedIn(true);
    };

    return (
        <Layout>
            {!loggedIn ? (
                <PassKeyVerification onLogin={handleLogin} />
            ) : (
                <div>
                    <NavigationButtons active={active} setActive={setActive} />

                    {active ? (
                        <div className="mt-10">
                            <h1 className="mb-4 text-4xl text-center">All Local Admins</h1>
                            <AllAdmins />
                        </div>
                    ) : (
                        <NewLocalAdminForm
                            username={username}
                            password={password}
                            city={city}
                            number={number}
                            isValid={isValid}
                            selectedState={selectedState}
                            setSelectedState={setSelectedState}
                            setCity={setCity}
                            setUserName={setUserName}
                            setPassword={setPassword}
                            handlePhoneNumberChange={handlePhoneNumberChange}
                            addLocalAdmin={addLocalAdmin}
                        />
                    )}
                </div>
            )}
        </Layout>
    );
}

export default LocalAdmins;
