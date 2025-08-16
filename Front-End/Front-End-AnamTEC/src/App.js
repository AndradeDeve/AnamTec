// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import ResetPassW from './pages/ResetPassW';
import MasterDashboard from './pages/MasterDashboard';
import ObservacoesUsers from './pages/ObservacoesUsers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ResetarSenha" element={<ResetPassW />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Cadastro />} />
        <Route path="/CoordP" element={<MasterDashboard />} />
        <Route path="/Observacoes" element={<ObservacoesUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
