import React, { useState } from "react";
import "./styles/RegistrarPaciente.css";
import { API_URL } from "../config";

export default function RegistrarPaciente({ onClose, onSave }) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    sexo: "",
    telefono: "",
    email: "",
    direccion: "",
    contactoEmergencia: "",
    telefonoEmergencia: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!form.nombres || !form.apellidos || !form.telefono) {
      setError("Nombres, apellidos y teléfono son obligatorios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/pacientes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Error al registrar paciente");
      }

      const data = await response.json();
      // Llamar a onSave con los datos retornados por la API
      onSave(data);
    } catch (err) {
      console.error("Error creating patient:", err);
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* HEADER */}
        <div className="modal-header">
          <h2 className="title">Registrar Paciente</h2>
          <span className="subtitle">Nuevo registro clínico</span>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          {/* Tarjeta Paciente */}
          <div className="paciente-card">
            <div className="avatar">
              {form.nombres ? form.nombres[0] + form.apellidos[0] : "?"}
            </div>
            <div>
              <div className="paciente-label">Nuevo paciente</div>
              <div className="paciente-nombre">
                {form.nombres || "Nombre(s)"} {form.apellidos || ""}
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="form-section">
            <label>Nombre(s)</label>
            <input
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              placeholder="Ej. María Fernanda"
            />

            <label>Apellidos</label>
            <input
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              placeholder="Ej. López Ramírez"
            />

            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
            />

            <label>Sexo</label>
            <select name="sexo" value={form.sexo} onChange={handleChange}>
              <option value="">Seleccione una opción</option>
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
              <option value="O">Otro</option>
            </select>

            <div className="divider"></div>

            <label>Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Ej. 449 123 4567"
            />

            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
            />

            <label>Dirección completa</label>
            <textarea
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Calle, número, colonia, ciudad, estado"
            ></textarea>

            <div className="divider"></div>

            <label>Contacto de emergencia</label>
            <input
              name="contactoEmergencia"
              value={form.contactoEmergencia}
              onChange={handleChange}
              placeholder="Nombre completo"
            />

            <label>Teléfono del contacto de emergencia</label>
            <input
              name="telefonoEmergencia"
              value={form.telefonoEmergencia}
              onChange={handleChange}
              placeholder="Ej. 449 987 6543"
            />
          </div>
        </div>

        {error && <div style={{ color: "red", padding: "10px 20px" }}>{error}</div>}

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-guardar" onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Registrar paciente"}
          </button>
        </div>
      </div>
    </div>
  );
}
