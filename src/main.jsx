import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './i18n'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/styles/main.css'
import './assets/styles/listing.css';
import './assets/styles/date-range.css';


import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<div style={{padding:20}}>Loading…</div>}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
)
