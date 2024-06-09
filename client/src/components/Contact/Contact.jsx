import React from 'react';
import './Contact.css';
import avtar from '../../images/avtar.svg';

const Contact = ({ userId, email }) => {
    return (
        <div className='contact'>
            <div className="contact-card">
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