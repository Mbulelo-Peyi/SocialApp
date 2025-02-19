import React,{ useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik } from 'formik';
import { AuthContext } from './index';
import { LucideEye, LucideEyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';


const ResetPasswordConfirm = () =>{
    const { reset_password_confirm,userPasswordNumeric } = useContext(AuthContext);
    const [numericPasswordResponse, setNumericPasswordResponse] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const {uid,token} = useParams();

    const initialValues = { new_password:'', confirm_new_password:'' }

    const resetPasswordMutation = useMutation({
        mutationFn: (variables) => reset_password_confirm(variables),
        onSuccess: () =>{
        }
    });

    const toggleNewPassword = () =>{
        setShowNewPassword((prev)=>!prev)
    };
    const toggleConfirmNewPassword = () =>{
        setShowConfirmNewPassword((prev)=>!prev)
    };

    const validate = (values) => {
        const errors = {};
        if (!values.new_password) {
            errors.new_password = 'Required';
        }
        if (!values.confirm_new_password) {
            errors.confirm_new_password = 'Required';
        }
        if (values.new_password !== values.confirm_new_password) {
            errors.confirm_new_password = `Passwords don't match`;
        }
        if (values.new_password){
            userPasswordNumeric(values.new_password, setNumericPasswordResponse);
            if (numericPasswordResponse){
              errors.new_password = 'Password not secure.';
            }
        }
        return errors;
    };

    const handleSubmit = (values, setSubmitting) => {
        const data = {};
        data.uid = uid;
        data.token = token;
        data.new_password = values.new_password;
        data.re_new_password = values.confirm_new_password;
        resetPasswordMutation.mutate(data);
        setSubmitting(false);
    };
    const submit = (values, {setSubmitting})=>{
        handleSubmit(values, setSubmitting)
    };
    return (
        <main className="relative top-[105px]">
            <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Set new password</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                            reset password
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
                                    <label htmlFor="new_password" className="block text-sm mb-2 dark:text-white">Ente new password</label>
                                    <div className="relative">
                                    <input 
                                    type="password" 
                                    id="new_password" 
                                    name="new_password" 
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
                                        <label htmlFor="confirm_new_password" className="block text-sm mb-2 dark:text-white">Password</label>
                                        </div>
                                        <div className="relative">
                                        <input 
                                        type="password" 
                                        id="confirm_new_password" 
                                        name="confirm_new_password"
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
                            <button 
                            type="submit" 
                            disabled={isSubmitting||resetPasswordMutation.isPending}
                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                            >Reset password confirm</button>
                            </div>
                        </form>
                    )}
                    </Formik>
                    </div>
                </div>
            </div>
        </main>
    )
};

export default ResetPasswordConfirm;