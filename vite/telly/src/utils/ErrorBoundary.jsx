import React, { Component } from 'react';
import ErrorComponent from './ErrorComponent';

class ErrorBoundary extends Component {
    state = { error: null}

    static getDerivedStateFromError(error){
        return {error:error};
    }

    componentDidCatch(error, info){
        console.log(error, info);
    }
    render() {
        if (this.state.error){
            return <ErrorComponent error={this.state.error} />;
        }
        return this.props.children
    }
}

export default ErrorBoundary;
