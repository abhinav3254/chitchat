import React from 'react'
import Auth from './components/Auth/Auth'
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';

const App = () => {

  axios.defaults.baseURL = 'http://localhost:4000';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.withCredentials = true;

  return (
    <div>
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </div>
  )
}

export default App