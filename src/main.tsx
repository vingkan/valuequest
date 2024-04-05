/* global document */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ScenarioApp } from './studio/ScenarioApp.tsx'
import { DEMO_GAME } from './scenarios/demo.tsx';
import './styles/Reset.css'
import './styles/Main.css'

// Set page title for entire app
document.title = 'Value Quest'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App game={DEMO_GAME} />,
    },
    {
        path: '/scenarios',
        element: <ScenarioApp />,
    },
], {
    basename: '/valuequest',
})

// Initialize React app
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)