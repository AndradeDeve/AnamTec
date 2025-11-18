// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRouter from './helpers/protectedRouter.js'; 
import ThemeInitializer from './pages/components/ThemeInitializer/ThemeInitializer.jsx'; // Importe o inicializador

import Login from './pages/Login/Login.jsx';
import Cadastro from './pages/Cadastro/Register.jsx';
import ResetPassW from './pages/ResetarSenha/ResetPassW.jsx';
import MasterDashboard from './pages/MasterDashboard';
import ObservacoesUsers from './pages/Observacoes/UserObservation.jsx';
import ControllAcess from './pages/ControleAcesso/ControllAcess.jsx';
import Configuracoes from './pages/Configuracoes/Configuracoes.jsx';
import ReportsDashboard from './pages/relatorio/reports/ReportsDashboard.jsx'; 
import NaoAchou from './pages/not-found/index.jsx'
function App() {
  return (
    <>
    <ThemeInitializer />
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/Cadastro" element={
            <ProtectedRouter roles={['coordenador pedagógico']}>  
                <Cadastro /> 
            </ProtectedRouter>
          } />
        <Route path="/ResetarSenha" element={<ResetPassW />} />
       <Route path="/Home" element={
        <ProtectedRouter>
            <MasterDashboard />
        </ProtectedRouter>} />
        <Route path="/Observacoes" element={<ObservacoesUsers />} />
        <Route path="/Controle" element={<ControllAcess />} />
        <Route path="/config" element={<Configuracoes />} />
        <Route path="/relatorios" element={<ReportsDashboard />} />
        <Route path="/NaoEncontrado" element={<NaoAchou />} />
      </Routes>
    </Router>
    <ToastContainer />    
      </>
  );
}

export default App;