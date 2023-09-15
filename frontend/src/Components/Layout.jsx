import { useState } from "react";
import Logo from "./Logo";
import Nav from "./Nav";


export default function Layout({ children }) {

    const [showNav, setShowNav] = useState(false);

    return (

        <div className="min-h-screen bg-primary">
            <div className="z-20 flex items-center p-4 md:hidden">
                <button onClick={() => setShowNav(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                <div className="flex justify-center mr-6 grow">
                    <Logo />
                </div>
            </div>
            <div className="flex">
                <Nav show={showNav} toggle={setShowNav} />
                <div className="h-screen p-2 grow">
                    <div className="h-full p-4 bg-white rounded-md ">
                        {children}
                    </div>
                </div>
            </div>
        </div>

    )


}
