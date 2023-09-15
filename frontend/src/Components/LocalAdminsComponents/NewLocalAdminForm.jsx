import React from 'react';
import StateCitySelector from './StateCitySelector';

function NewLocalAdminForm({
  username,
  password,
  city,
  number,
  isValid,
  selectedState,
  setSelectedState,
  setCity,
  setUserName,
  setPassword,
  handlePhoneNumberChange,
  addLocalAdmin,
}) {
  return (
    <div className="mt-10">
      <h1 className="mb-4 text-4xl text-center">New Local Admin</h1>
      <form className="max-w-md mx-auto" onSubmit={addLocalAdmin}>
        <input
          className="w-full p-3 my-1 border rounded-lg"
          type="email"
          value={username}
          onChange={(ev) => setUserName(ev.target.value)}
          placeholder="your@gmail.com"
        />
        <input
          className="w-full p-3 my-1 border rounded-lg"
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          placeholder="password"
        />

        <StateCitySelector
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCity={city}
          setSelectedCity={setCity}
          className=""
        />
        <input
          type="number"
          maxLength="10"
          value={number}
          onChange={handlePhoneNumberChange}
          className="w-full p-3 my-1 border rounded-lg"
          placeholder="123456789"
        />
        {isValid ? (
          <p className="text-green-400">Phone number is valid.</p>
        ) : (
          <p className="text-rose-400">Invalid phone number.</p>
        )}

        <button
        type='submit'
          className="w-full p-2 mt-3 text-white rounded-lg bg-primary"
        >
          Register New Admin
        </button>
      </form>
    </div>
  );
}

export default NewLocalAdminForm;
