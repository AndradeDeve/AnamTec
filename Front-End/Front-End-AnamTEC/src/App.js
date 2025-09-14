// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// CSS customizado

import Login from './pages/Login';
import Cadastro from './pages/Register.jsx';
import ResetPassW from './pages/ResetPassW';
import MasterDashboard from './pages/MasterDashboard';
import ObservacoesUsers from './pages/UserObservation';
import ControllAcess from './pages/ControllAcess';
import Configuracoes from './pages/Configuracoes.jsx';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/ResetarSenha" element={<ResetPassW />} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="/" element={<MasterDashboard />} />
        <Route path="/Observacoes" element={<ObservacoesUsers />} />
         <Route path="/Controle" element={<ControllAcess />} />
         <Route path="/config" element={<Configuracoes />} />
      
      </Routes>
    </Router>
    <ToastContainer />    
      </>
  );
}

export default App;