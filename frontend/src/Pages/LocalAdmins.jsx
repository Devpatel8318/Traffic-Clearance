import React, { useState } from 'react'
import Layout from '../Components/Layout'
import AllAdmins from '../Components/AllAdmins';
import axios from 'axios';


function LocalAdmins() {

    const [active, setActive] = useState(true);
    const activeCss = "gap-1 inline-flex justify-center items-center px-2 md:px-6 py-2 md:py-2 text-white rounded-md bg-[#A4907C]"
    const inActiveCss = "gap-1  inline-flex justify-center items-center px-2 md:px-6 py-2 md:py-2  rounded-md bg-gray-200 text-gray-600"
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [number, setNumber] = useState('');
    const [city, setCity] = useState('');
    
    const [isValid, setIsValid] = useState(false);

    const handlePhoneNumberChange = (event) => {
        const inputValue = event.target.value.trim();
        setIsValid(/^\d{10}$/.test(inputValue));
        setNumber(inputValue);
    };


    async function addLocalAdmin(ev) {
        ev?.preventDefault();
        const res = await axios.post('/registerLocalAdmin', {
            username,
            password,
            city,
            number
        });
    }

    return (
        <Layout>
            <nav className='flex flex-row justify-center w-10/12 gap-2 mx-auto mt-1 mb-2 text-sm sm:w-full sm:text-sm md:text-base'>
                <button onClick={() => setActive(true)} className={active ? activeCss : inActiveCss} to={'/account'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                    </svg>
                    All Local Admins
                </button>
                <button onClick={() => setActive(false)} className={active ? inActiveCss : activeCss} to={'/account/bookings'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    New Local Admin
                </button>
            </nav>

            {active && (
                <div className="mt-10">
                    <h1 className="mb-4 text-4xl text-center">All Local Admins</h1>
                    <AllAdmins />
                </div>
            )}

            {!active && (
                <div className="mt-10">
                    <h1 className="mb-4 text-4xl text-center">New Local Admin</h1>
                    <form className="max-w-md mx-auto">
                        <input className='w-full p-3 my-1 border rounded-lg' type="email" value={username} onChange={ev => setUserName(ev.target.value)} placeholder="your@gmail.com" />
                        <input className='w-full p-3 my-1 border rounded-lg' type="password" value={password} onChange={ev => setPassword(ev.target.value)} placeholder="password" />
                        <input className='w-full p-3 my-1 border rounded-lg' type="text" value={city} onChange={ev => setCity(ev.target.value)} placeholder="city" />
                        <input
                            type="tel"
                            maxLength={"10"}
                            value={number}
                            onChange={handlePhoneNumberChange}
                            className='w-full p-3 my-1 border rounded-lg'
                            placeholder='123456789'
                        />
                        {isValid ? (
                            <p className='text-green-400'>Phone number is valid.</p>
                        ) : (
                            <p className='text-rose-400'>Invalid phone number.</p>
                        )}
                        
                        <button onClick={() => addLocalAdmin()} className="w-full p-2 mt-3 text-white bg-[#A4907C] rounded-lg">Register New Admin</button>
                    </form>
                </div>
            )}
        </Layout>
    )
}

export default LocalAdmins