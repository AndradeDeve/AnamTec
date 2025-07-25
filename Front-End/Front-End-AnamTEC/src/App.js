// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import ResetPassW from './pages/ResetPassW';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResetPassW />} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Cadastro" element={<Cadastro />} />
      </Routes>
    </Router>
  );
}

export default App;
