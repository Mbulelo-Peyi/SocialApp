import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';



const baseURL = 'http://127.0.0.1:8000';

let authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')):null;

const axiosInstance = axios.create({
    baseURL,
    headers:{Authorization: `Bearer ${authTokens?.access}`}
});

axiosInstance.interceptors.request.use(async req => {
    const config = {
        headers: {
            "Content-Type":"application/json",
        }
    };
    if (!authTokens){
        authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')):null;
        req.headers.Authorization=`Bearer ${authTokens?.access}`;
    };

    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if(!isExpired) return req

    const response = await axios.post(
        `${baseURL}/api/token/refresh/`,
        {
            refresh: authTokens.refresh
        },
        config
    )
    localStorage.setItem('authTokens', JSON.stringify(response.data));
    req.headers.Authorization=`Bearer ${response.data.access}`;

    return req
    

})


export default axiosInstance;