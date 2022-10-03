import axios from 'axios';

const useRefreshToken = () => {
    const refresh = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const data = {
            "refreshToken": refreshToken
        }
        const response = await axios.post('http://localhost:3500/refresh', data);
        localStorage.setItem('accessToken',response.data.accessToken);
        return response.data.accessToken;
    }
    return refresh();
}

export default useRefreshToken;