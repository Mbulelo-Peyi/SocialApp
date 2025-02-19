import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext'


const baseURL = 'http://127.0.0.1:8000';

const useAxios = () =>{
    let {user, setUser, authTokens, setAuthTokens} = useContext(AuthContext);

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
    
        // const user = jwtDecode(authTokens.access);
        setUser(jwtDecode(authTokens.access))
        let isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
        if(!isExpired) return req
    
        const response = await axios.post(
            `${baseURL}/api/token/refresh/`,
            {
                refresh: authTokens?.refresh
            },
            config
        )
        // console.log(response)
        if (response.status === 200){
            setAuthTokens(response.data)
            setUser(jwtDecode(response.data.access))
            localStorage.setItem('authTokens', JSON.stringify(response.data));
            req.headers.Authorization=`Bearer ${response.data.access}`;
            // console.log(isExpired)
            return req
        } else if (response.status === 401){
            // axiosInstance();
        }
    })

    return axiosInstance
};

export default useAxios;