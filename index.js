const express = require('express');
require('dotenv').config();
const connectDB = require('./db/db-config');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const auth = require('./middleware/auth_middleware');
const userModel = require('./schema/UsersSchema');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const bcrypt = require('bcrypt');
const messageModel = require('./schema/ChatSchema');

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Connecting to DB
connectDB();

// Authenticated route for testing JWT
app.get('/', auth, (req, res) => {
    return res.json({ message: 'Hello Universe!!' });
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passOk = await bcrypt.compare(password, user.password);
        if (passOk) {
            const jwtSecret = process.env.JWT_SECRET;
            const data = { userId: user._id, email };
            const token = jwt.sign(data, jwtSecret, { expiresIn: '10h' });
            res.cookie('token', token, { httpOnly: true }).status(200).json({
                id: user._id,
                message: 'Login successful',
            });
            return res;
        } else {
            return res.status(400).json({ message: 'Wrong Password' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
});

// Register route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log({ name, email, password });
    try {
        const alreadyUser = await userModel.findOne({ email });
        if (alreadyUser) return res.status(400).json({ message: 'Email already in use' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await userModel.create({ name, email, password: hashedPassword });
        return res.status(200).json({ message: 'Registration successful', id: createdUser._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// chat history
app.get('/history/:id', auth, async (req, res) => {
    const id = req.params['id'];
    const ourDetails = await getUserDataFromRequest(req);
    ourId = ourDetails.userId;
    const data = await messageModel.find({
        sender: { $in: [id, ourId] },
        to: { $in: [id, ourId] },
    }).sort({ createdAt: 1 });
    return res.json({ message: data });
});

async function getUserDataFromRequest(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (token) {
            let jwtSecret = process.env.JWT_SECRET;
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
                const { id, email } = userData;
                resolve(userData);
            });
        } else {
            reject('no token');
        }
    });
}


app.get('/user/:id', auth, async (req, res) => {
    const userid = req.params['id'];
    if (userid) {
        const user = await userModel.findById(userid);
        if (user) return res.status(200).json({ data: user });
        else return res.status(404).json({ message: 'user not found' });
    } return res.status(400).json({ message: 'user id not found in path variable' });
});


// Logout route
app.get('/logout', auth, (req, res) => {
    return res.clearCookie('token').status(200).json({ message: "Successfully logged out" });
});


// Server setup
const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
    console.log(`Server up and listening on port number ${port}`);
});

// WebSocket setup
const ws = new WebSocketServer({ server });

// Maintain active connections and online users
const clients = {};
const onlineUsers = new Map();

let i = 0;

ws.on('connection', (connection, req) => {
    const uid = ++i;
    console.log(`Received a new connection.`);
    clients[uid] = connection;
    console.log(`${uid} connected.`);

    // Function to notify all clients about the online users
    function notifyAboutOnlinePeople() {
        const message = JSON.stringify({ online: Array.from(onlineUsers.values()) });

        ws.clients.forEach(client => {
            client.send(message);
        });
    }

    // Extract user details from cookies
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.trim().startsWith('token='));
        if (tokenCookieString) {
            const token = tokenCookieString.split('=')[1];
            if (token) {
                jwt.verify(token, process.env.JWT_SECRET, {}, (err, payload) => {
                    if (err) {
                        console.error('JWT verification error:', err);
                        return;
                    }
                    const { userId, email } = payload;
                    connection.userId = userId;
                    connection.email = email;

                    // Add the user to the online users map
                    onlineUsers.set(userId, { userId, email });
                    notifyAboutOnlinePeople();
                });
            }
        }
    }

    // Handle incoming messages
    connection.on('message', async (res) => {
        const messageData = JSON.parse(res.toString());
        const { to, message } = messageData;

        const messageSaved = await messageModel.create({ sender: connection.userId, to, message });

        // Broadcasting the message to the specific user
        const recipientConnection = Array.from(ws.clients).find(client => client.userId === to);
        if (recipientConnection) {
            const messageObject = {
                message,
                sender: connection.userId,
                to,
                _id: messageSaved._id
            };
            recipientConnection.send(JSON.stringify(messageObject));
            console.log('Message sent:', JSON.stringify(messageObject));
        } else {
            console.log(`User with userId ${to} is not online.`);
        }
    });

    connection.on('close', () => {
        // Remove user from the online users map when they disconnect
        if (connection.userId) {
            onlineUsers.delete(connection.userId);
            notifyAboutOnlinePeople();
        }
        console.log(`${uid} disconnected.`);
        delete clients[uid];
    });

    connection.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});
