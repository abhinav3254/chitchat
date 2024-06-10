import React, { useState } from 'react';
import './Chat.css'

const Chat = ({ sendMessageToHome, messageHistory }) => {

    const [message, setMessage] = useState('');

    const sendMessage = () => {
        sendMessageToHome(message)
        setMessage('');
    }

    return (
        <div className='chat'>
            <div className="messages-area">
                {messageHistory.map((data, key) => (
                    <div key={key}>
                        <strong>{data.sender}:</strong> {data.message} <br />
                        <em>to {data.to}</em>
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input className='message-input' type="text" placeholder='messages' value={message} onChange={(e) => { setMessage(e.target.value) }} />
                <svg onClick={sendMessage} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="send-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
            </div>
        </div>
    )
}

export default Chat