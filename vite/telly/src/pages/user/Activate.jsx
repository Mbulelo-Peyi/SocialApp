import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from './index';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

const Activate = () => {
    const { activate } = useContext(AuthContext);
    const navigate = useNavigate();
    const {uid,token} = useParams();
    const activateMutation = useMutation({
        mutationFn: ({uid,token}) => activate(uid,token),
        onSuccess: () =>{
            navigate(`/`);
        }
    });
    const activate_account = () =>{
        activateMutation.mutate({uid,token})
    };
    return (
        <main className='relative top-[105px]'>
            <div className="w-screen py-16 flex flex-col  rounded-xl px-3 justify-center">
                <p className="my-12 font-semibold font-monsterrat px-3 text-green-700 bg-green-300">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit.
                </p>
                <button className="font-palanquin animate-pulse rounded-full font-bold bg-blue-600 text-blue-50" onClick={activate_account}>activate</button>
            </div>
        </main>
    )
}

export default Activate;