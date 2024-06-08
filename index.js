const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const auth = require('./middleware/auth_middleware');

const app = express();
app.use(express.json());
app.use(cookieParser());


// authenticated route for testing purpose whether my jwt is working or not
app.get('', auth, (req, res) => {
    return res.json({ message: 'Hello Universe!!' });
});


// login route
app.get('/login', (req, res) => {
    try {
        let jwtSecret = process.env.JWT_SECRET;
        let data = {
            userId: 12
        }
        const token = jwt.sign(data, jwtSecret, { expiresIn: '10h' });
        // setting token in cookie
        res.cookie("token", token);
        return res.status(200).json({ message: 'Logged In' });
    } catch (error) {
        console.log(error);
        res.json({ message: 'something went wrong' });
    }
});



// logout route
app.get('/logout', auth, (req, res) => {
    // removing cookie
    return res.clearCookie('token').status(200).json({ message: "Successfully logged out 😏 🍀" });
});


const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`server up and listening on port number ${port}`);
})