import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Contact from '../Contact/Contact';

const Home = () => {

    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');

        ws.onopen = () => {
            console.log('connected');
        };

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

    return (
        <div>
            <div>
                <h1>Online Users</h1>
                <ul>
                    {onlineUsers.map(user => (
                        <Contact email={user.email} userId={user.userId} key={user.userId} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Home