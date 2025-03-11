import React, { useContext } from "react";
import { AuthContext, useAxios } from "./index";
import { Formik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";

const PostEdit = ({ post, onClose }) => {
    const { user } = useContext(AuthContext);
    const api = useAxios();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const initialValues = { 
        content: post?.content, 
        scheduled_time: post?.scheduled_time,
        author_content_type: post?.author_content_type,
        author_object_id: post?.author_object_id,
    };
    const validate = (values) => {
        const errors = {};
        if (!values.content) {
            errors.content = 'Required';
        }
        if (!values.scheduled_time) {
            errors.scheduled_time = 'Required';
        }
        return errors;
    };
    const updatePostMutation = useMutation({
            mutationFn: (variables)=> updatePost(variables),
            onSuccess: (data)=> {
                onClose();
                queryClient.invalidateQueries(['post-permissions', post?.id])
            }
    });

    const deletePostMutation = useMutation({
        mutationFn: ()=> deletePost(),
        onSuccess: (data)=> {
            onClose();
            navigate(`/profile/${user?.id}/`)
            queryClient.removeQueries(['post-permissions', post?.id])
        }
    });

    const updatePost = async (data) =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        try {
            const response = await api.put(
                `/content/api/post/${post?.id}/`,
                data,
                config
            )
            return response.data;
        } catch (error) {
            console.log("Error updating profile:", error);
        }
    };

    const deletePost = async () =>{
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }
        try {
            const response = await api.delete(
                `/content/api/post/${post?.id}/`,
                config
            )
            return response.data;
        } catch (error) {
            console.log("Error updating profile:", error);
        }
    };

    const handleSubmit = (values, setSubmitting) => {
        updatePostMutation.mutate(values)
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
                        <div className="flex justify-between items-center">
                            <label htmlFor="content" className="block text-sm mb-2 dark:text-white">Content</label>
                        </div>
                        <div className="relative">
                            <textarea  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="content-error"
                            type="text" 
                            id="content" 
                            name="content"
                            placeholder=""
                            maxLength="100" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.content}
                            ></textarea>
                            {errors.content && touched.content && (
                            <div className="absolute inset-y-0 end-0 pointer-events-none pe-3 mt-3">
                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                </svg>
                            </div>
                            )}
                        </div>
                        {errors.content && touched.content && (
                        <p className="text-xs text-red-600 mt-2" id="content-error">{errors.content}</p>
                        )}
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="scheduled_time" className="block text-sm mb-2 dark:text-white">Scheduled Time</label>
                        </div>
                        <div className="relative">
                            <input  
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                            required aria-describedby="scheduled_time-error"
                            type="datetime-local" 
                            id="scheduled_time" 
                            name="scheduled_time"
                            placeholder="scheduled_time"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.scheduled_time}
                            />
                        </div>
                        {errors.scheduled_time && touched.scheduled_time && (
                            <p className="text-xs text-red-600 mt-2" id="scheduled_time-error">{errors.scheduled_time}</p>
                        )}
                    </div>
                        <div className="flex">
                            <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isSubmitting||updatePostMutation.isPending||deletePostMutation.isPending}
                            >update post</button>
                            <button type="button" onClick={()=>deletePostMutation.mutate()} className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none"
                            disabled={isSubmitting||updatePostMutation.isPending||deletePostMutation.isPending}
                            >delete</button>
                        </div>
                </div>
            </form>
        )}
        </Formik>
    )
}

export default PostEdit
