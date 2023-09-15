import React from 'react'
import axios from 'axios';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LocalAdmins from '../src/Pages/LocalAdmins';
axios.defaults.baseURL = "http://localhost:4000";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/localAdmins' element={<LocalAdmins />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App