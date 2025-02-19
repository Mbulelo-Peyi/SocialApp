import React, { useContext, useState, useEffect } from 'react';
import { Formik } from 'formik';
import { commonPasswords } from './index';
import { AuthContext, useAxios } from './index';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { LucideEye, LucideEyeOff } from 'lucide-react';


const PasswordChange = () => {
    const [weakPasswordResponse, setWeakPasswordResponse] = useState(false);
    const [numericPasswordResponse, setNumericPasswordResponse] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const { user, loginUser, userPasswordStrength, userPasswordNumeric} = useContext(AuthContext);
    const api = useAxios();
    const navigate = useNavigate();

    const passwordMutation = useMutation({
        mutationFn: (variables) => handlePasswordUpdate(variables),
        onSuccess: () =>{
            navigate(`/profile`);
        }
    });

    useEffect(()=>{
        if (!user) loginUser()
    },[])

    const initialValues = { password: '',new_password:'', confirm_new_password:''};

    const validate = (values) => {
        const errors = {};
        if (!values.password) {
            errors.password = 'Required';
        }
        if (!values.confirm_new_password) {
            errors.confirm_new_password = 'Required';
        }
        if (values.confirm_new_password!==values.new_password) {
            errors.confirm_new_password = 'Password not the same';
        }
        if (!values.new_password) {
            errors.new_password = 'Required';
        }
        if (commonPasswords.includes(values.new_password.toLowerCase())){
            errors.new_password = 'Password commonly used.';
        }
        if (values.new_password){
            userPasswordStrength(user?.email, user?.username, values.new_password, setWeakPasswordResponse);
            userPasswordNumeric(values.new_password, setNumericPasswordResponse);
            if (weakPasswordResponse){
              errors.new_password = 'Password not secure.';
            } else if (numericPasswordResponse){
              errors.new_password = 'Password not secure.';
            }
        }
        return errors;
    };

    const togglePassword = () =>{
        setShowPassword((prev)=>!prev)
    };
    const toggleNewPassword = () =>{
        setShowNewPassword((prev)=>!prev)
    };
    const toggleConfirmNewPassword = () =>{
        setShowConfirmNewPassword((prev)=>!prev)
    };

    const handlePasswordUpdate = async (passwords) =>{
        const config = {
            headers:{
                "Content-Type": "application/json",
            }
        };
        try {
            const response = await api.post(
                "/api/password-change/",
                passwords,
                config
            )
            return response.data;
        } catch (error) {
        }
    };

    const handleSubmit = (values, setSubmitting) => {
        const passwords = {};
        passwords.current_password = values.password;
        passwords.new_password = values.new_password;
        passwordMutation.mutate(passwords);
        setSubmitting(false);
    
    }
    const submit = (values, {setSubmitting})=>{
        handleSubmit(values, setSubmitting)
    }
    return (
        <main className="relative top-[105px]">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                    <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Update your password</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                        Remember it's your secret
                    </p>
                    </div>
                    <div className="mt-5">
                    <Formik
                    initialValues={initialValues}
                    validate={values => validate(values)}
                    onSubmit={submit}
                    >
                    {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-y-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Current password</label>
                                    <div className="relative">
                                        <input 
                                        type={showPassword?"text":"password"} 
                                        id="password" 
                                        name="password"
                                        autoComplete="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                        required aria-describedby="password-error"
                                        />
                                        {errors.password && touched.password && (
                                            <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                                </svg>
                                            </div>
                                        )}
                                        {!errors.password && !showPassword &&(
                                            <button className="absolute inset-y-0 border-none end-0 cursor-pointer pe-3" onClick={togglePassword}>
                                                <LucideEye size={20} color={'#1e293b'} />
                                            </button>
                                        )}
                                        {!errors.password && showPassword &&(
                                            <button className="absolute inset-y-0 end-0 border-none cursor-pointer pe-3" onClick={togglePassword}>
                                                <LucideEyeOff size={20} color={'#1e293b'} />
                                            </button>
                                        )}
                                    </div>
                                    {errors.password && touched.password && (
                                        <p className="text-xs text-red-600 mt-2" id="password-error">{errors.password}</p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="new_password" className="block text-sm mb-2 dark:text-white">New password</label>
                                    </div>
                                    <div className="relative">
                                        <input 
                                        type={showNewPassword?"text":"password"} 
                                        id="new_password" 
                                        name="new_password"
                                        autoComplete="new-password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.new_password} 
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                        required aria-describedby="new_password-error"
                                        />
                                        {errors.new_password && touched.new_password && (
                                            <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                                </svg>
                                            </div>
                                        )}
                                        {!errors.new_password && !showNewPassword &&(
                                            <button className="absolute inset-y-0 border-none end-0 cursor-pointer pe-3" onClick={toggleNewPassword}>
                                                <LucideEye size={20} color={'#1e293b'} />
                                            </button>
                                        )}
                                        {!errors.new_password && showNewPassword &&(
                                            <button className="absolute inset-y-0 end-0 border-none cursor-pointer pe-3" onClick={toggleNewPassword}>
                                                <LucideEyeOff size={20} color={'#1e293b'} />
                                            </button>
                                        )}
                                    </div>
                                    {errors.new_password && touched.new_password && (
                                        <p className="text-xs text-red-600 mt-2" id="new_password-error">{errors.new_password}</p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="confirm_new_password" className="block text-sm mb-2 dark:text-white">Confirm password</label>
                                    </div>
                                    <div className="relative">
                                        <input 
                                        type={showConfirmNewPassword?"text":"password"} 
                                        id="confirm_new_password" 
                                        name="confirm_new_password"
                                        autoComplete="confirm-new-password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.confirm_new_password} 
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                        required aria-describedby="confirm_new_password-error"
                                        />
                                        {errors.confirm_new_password && touched.confirm_new_password && (
                                            <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                                </svg>
                                            </div>
                                        )}
                                        {!errors.confirm_new_password && !showConfirmNewPassword &&(
                                            <button className="absolute inset-y-0 border-none end-0 cursor-pointer pe-3" onClick={toggleConfirmNewPassword}>
                                                <LucideEye size={20} color={'#1e293b'} />
                                            </button>
                                        )}
                                        {!errors.confirm_new_password && showConfirmNewPassword &&(
                                            <button className="absolute inset-y-0 end-0 border-none cursor-pointer pe-3" onClick={toggleConfirmNewPassword}>
                                                <LucideEyeOff size={20} color={'#1e293b'} />
                                            </button>
                                        )}
                                    </div>
                                    {errors.confirm_new_password && touched.confirm_new_password && (
                                        <p className="text-xs text-red-600 mt-2" id="confirm_new_password-error">{errors.confirm_new_password}</p>
                                    )}
                                </div>
                                <input  
                                className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300" 
                                type="submit" 
                                value="Update password"
                                disabled={isSubmitting||passwordMutation.isPending} />
                            </div>
                        </form>
                        )}
                    </Formik>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default PasswordChange;
