import React from 'react';
import { Formik } from 'formik';

const Rule = ({ data, create, update, remove }) => {
    const initialValues = { text: data?data?.text:'' };
    const validate = (values) => {
        const errors = {};
        if (!values.text) {
          errors.text = 'Required';
        }
        return errors;
    };
    const handleSubmit = (values, setSubmitting) => {
        console.log(values);
        data?update?.mutate(values):create?.mutate(values)
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
                        <label htmlFor="text" className="block text-sm mb-2 dark:text-white">Rule</label>
                        <div className="relative">
                            <textarea  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="text-error"
                            type="text" 
                            id="text" 
                            name="text"
                            placeholder=""
                            maxLength="60"
                            autoComplete={"true"}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.text} 
                            ></textarea>
                            {errors.text && touched.text && (
                                <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                    <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                        {errors.text && touched.text && (
                            <p className="text-xs text-red-600 mt-2" id="email-error">{errors.text}</p>
                        )}
                    </div>
                    {data ? (
                        <div className="flex">
                            <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isSubmitting||update?.isPending||remove?.isPending}
                            >update rule</button>
                            <button type="button" onClick={()=>remove?.mutate()} className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isSubmitting||update?.isPending||remove?.isPending}
                            >delete rule</button>
                        </div>
                    ):(
                        <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        disabled={isSubmitting||create?.isPending}
                        >Create rule</button>
                    )}
                    
                </div>
            </form>
        )}
        </Formik>
    )
}

export default Rule