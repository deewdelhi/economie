// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
/**
 * 
 * E /users/dj-rest-auth/login
 * dj-rest-auth/registration/',
 * Da e users/ si apoi restul
Claudia
Partea de dj-rest-auth e pt ca noi teoretic folosim url ul de baza si ii dam override
Claudia
Claudia Ioana
Si dupa pt ca logoutul e mapat la conventia de baza ca pe ala nu il mai modificam lasam tot ce tine de authentication pe conventia de baza  
 */

