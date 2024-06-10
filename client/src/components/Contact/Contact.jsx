import React, { useState } from 'react';
import './Contact.css';
import avtar from '../../images/avtar.svg';

const Contact = ({ userId, email, sendUserIdToHome }) => {

    const [clickUserId, setClickUserId] = useState('');

    const getUserDetails = () => {
        setClickUserId(userId);
        sendUserIdToHome(userId);
    }

    return (
        <div className='contact'>
            <div className="contact-card" onClick={getUserDetails}>
                <img className='avtar' src={avtar} alt="" />
                <div className='others'>
                    <p>{email}</p>
                    <span>{userId}</span>
                </div>
            </div>
        </div>
    )
}

export default Contact