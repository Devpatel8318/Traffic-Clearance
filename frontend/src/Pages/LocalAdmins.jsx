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
        setIsValid(/^\d{10}$/.test(inputValue.slice(0, 10)));
        setNumber(inputValue.slice(0, 10));
    };

    const addLocalAdmin = async (ev) => {
        ev.preventDefault();
        if (!username) { alert("Please enter a username"); return; }
        if (!password) { alert("Please enter a password"); return; }
        if (!city) { alert("Please select city"); return; }
        if (!number) { alert("Please enter Number"); return; }
        if (number.length !== 10) { alert("Please valid Number"); return; }
        try {
            const response = await axios.post('http://localhost:4000/registerLocalAdmin', {
                username,
                password,
                city,
                number,
            });
            alert(response.data.message);
            setUserName('');
            setPassword('');
            setCity('');
            setNumber('');
            setSelectedState('');
            setIsValid(false);
            setActive(true);
        } catch (error) {
            if (error.response.status === 409) { // Local Admin already exists
                alert(error.response.data.message);
            } else if (error.response.status === 500) { // Internal Server Error
                alert(error.response.data.message);
            } else {
                alert('An error occurred while registering Local Admin');
            }
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
                            key={12}
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
