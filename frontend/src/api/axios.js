import axios from "axios";

export default axios.create({
    baseURL: 'htttps://localhost:3500',
    headers: {'Content-Type' : 'application/json','authorization':localStorage.getItem('accessToken')},
    withCredentials: true
});
