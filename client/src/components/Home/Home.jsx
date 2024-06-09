import axios from 'axios'
import React, { useEffect, useState } from 'react'

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
                        <li key={user.userId}>{user.email}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Home