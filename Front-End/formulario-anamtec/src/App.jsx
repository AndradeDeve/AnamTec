import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FormProvider } from "./Context/FormContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home";
import FormInform from "./Pages/FormInform";
import FormResp from "./Pages/FormResp";
import FormSaude from "./Pages/FormSaude";
import FormComportEmocio from "./Pages/FormComportEmocio";
import FormRevisao from "./Pages/FormRevisao";


function App() {
  return (
    <FormProvider>
      <Router>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/FormInform" element={<FormInform />} />
          <Route path="/FormResp" element={<FormResp />} />
          <Route path="/FormSaude" element={<FormSaude />} />
          <Route path="/FormComportEmocio" element={<FormComportEmocio />} />
          <Route path="/FormRevisao" element={<FormRevisao/>} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        pauseOnHover
        theme="light"
      />
    </FormProvider>
  );
}


export default App;
