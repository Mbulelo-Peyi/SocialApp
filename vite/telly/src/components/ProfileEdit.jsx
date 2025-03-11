import React from 'react';
import { Formik } from 'formik';

const ProfileEdit = ({ data, update }) => {
    const initialValues = { 
        email: data?data?.email:'', 
        username: data?data?.username:'',
        bio: data?data?.bio:'', 
        birthday: data?data?.birthday:'', 
        sex: data?data?.sex:'',
    };
    const validate = (values) => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Required';
        }
        if (!values.username) {
            errors.username = 'Required';
        }
        if (!values.bio) {
            errors.bio = 'Required';
        }
        if (!values.birthday) {
            errors.birthday = 'Required';
        }
        if (!values.sex) {
            errors.sex = 'Required';
        }
        return errors;
    };
    const handleSubmit = (values, setSubmitting) => {
        console.log(values);
        update?.mutate(values)
        setSubmitting(false);
    }
      const submit = (values, {setSubmitting})=>{
        handleSubmit(values, setSubmitting)
    }
    return (
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
                        <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Event email</label>
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
                            <label htmlFor="bio" className="block text-sm mb-2 dark:text-white">bio</label>
                        </div>
                        <div className="relative">
                            <textarea  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="bio-error"
                            type="text" 
                            id="bio" 
                            name="bio"
                            placeholder=""
                            maxLength="100" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.bio}
                            ></textarea>
                            {errors.bio && touched.bio && (
                            <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                </svg>
                            </div>
                            )}
                        </div>
                        {errors.bio && touched.bio && (
                        <p className="text-xs text-red-600 mt-2" id="bio-error">{errors.bio}</p>
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
                    <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                    disabled={isSubmitting||update?.isPending}
                    >update</button>
                    
                </div>
            </form>
        )}
        </Formik>
    )
}

export default ProfileEdit