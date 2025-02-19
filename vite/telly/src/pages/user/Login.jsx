import React, { useContext, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext';
import dayjs from 'dayjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LucideEye, LucideEyeOff } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { user, SignIn } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: (variables)=> SignIn(variables),
    onSuccess : ()=> {
      queryClient.invalidateQueries(['user']);
      navigate(-1);
    },
  });

  useEffect(()=>{
    if (user) {
      let isExpired = dayjs.unix(user?.exp).diff(dayjs()) < 1;
      if(!isExpired) navigate(`/`);
    }
  },[]);

  const initialValues = { email: '', password:''};

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    return errors;
  }

  const togglePassword = () =>{ setShowPassword((prev)=>!prev) };

  const handleSubmit = (values, setSubmitting) => {
    values.email = values.email.toLowerCase()
    loginMutation.mutate(JSON.stringify(values, null, 2));
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
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Don't have an account yet?
              <Link to={`/register`} className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500" >
              Sign up here
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
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                      required aria-describedby="email-error"
                      type="email" 
                      id="email" 
                      name="email"
                      placeholder=""
                      autoCapitalize="none" 
                      autoComplete="email" 
                      maxLength="60" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      />
                      {errors.email && touched.email &&(
                        <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                          <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.email && touched.email &&(
                      <p className="text-xs text-red-600 mt-2" id="email-error">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                      <Link to={`/reset-password`} className="text-sm text-blue-600 decoration-2 hover:underline font-medium">Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <input 
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                      required aria-describedby="password-error"
                      type={showPassword?"text":"password"} 
                      id="password" 
                      name="password"
                      placeholder=""
                      autoComplete="current-password" 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      />
                      {errors.password && touched.password &&(
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
                    {errors.password && touched.password &&(
                      <p className="text-xs text-red-600 mt-2" id="password-error">{errors.password}</p>
                    )}
                  </div>
                <button 
                type="submit" 
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                disabled={isSubmitting||loginMutation.isPending}
                >Sign in</button>
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

export default Login;
