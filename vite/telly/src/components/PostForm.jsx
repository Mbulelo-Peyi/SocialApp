import { CircleOff } from 'lucide-react';
import React, { useState } from 'react';
import { useAxios } from './index';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const PostForm = ({ author_content_type, author_object_id }) => {
    const [postText, setPostText] = useState("");
    const [postFiles, setPostFiles] = useState([]);
    const [scheduled, setScheduled] = useState("");
    const api = useAxios();
    const queryClient = useQueryClient();

    const postMutation = useMutation({
        mutationFn: ()=> postData(),
        onSuccess : ()=> {
            setPostText("");
            setPostFiles([]);
            queryClient.invalidateQueries(['feed']);
        },
    });

    // Handle post text
    const handleTextChange = (e) => {
        setPostText(e.target.value);
    };

    // Handle file input change
    const handleFileChange = (e) => {
        setPostFiles([...e.target.files]);
    };

    // Handle post submission
    const handlePostSubmit = async(e) => {
        e.preventDefault();

        if (!postText && postFiles.length === 0) {
            alert("Please enter text or upload files to create a post.");
            return;
        }
        postMutation.mutate();
    };

    // Handle post data
    const postData = async () =>{
        const formData = new FormData()
        formData.append("content",postText);
        formData.append("author_content_type",author_content_type);
        formData.append("author_object_id",author_object_id);
        formData.append("scheduled_time",scheduled)
        postFiles?.forEach((file)=>{
            formData.append("media",file)
        });
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        };
        try {
            const response = await api.post(
                `/content/api/post/`,
                formData,
                config
            )
            return response.data;
        } catch (error) {
            return error;
        };
    };

    // Handle post files
    const handlePopFile = (index) => {
        const files = []
        postFiles?.forEach((element, idx) => {
            if (idx != index){
                files.push(element);
            }
            return files;
        })
        setPostFiles(files);
    }
    return (
        <form onSubmit={handlePostSubmit} className="bg-white shadow-md rounded-lg p-4 mb-6">
            <textarea
                className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="What's on your mind?"
                value={postText}
                onChange={handleTextChange}
            ></textarea>

            <div className="mt-4">
                <label htmlFor="files" className="block mb-2 text-gray-700 font-medium">
                    Upload files (optional):
                </label>
                <input
                    type="file"
                    multiple
                    id="files"
                    name="files"
                    onChange={handleFileChange}
                    className="hidden w-full text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                />
                {postFiles?.length > 0 && (
                    <div className="flex overflow-x-auto py-3">
                        {postFiles?.map((file,index)=>(
                            <React.Fragment key={index}>
                                <button type="button" onClick={()=>handlePopFile(index)} className="relative -top-2 h-fit w-auto left-8 rounded-full bg-teal-100"><CircleOff /></button>
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Attachment ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-md mx-4"
                                /> 
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={postMutation.isPending}
                className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-600 transition"
            >
                Post
            </button>
        </form>
    )
}

export default PostForm