// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import ResetPassW from './pages/ResetPassW';
import MasterDashboard from './pages/MasterDashboard';
import ObservacoesUsers from './pages/ObservacoesUsers';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/ResetarSenha" element={<ResetPassW />} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="/CoordenadorPedagogico" element={<MasterDashboard />} />
        <Route path="/" element={<ObservacoesUsers />} />
      </Routes>
    </Router>
      <ToastContainer />
      </>
  );
}

export default App;
