import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home";
import FormAspec from "./Pages/FormInform";
import FormResp from "./Pages/FormResp";
import FormSaude from "./Pages/FormSaude";


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/Home" element={<Home />} />
      <Route path="/FormInform" element={<FormInform />} />
      <Route path="/FormResp" element={<FormResp />} />
      <Route path="/FormSaude" element={<FormSaude />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
