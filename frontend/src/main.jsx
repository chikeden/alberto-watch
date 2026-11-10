import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {MotionConfig} from 'motion/react';
import {AuthProvider} from './context/AuthContext';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><ErrorBoundary><BrowserRouter><MotionConfig reducedMotion="user"><AuthProvider><App/></AuthProvider></MotionConfig></BrowserRouter></ErrorBoundary></React.StrictMode>);
