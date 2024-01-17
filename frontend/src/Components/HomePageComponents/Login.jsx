import axios from 'axios'
import React, { useState } from 'react'

function Login({ onLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post('/loginLocalAdmin', {
                username,
                password
            })
            onLogin(response.data.data.city, response.data.data.username)
        } catch (error) {
            console.error(error.response.data.error)
            alert(error.response.data.error)
            setPassword('')
        }

    }

    return (
        <div className="mt-10 ">
            <h1 className="mb-4 text-4xl text-center">Login Local-Admin</h1>
            <div className="mt-10">
                <div className="max-w-md mx-auto">
                    <form onSubmit={handleSubmit}>
                        <input
                            className="w-full p-3 my-1 border rounded-lg"
                            type="email"
                            value={username}
                            onChange={(ev) => setUsername(ev.target.value)}
                            placeholder="your@gmail.com"
                            required
                        />
                        <input
                            className="w-full p-3 my-1 border rounded-lg"
                            type="password"
                            value={password}
                            onChange={(ev) => setPassword(ev.target.value)}
                            placeholder="password"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full p-2 mt-3 text-white bg-primary rounded-lg"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
