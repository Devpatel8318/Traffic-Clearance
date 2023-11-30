import React, { useState } from 'react';

function PassKeyVerification({ onLogin }) {
  const [passKey, setPassKey] = useState('');

  const handlePassKeyVerification = (event) => {
    event.preventDefault(); 
    if (passKey === process.env.REACT_APP_PASS_KEY) {
      onLogin();
    } else {
      alert('Wrong Pass key');
    }
  };

  return (
    <div>
      <div className="mt-10">
        <h1 className="mb-4 text-4xl text-center">Enter Pass-Key</h1>
      </div>
      <div className="mt-10">
        <div className="max-w-md mx-auto">
          <form onSubmit={handlePassKeyVerification}>
            <input
              className="w-full p-3 my-1 border rounded-lg"
              type="password"
              value={passKey}
              onChange={(ev) => setPassKey(ev.target.value)}
              placeholder="passkey"
            />
            <button
              type="submit" 
              className="w-full p-2 mt-3 text-white bg-primary rounded-lg"
            >
              Verify Key
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PassKeyVerification;
