import React, { useContext, useEffect } from 'react';
import { Formik } from 'formik';
import { AuthContext, useAxios } from './index';
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query';

const Complaint = () => {
    const { user } = useContext(AuthContext);
    const api = useAxios();
    const navigate = useNavigate();
    const initialValues = { issue: '',};

    const issueMutation = useMutation({
        mutationFn: (variables)=> fileAComplaint(variables),
        onSuccess: (data)=> {
            console.log(data)
            navigate(`/`);
        }
    });

    useEffect(()=>{
        if(!user) navigate(`/`);
    },[])

    const validate = (values) => {
        const errors = {};
        if (!values.issue) {
            errors.issue = 'Required';
        }
        return errors;
    };

    const fileAComplaint = async (data) =>{
        const config = {
            headers:{
                "Content-Type": "application/json",
            },
        };
        await api.post(`/api/complaint-create/`,data,config)
        .then(res=>{return res.data}).catch(err=>console.log(err))
    };
  
    const handleSubmit = (values, setSubmitting) => {
        issueMutation.mutate(JSON.stringify(values, null, 2));
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
                        <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Something wrong?</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                            Write us a Report
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
                                        <label htmlFor="issue" className="block text-sm mb-2 dark:text-white">Complaint</label>
                                        <div className="relative">
                                            <textarea 
                                            type="text" 
                                            id="issue" 
                                            name="issue" 
                                            cols="20"
                                            rows="4"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.issue}  
                                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                            required aria-describedby="issue-error"
                                            ></textarea>
                                            <div className={`${!errors.issue && !touched.issue && !errors.issue && ("hidden")} absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3`}>
                                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                                </svg>
                                            </div>
                                            </div>
                                            <p className={`${!errors.issue && !touched.issue && !errors.issue && ("hidden")} text-xs text-red-600 mt-2`} id="issue-error">{errors.issue && touched.issue && errors.issue}</p>
                                    </div>

                                    <input className={`${issueMutation.isPending && ("hidden")} mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300`} type="submit" value="Report"
                                    disabled={isSubmitting||issueMutation.isPending} />
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

export default Complaint;
