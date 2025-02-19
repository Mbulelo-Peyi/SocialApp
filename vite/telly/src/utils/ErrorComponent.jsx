import React from 'react';


const ErrorComponent = ({error}) =>{
    return (
        <div>{error.message}</div>
    )
};

export default ErrorComponent;