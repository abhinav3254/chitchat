import React from 'react'
import Auth from './components/Auth/Auth'
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';

const App = () => {

  axios.defaults.baseURL = 'http://localhost:4000';

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