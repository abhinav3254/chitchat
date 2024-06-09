import React from 'react';
import './Contact.css';
import avtar from '../../images/avtar.svg';

const Contact = ({ userId, email }) => {
    return (
        <div className='contact'>
            <div className="contact-card">
                <img className='avtar' src={avtar} alt="" />
                <p>{email}</p>
            </div>
        </div>
    )
}

export default Contact