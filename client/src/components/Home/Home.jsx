import axios from 'axios'
import React from 'react'

const Home = () => {

    const check = async () => {
        // const config = {
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     withCredentials: true
        // }
        const res = await axios.get('');
        console.log(res);
    }

    return (
        <div>
            <button onClick={check}>click me</button>
        </div>
    )
}

export default Home