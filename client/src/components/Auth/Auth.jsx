import React, { useState } from 'react'
import './Auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {

    const navigate = useNavigate();

    const [login, setLogin] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signup = async () => {
        try {
            const data = { name: name, email: email, password: password };
            const res = await axios.post('/register', data);
            console.log(res);
            if (res.status === 200) {
                alert('signup done');
            } else {
                alert('signup failed');
            }
        } catch (err) {
            console.log(err);
        }
    }

    const loginFunction = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }
            const data = { email: email, password: password };
            const res = await axios.post('/login', data, config);
            console.log(res);
            if (res.status === 200) {
                alert('login done');
                navigate('/home');
            } else {
                alert('login failed');
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='auth'>
            {login && (
                <div className='login'>
                    <input type="text" placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
                    <input type="password" placeholder='Password' onChange={(e) => { setPassword(e.target.value) }} />
                    <button onClick={loginFunction}>signup</button>
                    <p>New Here ? <span onClick={(e) => { setLogin(false) }}>signup</span> </p>
                </div>
            )}
            {!login && (
                <div className='signup'>
                    <input type="text" placeholder='Name' onChange={(e) => { setName(e.target.value) }} />
                    <input type="text" placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
                    <input type="password" placeholder='Password' onChange={(e) => { setPassword(e.target.value) }} />
                    <button onClick={signup}>signup</button>
                    <p>Already have an account? <span onClick={(e) => { setLogin(true) }}>login</span> </p>
                </div>
            )}
        </div>
    )
}

export default Auth