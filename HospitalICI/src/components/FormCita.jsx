import { useState } from "react";
import "./styles/FormCita.css";

// AHORA RECIBE LA LISTA DE MÉDICOS
export default function FormCita({ onCrear, medicos = [] }) {
  const [idMedico, setIdMedico] = useState(""); // Guardamos el ID, no el nombre
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const enviar = () => {
    // Validamos que haya seleccionado un médico real
    if (!idMedico || !fecha || !hora)
      return alert("Completa los campos obligatorios (Médico, Fecha, Hora)");

    // Enviamos los datos al padre (CrearCita.jsx)
    onCrear({
      id_medico: idMedico, // Enviamos el ID para la base de datos
      fecha,
      hora,
      motivo,
    });
  };

  return (
    <div className="form-cita">
      <h3 className="titulo">Detalles de la cita</h3>

      <label>Médico / Especialidad</label>
      <select 
        value={idMedico} 
        onChange={(e) => setIdMedico(e.target.value)}
        className="select-medico" // Asegura que se vea bien si tienes estilos para selects
      >
        <option value="">Seleccionar médico...</option>
        
        {/* Generamos las opciones con datos reales */}
        {medicos.map((m) => (
          <option key={m.id} value={m.id}>
            {/* Mostramos "Dr. Juan Pérez - Cardiología" */}
            {m.nombreCorto || `${m.nombres} ${m.apellidos}`} - {m.especialidad}
          </option>
        ))}
      </select>

      <div className="fila">
        <div className="campo">
          <label>Fecha</label>
          <input
            className="input-fc"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Hora</label>
          <input
            className="input-fc"
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </div>
      </div>

      <label>Motivo de consulta (opcional)</label>
      <textarea
        className="textarea-fc"
        placeholder="Describe brevemente el motivo..."
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />

      <button className="btn-crear" onClick={enviar}>
        Crear cita
      </button>
    </div>
  );
}