import axios from 'axios'
import React, { useEffect, useState } from 'react';
import './Home.css';
import Contact from '../Contact/Contact';
import Chat from '../Chat/Chat';

const Home = () => {

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [ws, setWs] = useState(null);

    const [selectUser, setSelectedUser] = useState('');

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);

        ws.onopen = () => {
            console.log('connected');
        };

        // here getting all the online users list
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setOnlineUsers(data.online);
        };

        ws.onclose = () => {
            console.log('disconnected');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Cleanup function to close the WebSocket connection when the component unmounts
        return () => {
            ws.close();
        };
    }, []);

    const handleChildMessage = (messageFromChild) => {
        setMessage(messageFromChild);
        sendMessageWebSocket(message);
    }

    const sendMessageWebSocket = (message) => {
        const data = {
            to: selectUser,
            message: message
        };

        ws.send(JSON.stringify(data));
    }

    const selectedUserId = (data) => {
        setSelectedUser(data);
        console.log(data);
    }

    return (
        <div className='home'>
            <div className="contact-left">
                {onlineUsers.map(user => (
                    <Contact email={user.email} userId={user.userId} key={user.userId} sendUserIdToHome={selectedUserId} />
                ))}
            </div>
            <div className="chat">
                <Chat sendMessageToHome={handleChildMessage} />
            </div>
        </div>
    )
}

export default Home