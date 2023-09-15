import React from 'react'
import Logo from './Logo';
import { Link, useLocation } from 'react-router-dom';

function Nav({ show, toggle }) {

    const CSS = "flex gap-2 p-1 px-2 text-xl pr-4";
    const activeLink = CSS + " bg-white text-red-500 rounded-md pr-4";
    const inactiveLink = CSS + " text-white";

    const IconCSS = " w-6 h-6";
    const activeIcon = IconCSS + "text-red-500";
    const inactiveIcon = IconCSS + "text-white";

    const location = useLocation();
    const { pathname } = location;

    return (
        <aside className={(show ? " left-0 " : " -left-full ") + 'top-0 p-4 z-50 fixed w-full h-screen md:static md:w-auto transition-all gap-2 flex bg-red-500 flex-col'}>
            <div className='mb-4 mr-4' >
                <Logo />
            </div>
            <button className='fixed block md:hidden' onClick={() => toggle(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            <nav className='flex flex-col gap-2'>
                <Link to={'/'} className={pathname === '/' ? activeLink : inactiveLink}>
                    <svg className={pathname === '/' ? activeIcon : inactiveIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    DashBoard
                </Link>
            </nav>
        </aside>
    )
}

export default Nav  