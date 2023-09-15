import React, { useEffect, useState } from 'react';

function App() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000');
    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('message', handleMessage);
      ws.close();
    };
  }, []);

  useEffect(() => {
    console.log(signals);
  }, [signals]);

  function handleMessage(ev) {
    const data = JSON.parse(ev?.data.toString());
    if (data.circle) {
      setSignals((prevSignals) => {
        if (!data.type) {
          // Close circle
          return [...prevSignals, [data.lat, data.lng]];
        } else {
          // Open circle
          return prevSignals.filter(
            (signal) => signal[0] !== data.lat || signal[1] !== data.lng
          );
        }
      });
    }
  }

  function linkProvider(latitude, longitude) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  return (
    <>
      <div className="mt-12 text-5xl text-center">
        <h1>Traffic Signal Management</h1>

        <h3 className="mt-24 text-2xl text-gray-600">List of Closed Circles</h3>

        <div className="flex flex-col w-11/12 mx-auto sm:w-9/12 md:w-8/12">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-sm font-light text-center sm:text-lg">
                  <thead className="font-medium border-b">
                    <tr>
                      <th scope="col" className="px-6 py-4">#</th>
                      <th scope="col" className="px-6 py-4">x-coordinate</th>
                      <th scope="col" className="px-6 py-4">y-coordinate</th>
                      <th scope="col" className="px-6 py-4">Map</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signals.map((data, index) => (
                      <tr
                        key={index}
                        className="transition duration-300 ease-in-out border-b hover:bg-gray-200">
                        <td className="px-6 py-4 font-medium whitespace-nowrap">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{data[0]}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{data[1]}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a className="hover:underline" href={linkProvider(data[0], data[1])} target="_blank" rel="noreferrer">open map</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
