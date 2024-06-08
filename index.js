const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());


app.get('', (req, res) => {
    return res.json({ message: 'Hello Universe!!' });
});



const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`server up and listening on port number ${port}`);
})