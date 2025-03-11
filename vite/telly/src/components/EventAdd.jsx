import React from 'react';
import { Formik } from 'formik';


const EventAdd = ({ data, create, remove, update }) => {
    const initialValues = { 
        title: data?data?.title:'', 
        description: data?data?.description:'', 
        date: data?data?.date:'', 
        venue: data?data?.venue:'',
    };
    const validate = (values) => {
        const errors = {};
        if (!values.title) {
          errors.title = 'Required';
        }
        if (!values.description) {
          errors.description = 'Required';
        }
        if (!values.date) {
            errors.date = 'Required';
        }
        if (!values.venue) {
            errors.venue = 'Required';
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
                        <label htmlFor="title" className="block text-sm mb-2 dark:text-white">Event Title</label>
                        <div className="relative">
                            <input  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="title-error"
                            type="text" 
                            id="title" 
                            name="title"
                            placeholder=""
                            maxLength="60"
                            autoComplete={"true"}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.title} 
                            />
                            {errors.title && touched.title && (
                                <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                    <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                        {errors.title && touched.title && (
                            <p className="text-xs text-red-600 mt-2" id="email-error">{errors.title}</p>
                        )}
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="description" className="block text-sm mb-2 dark:text-white">Description</label>
                        </div>
                        <div className="relative">
                            <textarea  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="description-error"
                            type="text" 
                            id="description" 
                            name="description"
                            placeholder=""
                            maxLength="100" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description}
                            ></textarea>
                            {errors.description && touched.description && (
                            <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                </svg>
                            </div>
                            )}
                        </div>
                        {errors.description && touched.description && (
                        <p className="text-xs text-red-600 mt-2" id="description-error">{errors.description}</p>
                        )}
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="venue" className="block text-sm mb-2 dark:text-white">Venue</label>
                        </div>
                        <div className="relative">
                            <input 
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="venue-error"
                            type="text"
                            id="venue" 
                            name="venue"
                            placeholder=""
                            autoComplete="venue"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.venue}
                            />
                            {errors.venue && touched.venue && (
                            <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                </svg>
                            </div>
                            )}
                        </div>
                        {errors.venue && touched.venue && (
                            <p className="text-xs text-red-600 mt-2" id="venue-error">{errors.venue}</p>
                        )}
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="date" className="block text-sm mb-2 dark:text-white">Date</label>
                        </div>
                        <div className="relative">
                            <input  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="date-error"
                            type="datetime-local" 
                            id="date" 
                            name="date"
                            placeholder="date"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.date}
                            />
                        </div>
                        {errors.date && touched.date && (
                            <p className="text-xs text-red-600 mt-2" id="date-error">{errors.date}</p>
                        )}
                    </div>
                    {data ? (
                        <div className="flex">
                            <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isSubmitting||update?.isPending||remove?.isPending}
                            >Create event</button>
                            <button type="button" onClick={()=>remove?.mutate()} className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isSubmitting||update?.isPending||remove?.isPending}
                            >Create event</button>
                        </div>
                    ):(
                        <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                        disabled={isSubmitting||create?.isPending}
                        >Create event</button>
                    )}
                    
                </div>
            </form>
        )}
        </Formik>
    )
}

export default EventAdd