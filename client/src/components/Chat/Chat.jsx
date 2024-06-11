import React, { useState } from 'react';
import './Chat.css'

const Chat = ({ sendMessageToHome, messageHistory, selectedUser }) => {

    const [message, setMessage] = useState('');

    const sendMessage = () => {
        sendMessageToHome(message)
        setMessage('');
    }

    return (
        <div>
            {selectedUser && (
                <div className='chat'>
                    <div className="header">
                        <p>selected user :- {selectedUser} abhinav</p>
                    </div>
                    <div className="messages-area">
                        {messageHistory.map((data, key) => (
                            <div key={key} className='chat-inbox'>
                                <div className="left">
                                    {data.sender === selectedUser && (
                                        <div className="other-user-message">
                                            <p>{data.message}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="right">
                                    {data.sender !== selectedUser && (
                                        <div className="my-message">
                                            <p>{data.message}</p>
                                        </div>
                                    )}
                                </div>
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
            )}
            {!selectedUser && (
                <div><p>
                    no user selected</p></div>
            )}
        </div>
    )
}

export default Chat