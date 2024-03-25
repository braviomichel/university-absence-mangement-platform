import axios from 'axios';

const instance = axios.create({
    baseURL: "https://indiapfa.pythonanywhere.com/api/",
    // headers: {
    //     'Access-Control-Allow-Origin': '*'
    // }
});


axios.defaults.headers.post['Content-Type'] = 'application/json';


export default instance; 

