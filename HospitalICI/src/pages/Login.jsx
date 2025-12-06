import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./styles/Login.css";

import logo from "../assets/logo.png";
import emailIcon from "../assets/email.png";
import lockIcon from "../assets/lock.png";
import eyeOpen from "../assets/eye-open.png";
import eyeClosed from "../assets/eye-closed.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setRol, setNombre, setPuesto } = useUser();

  const handleLogin = () => {
    if (!correo || !password) {
      setError("Por favor complete todos los campos.");
      return;
    }

    const email = correo.toLowerCase();

    if (email === "recepcionista@gmail.com") {
      setRol("recepcionista");
      setNombre("Rebeca Sánchez");
      setPuesto("Recepcionista");
      navigate("/homerecep");
      return;
    }

    if (email === "medico@gmail.com") {
      setRol("medico");
      setNombre("Dr. A. Grant");
      setPuesto("Dermatología");
      navigate("/homemed");
      return;
    }

    if (email === "admin@gmail.com") {
      setRol("administrador");
      setNombre("Andrea Torres");
      setPuesto("Administradora");
      navigate("/homeadmin");
      return;
    }

    setError("Usuario o contraseña incorrectos.");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="HospitalICI Logo" width="50" height="50" />

        <h2>Hospital ICI</h2>

        <label>Correo Electrónico</label>
        <div className="input-icon-container">
          <img src={emailIcon} className="input-icon" />
          <input
            type="text"
            placeholder="Introduzca su correo electrónico"
            className="input-with-icon"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <label>Contraseña</label>
        <div className="input-icon-container">
          <img src={lockIcon} className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Introduzca su contraseña"
            className="input-with-icon"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <img
            src={showPassword ? eyeOpen : eyeClosed}
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        {error && <div className="login-error">{error}</div>}

        <button className="login-button" onClick={handleLogin}>
          Acceder al sistema
        </button>

        <label className="forgot-password">¿Olvidaste tu contraseña?</label>
      </div>

      <div className="footer">
        <label className="footer-text">
          © 2025 Hospital ICI. Todos los derechos reservados.
        </label>
      </div>
    </div>
  );
}
