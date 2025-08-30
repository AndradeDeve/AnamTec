// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';

import Login from './pages/Login';
import Cadastro from './pages/Register.jsx';
import ResetPassW from './pages/ResetPassW';
import MasterDashboard from './pages/MasterDashboard';
import ObservacoesUsers from './pages/UserObservation';
import ControllAcess from './pages/ControllAcess';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<ResetPassW />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Cad" element={<Cadastro />} />
        <Route path="/coord" element={<MasterDashboard />} />
        <Route path="/Observacoes" element={<ObservacoesUsers />} />
         <Route path="/Controle" element={<ControllAcess />} />
      </Routes>
    </Router>
      <ToastContainer />
      </>
  );
}

export default App;
