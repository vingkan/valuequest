/* global document */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { DEMO_GAME } from './scenarios/demo.tsx';
import './styles/Reset.css'
import './styles/Main.css'

// Set page title for entire app
document.title = 'Value Quest'

// Initialize React app
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter basename="valuequest">
            <App game={DEMO_GAME} />
        </BrowserRouter>
    </React.StrictMode>
)