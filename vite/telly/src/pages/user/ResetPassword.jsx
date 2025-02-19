import React,{ useContext } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { AuthContext } from './index';
import { useMutation } from '@tanstack/react-query';


const ResetPassword = () => {
    const { reset_password } = useContext(AuthContext);
    const initialValues = { email: '' }

    const resetMutation = useMutation({
        mutationFn: (variables) => reset_password(variables),
        onSuccess: () =>{
        }
    });

    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Please include a valid email address so we can get back to you';
        }
        return errors;
        }
    const handleSubmit = (values, setSubmitting) => {
        resetMutation.mutate(values);
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
                    <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Forgot password?</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                        Remember your password?
                        <Link to={`login`} className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500">
                            Sign in here
                        </Link>
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
                                    <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Email address</label>
                                    <div className="relative">
                                        <input 
                                        type="email"
                                        id="email" 
                                        name="email" 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                        required aria-describedby="email-error"
                                        />
                                        {errors.email && touched.email && (
                                            <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    {errors.email && touched.email && (
                                        <p className="text-xs text-red-600 mt-2" id="email-error">{errors.email}</p>
                                    )}
                                </div>
                            <button 
                            type="submit" 
                            disabled={isSubmitting||resetMutation.isPending}
                            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                            >Reset password</button>
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

export default ResetPassword;
