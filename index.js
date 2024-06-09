const express = require('express');
require('dotenv').config();
const connectDB = require('./db/db-config');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const auth = require('./middleware/auth_middleware');
const userModel = require('./schema/UsersSchema');
const { WebSocketServer } = require('ws');

const app = express();
app.use(express.json());
app.use(cookieParser());
// connecting to db
connectDB();



// authenticated route for testing purpose whether my jwt is working or not
app.get('', auth, (req, res) => {
    return res.json({ message: 'Hello Universe!!' });
});


// login route
app.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: 'All fields are required' });

        const user = await userModel.findOne({ email: email });

        // if user not found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password === password) {
            let jwtSecret = process.env.JWT_SECRET;
            let data = {
                userId: user._id
            }
            const token = jwt.sign(data, jwtSecret, { expiresIn: '10h' });
            // setting token in cookie
            res.cookie("token", token);
            return res.status(200).json({ message: 'Logged In' });
        } else {
            // wrong password
            return res.status(400).json({ message: 'Wrong Password' });
        }

    } catch (error) {
        console.log(error);
        res.json({ message: 'something went wrong' });
    }
});


// register router for signup
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
        // finding wether user already exists with same email
        const result = await userModel.findOne({ email: email });
        // if there is result means email already in use
        if (result) {
            return res.status(400).json({ message: 'This email address is already associated with an account' });
        }
        await userModel.create({ name: name, email: email, password: password });
        return res.status(200).json({ message: 'Registration successful. Please login' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
});



// logout route
app.get('/logout', auth, (req, res) => {
    // removing cookie
    return res.clearCookie('token').status(200).json({ message: "Successfully logged out 😏 🍀" });
});



const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
    console.log(`server up and listening on port number ${port}`);
})

/**
 * Web socket start here
 */

const ws = new WebSocketServer({ server });

// maintaining all active connections in this object
const clients = {};
var i = 1;

ws.on('connection', function (connection) {
    const userId = i + 1;
    console.log(`Received a new connection.`);
    // Store the new connection and handle messages
    clients[userId] = connection;
    console.log(`${userId} connected.`);
});