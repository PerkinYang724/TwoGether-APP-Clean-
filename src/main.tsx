import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { MusicProvider } from './context/MusicContext'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MusicProvider>
            <App />
        </MusicProvider>
    </React.StrictMode>
)
// Force rebuild Thu Sep 11 19:40:47 CST 2025
// Fresh deployment Thu Sep 11 19:46:47 CST 2025
