import React from 'react'
import axios from 'axios';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navigator from './pages/Navigator';
axios.defaults.baseURL = "http://localhost:4000";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path="/Navigate/:sxcoo?/:sycoo?/:dxcoo?/:dycoo?" element={<Navigator />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App