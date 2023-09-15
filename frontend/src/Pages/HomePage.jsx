import React, { useState, useEffect} from 'react';
import Layout from '../Components/Layout';
import Navigator from '../Components/HomePageComponents/Navigator';
import Login from '../Components/HomePageComponents/Login';
import Dashboard from '../Components/HomePageComponents/Dashboard';
let city;

function HomePage() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [emergency, setEmergency] = useState(false);
    const [locationData, setLocationData] = useState(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        ws.addEventListener('message', handleMessage);
    }, []);

    const handleMessage = (ev) => {
        const data = JSON.parse(ev?.data.toString());
        if (!data.location && !data.circle) {
            if(city === data.city){
                setLocationData(data);
                setEmergency(true);
                alert('Ambulance on Emergency');
            }
        }
    };

    const handleLogin = (usercity, username) => {
        city = usercity;
        setUser(username);
        setLoggedIn(true);
    };

    return (
        <Layout>
            {!loggedIn ? (
                <Login onLogin={handleLogin} />
            ) : (
                <Dashboard user={user} city={city} />
            )}
            {emergency && locationData && (
                <div className="mt-10">
                    <div className="w-10/12 mx-auto h-1/2">
                        <Navigator
                            sourceX={locationData.sxcoo}
                            sourceY={locationData.sycoo}
                            destinationX={locationData.dxcoo}
                            destinationY={locationData.dycoo}
                            number={locationData.number}
                        />
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default HomePage;
