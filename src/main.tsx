/* global document */
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './app'
import './styles/Reset.css'
import './styles/Main.css'

// Set page title for entire app
document.title = 'Value Quest'

// Initialize React app
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter basename="valuequest">
            <App />
        </BrowserRouter>
    </React.StrictMode>
)