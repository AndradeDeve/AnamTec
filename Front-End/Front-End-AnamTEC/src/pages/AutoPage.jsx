// AuthPage.js
import React, { useState } from "react";
import "./Register.css";
import logoAnamTec from "../assets/logoAnamTEC.png";
import Register from "./Register.jsx";
import Login from "./Login";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <div className="register-container">
      <header className="header">
        <h1 className="TitleLogo">AnamTec</h1>
        <img src={logoAnamTec} alt="Logo" className="logo" />
      </header>

      <main className="Forms-box">
        <div className="tabs">
          <button onClick={() => setActiveTab("login")}></button>
          <button onClick={() => setActiveTab("register")}>Cadastro de profissional</button>
        </div>

        {activeTab === "login" && (
          <Login switchToRegister={() => setActiveTab("register")} />
        )}
        {activeTab === "register" && (
          <Register switchToLogin={() => setActiveTab("login")} />
        )}
      </main>
    </div>
  );
}

export default AuthPage;
