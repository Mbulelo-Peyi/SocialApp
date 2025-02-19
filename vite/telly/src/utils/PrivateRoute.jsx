import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () =>{
    const {user} = useContext(AuthContext)
    return(
        !user?<Navigate to={"/login"}/>:<Outlet />
        

    )
};

export default PrivateRoute;