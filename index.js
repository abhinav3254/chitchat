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

// Maintain active connections
const clients = {};

ws.on('connection', (connection) => {
    const userId = ++i;
    console.log(`Received a new connection.`);
    clients[userId] = connection;
    console.log(`${userId} connected.`);
});
