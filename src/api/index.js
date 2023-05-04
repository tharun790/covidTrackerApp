import axios from 'axios';

async function covidStats() {
    try {
        let response = await axios.get('http://localhost:5353/covidTracker');
        response = response.data;
        console.log("response after api", response);
        return response;
    }
    catch (err) {
        throw err;
    }
};

export {covidStats}

