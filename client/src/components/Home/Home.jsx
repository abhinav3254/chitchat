import axios from 'axios'
import React, { useEffect, useState } from 'react';
import './Home.css';
import Contact from '../Contact/Contact';
import Chat from '../Chat/Chat';

const Home = () => {

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [ws, setWs] = useState(null);

    const [allMessages, setAllMessages] = useState([]);

    const [selectUser, setSelectedUser] = useState('');

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);

        ws.onopen = () => {
            console.log('connected');
        };

        // here getting all the online users list
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Incoming message:', data);

                if (data.online) {
                    // Handle online users update
                    setOnlineUsers(data.online);
                } else if (data.message && data.sender && data.to && data._id) {
                    // Handle incoming chat message
                    console.log('Incoming chat message:', data);
                    setAllMessages(prevMessages => [...prevMessages, data]);
                } else {
                    console.log('Unknown message type:', data);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
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
        sendMessageWebSocket(messageFromChild);
    }

    const sendMessageWebSocket = (message1) => {
        const data = {
            to: selectUser,
            message: message1
        };

        ws.send(JSON.stringify(data));
    }

    const selectedUserId = (data) => {
        setSelectedUser(data);
        console.log(data);
        getChatHistory(data);
    }

    const getChatHistory = async (id) => {
        const res = await axios.get(`/history/${id}`);
        console.log(res.data.message);
        setAllMessages(prevMessages => [...prevMessages, ...res.data.message]);
    }

    return (
        <div className='home'>
            <div className="contact-left">
                {onlineUsers.map(user => (
                    <Contact email={user.email} userId={user.userId} key={user.userId} sendUserIdToHome={selectedUserId} />
                ))}
            </div>
            <div className="chat">
                <Chat messageHistory={allMessages} sendMessageToHome={handleChildMessage} />
            </div>
        </div>
    )
}

export default Home