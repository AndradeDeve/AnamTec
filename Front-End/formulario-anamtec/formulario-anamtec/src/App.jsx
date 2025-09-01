import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home";
import FormInform from "./Pages/FormInform";
import FormResp from "./Pages/FormResp";
import FormSaude from "./Pages/FormSaude";
import FormComportEmocio from "./Pages/FormComportEmocio";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/FormInform" element={<FormInform />} />
        <Route path="/FormResp" element={<FormResp />} />
        <Route path="/FormSaude" element={<FormSaude />} />
        <Route path="/FormComportEmocio" element={<FormComportEmocio />} />
      </Routes>
    </Router>
  );
}

export default App;
