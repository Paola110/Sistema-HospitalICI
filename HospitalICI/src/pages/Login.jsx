
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "./styles/Login.css";
import { API_URL } from "../config";

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
  const { loginUser } = useUser();

  const handleLogin = async () => {
    if (!correo || !password) {
      setError("Por favor complete todos los campos.");
      return;
    }

    // Limpiar errores previos
    setError("");

    try {
      // Petición a la API
      // Petición a la API
      const response = await fetch(`${API_URL}/medicos/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: correo,
          password: password,
        }),
      });

      const data = await response.json();

      console.log("DATOS RECIBIDOS DEL LOGIN:", data);
      console.log("ROL DETECTADO:", data.user?.rol);

      if (!response.ok) {
        // Manejar errores de la API (ej. credenciales inválidas)
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Si el login es exitoso
      if (data.user) {
        // Guardar datos en el contexto
        loginUser(data.user);

        // Redirección basada en el rol recibido de la API
        const userRol = data.user.rol; // 'doctor', 'admin', etc.

        if (userRol === "doctor") {
          navigate("/homemed");
        } else if (userRol === "recepcionista") {
          navigate("/homerecep");
        } else if (userRol === "administrativo" || userRol === "administrador") {
          navigate("/homeadmin");
        } else {
          // Fallback o rol desconocido
          setError("Rol de usuario no reconocido por el sistema.");
        }
      } else {
        setError("Respuesta del servidor incompleta.");
      }

    } catch (err) {
      console.error("Login error:", err);
      // Mantener lógica de fallback para demos si la API falla, O mostrar el error real
      // Para este caso, mostraremos el error de la API o de conexión
      setError(err.message || "Usuario o contraseña incorrectos.");

      // NOTA: Si quieres mantener el login "hardcoded" como respaldo cuando la API está apagada,
      // puedes ponerlo aquí dentro del catch. Por ahora lo quito para forzar el uso de la API.
    }
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
