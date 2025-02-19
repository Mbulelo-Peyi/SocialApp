import React,{ useContext, Fragment, useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { commonPasswords, usedEmails, Modal } from './index';
import axios from "axios";
import { AuthContext } from './index';
import { useMutation } from '@tanstack/react-query';
import { LucideEye, LucideEyeOff } from 'lucide-react';
import dayjs from 'dayjs';


const Register = () => {
  const { user, userPasswordStrength, userPasswordNumeric } = useContext(AuthContext);
  const [showTerms, setShowTerms] = useState(false);
  const [weakPasswordResponse, setWeakPasswordResponse] = useState(false);
  const [numericPasswordResponse, setNumericPasswordResponse] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const userMutation = useMutation({
    mutationFn: (variables)=> handleRegister(variables),
    onSuccess : (data)=> {
      console.log(data);
    },
  });
  useEffect(()=>{
    if (user){
      let isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
      if(!isExpired) navigate(`/`);
    };
    
  },[]);

  const Terms = ()=>{
    setShowTerms((prev)=>!prev)
  };
  const togglePassword = () =>{
    setShowPassword((prev)=>!prev)
  };

  const toggleConfirmPassword = () =>{
    setShowConfirmPassword((prev)=>!prev)
  };

  const initialValues = { email: '', username:'', password1:'', password2:'', birthday:'', sex:''};

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Required';
    }
    if (!values.username) {
      errors.username = 'Required';
    }
    if (!values.password1) {
      errors.password1 = 'Required';
    }
    if (values.password1.length < 9) {
      errors.password1 = 'Password too short';
    }
    if (commonPasswords.includes(values.password1.toLowerCase())){
      errors.password1 = 'Password commonly used.';
    }
    if (values.email.length > 0 && values.email.toLowerCase().localeCompare(values.password1.toLowerCase()) ===0){
      errors.password1 = 'Password not secure.';
    }
    if (values.username.length > 0 && values.username.toLowerCase().localeCompare(values.password1.toLowerCase()) ===0){
      errors.password1 = 'Password not secure.';
    }
    if (!values.password2) {
      errors.password2 = 'Required';
    }
    if (!values.birthday) {
      errors.birthday = 'Required';
    }
    if (!values.sex) {
      errors.sex = 'Required';
    }
    if (values.password1 !== values.password2) {
      errors.password2 = 'Passwords not the same';
    }
    if (usedEmails.includes(values.email.toLowerCase())){
      errors.email = 'Already in use';
    }
    if (values.email&&values.username &&values.password1){
      userPasswordStrength(values.email, values.username, values.password1, setWeakPasswordResponse);
      userPasswordNumeric(values.password1, setNumericPasswordResponse);
      if (weakPasswordResponse){
        errors.new_password = 'Password not secure.';
      } else if (numericPasswordResponse){
        errors.new_password = 'Password not secure.';
      }
    }
    return errors;
  }
  
  const handleRegister = async (data) =>{
    const config = {
      headers:{
        "Content-Type": "application/json"
      }
    };
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/profile/`,
        data,
        config
      )
      console.log(response)
      navigate("/activation", {state:data.email})
    } catch (error) {
      console.error("Error:", error)
    }
  };

  const data = {};
  const handleSubmit = (values, setSubmitting) => {
    data.email = values.email.toLowerCase();
    data.username = values.username;
    data.password = values.password1;
    data.birthday = values.birthday;
    data.sex = values.sex;
    userMutation.mutate(data);
    setSubmitting(false);
  }
  const submit = (values, {setSubmitting})=>{
    handleSubmit(values, setSubmitting)
  }
  return (
    <Fragment>
      <main className="relative top-[105px]">
        <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign up</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                Already have an account?
                <Link to={`/login`} className="text-blue-600 decoration-2 hover:underline font-medium dark:text-blue-500" >
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
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                          required aria-describedby="email-error"
                          type="email" 
                          id="email" 
                          name="email"
                          placeholder=""
                          maxLength="60"
                          autoComplete={"true"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email} 
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
                      <div>
                        <div className="flex justify-between items-center">
                          <label htmlFor="username" className="block text-sm mb-2 dark:text-white">Username</label>
                          </div>
                          <div className="relative">
                            <input  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="username-error"
                            type="text" 
                            id="username" 
                            name="username"
                            placeholder=""
                            maxLength="100" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.username}
                            />
                            {errors.username && touched.username && (
                              <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                </svg>
                              </div>
                            )}
                        </div>
                        {errors.username && touched.username && (
                          <p className="text-xs text-red-600 mt-2" id="username-error">{errors.username}</p>
                        )}
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <label htmlFor="password1" className="block text-sm mb-2 dark:text-white">Password</label>
                          </div>
                          <div className="relative">
                            <input 
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="password1-error"
                            type={showPassword?"text":"password"} 
                            id="password1" 
                            name="password1"
                            placeholder=""
                            autoComplete="new-password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password1}
                            />
                            {errors.password1 && touched.password1 && (
                              <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                </svg>
                              </div>
                            )}
                            {!errors.password1 && !showPassword &&(
                              <button className="absolute inset-y-0 border-none end-0 cursor-pointer pe-3" onClick={togglePassword}>
                                <LucideEye size={20} color={'#1e293b'} />
                              </button>
                            )}
                            {!errors.password1 && showPassword &&(
                              <button className="absolute inset-y-0 end-0 border-none cursor-pointer pe-3" onClick={togglePassword}>
                                <LucideEyeOff size={20} color={'#1e293b'} />
                              </button>
                            )}
                        </div>
                        {errors.password1 && touched.password1 && (
                          <p className="text-xs text-red-600 mt-2" id="password1-error">{errors.password1}</p>
                        )}
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <label htmlFor="password2" className="block text-sm mb-2 dark:text-white">Confirm Password</label>
                        </div>
                        <div className="relative">
                          <input 
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                          required aria-describedby="password2-error"
                          type={showConfirmPassword?"text":"password"} 
                          id="password2" 
                          name="password2"
                          placeholder=""
                          autoComplete="new-password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password2}
                          />
                          {errors.password2 && touched.password2 && (
                            <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                              <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                              </svg>
                            </div>
                          )}
                          {!errors.password2 && !showConfirmPassword &&(
                            <button className="absolute inset-y-0 border-none end-0 cursor-pointer pe-3" onClick={toggleConfirmPassword}>
                              <LucideEye size={20} color={'#1e293b'} />
                            </button>
                          )}
                          {!errors.password2 && showConfirmPassword &&(
                            <button className="absolute inset-y-0 end-0 border-none cursor-pointer pe-3" onClick={toggleConfirmPassword}>
                              <LucideEyeOff size={20} color={'#1e293b'} />
                            </button>
                          )}
                        </div>
                        {errors.password2 && touched.password2 && (
                          <p className="text-xs text-red-600 mt-2" id="password2-error">{errors.password2}</p>
                        )}
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <label htmlFor="birthday" className="block text-sm mb-2 dark:text-white">Birthday</label>
                        </div>
                        <div className="relative">
                          <input  
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                          required aria-describedby="birthday-error"
                          type="date" 
                          id="birthday" 
                          name="birthday"
                          placeholder="birthday"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.birthday}
                          />
                        </div>
                        {errors.birthday && touched.birthday && (
                          <p className="text-xs text-red-600 mt-2" id="birthday-error">{errors.birthday}</p>
                        )}
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <label htmlFor="sex" className="block text-sm mb-2 dark:text-white">Sex</label>
                        </div>
                        <div className="relative">
                          <select
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                          required aria-describedby="sex-error"
                          id="sex" 
                          name="sex"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.sex}>
                            <option value="">Select</option>
                            <option value="1">Male</option>
                            <option value="0">Female</option>
                            <option value="2">Other</option>
                          </select>
                        </div>
                        {errors.sex && touched.sex && (
                          <p className="text-xs text-red-600 mt-2" id="sex-error">{errors.sex}</p>
                        )}
                      </div>
                    <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    disabled={isSubmitting||userMutation.isPending}
                    >Sign in</button>
                    <div className="flex flex-row items-center gap-4">
                      <input type="checkbox" required={true} />
                      <span className="text-lg text-center dark:-blue-100 text-slate-950"> 
                        I agree to the 
                        <span> </span>
                        <span className="text-blue-500" onClick={Terms}>terms and conditions</span>
                      </span>
                    </div>
                    </div>
                  </form>
                )}
                </Formik>
              </div>
          </div>
        </div>
      </main>
      <Modal isVisible={showTerms} onClose={Terms}>
        <div className="p6">
          <h3 className="text-lg font-monsterrat font-semibold text-gray-900 mb-5">Terms & Conditions</h3>
        </div>
        <p className="pt-5 font-palaquin font-normal text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit.

        </p>
        <p className="pt-5 font-palaquin font-normal text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit.

        </p>
      </Modal>
    </Fragment>
  )
}

export default Register;
