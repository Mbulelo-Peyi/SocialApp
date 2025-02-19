import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const AuthContext =  createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {

    
    let [authTokens, setAuthTokens] = useState(()=>localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')):null);
    let [user, setUser] = useState(()=>localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')):null);
    let [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const SignIn = async (data) =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/",
                data,
                config
            )
            setAuthTokens(response.data);
            setUser(jwtDecode(response.data.access))
            localStorage.setItem('authTokens', JSON.stringify(response.data))
            // console.log(JSON.stringify(response.data))
            console.log(response.data)
            // navigate("/");
        } catch (error) {
            console.error("Error",error);
            alert("Something went wrong. Please try again");
        }
    };

    const reset_password = async ( email ) =>{
        const config = {
            headers:{
                "Content-Type":"application/json",
            }
        }
        const data = JSON.stringify(email)
        try {
            const response = await axios.post(`http://127.0.0.1:8000/auth/reset_password/`,data,config)
            return response.data;
        } catch (error) {
        }
    };


    const reset_password_confirm = async ( _data ) =>{
        const config = {
            headers:{
                "Content-Type":"application/json",
            }
        }
        const data = JSON.stringify(_data)
        try {
            const response = await axios.post(`http://127.0.0.1:8000/auth/reset_password_confirm/`,data,config)
            navigate(`/login`);
            return response.data;
        } catch (error) {
        }
    };

    const userPasswordStrength = async (email,username,password,setResponse) => {
        const config = {
            headers:{
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/user-passwords/",
                {
                email: email,
                username: username,
                password: password,
                },
                config
            );
            if (response.status===200){
                setResponse(false);
            }else if (response.status===203){
                setResponse(true);
            };
        } catch (error) {
        }
    };
    const userPasswordNumeric = async (password,setResponse) => {
        const config = {
            headers:{
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/numeric-passwords/",
                {
                password: password,
                },
                config
            );
            if (response.status===200){
                setResponse(false);
            }else if (response.status===203){
                setResponse(true);
            };
          
        } catch (error) {
        }
    };

    const activate = async ( uid, token ) =>{
        const config = {
            headers:{
                "Content-Type":"application/json",
            }
        }
        const data = JSON.stringify({ uid, token })
        try {
            const response = await axios.post(`http://127.0.0.1:8000/auth/activation/`,data,config)
            navigate(`/login`);
            return response.data;
        } catch (error) {
        }
    };

    let logoutUser = () =>{
        setAuthTokens((prev)=>prev=null)
        setUser((prev)=>prev=null)
        localStorage.removeItem('authTokens')
        navigate("/login")
        return user
    };

    useEffect(()=>{
        if (authTokens){
            setUser(jwtDecode(authTokens.access));
        };
        setLoading(false);
    },[authTokens,loading])

    let contextData = {
        user:user,
        setUser:setUser,
        authTokens:authTokens,
        setAuthTokens:setAuthTokens,
        SignIn:SignIn,
        activate:activate,
        reset_password:reset_password,
        reset_password_confirm:reset_password_confirm,
        userPasswordStrength:userPasswordStrength,
        userPasswordNumeric:userPasswordNumeric,
        logoutUser:logoutUser,
    };

    return(
        <AuthContext.Provider value={contextData}>
            {loading?null:children}
        </AuthContext.Provider>
    )
};