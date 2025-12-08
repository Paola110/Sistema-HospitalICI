
import { useState } from "react";
import "./styles/FormCita.css";

// Eliminamos la lógica de selección de médico de aquí
export default function FormCita({ onCrear }) {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const enviar = () => {
    // Validamos solo los campos de la cita
    if (!fecha || !hora || !motivo)
      return alert("Completa los campos obligatorios (Fecha, Hora y Motivo)");

    // Enviamos los datos al padre (CrearCita.jsx)
    // El padre se encargará de juntar esto con el médico y paciente seleccionados
    onCrear({
      fecha,
      hora,
      motivo,
    });
  };

  return (
    <div className="form-cita">
      <h3 className="titulo">Detalles de la cita</h3>

      <div className="fila">
        <div className="campo">
          <label>Fecha *</label>
          <input
            className="input-fc"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="campo">
          <label>Hora *</label>
          <input
            className="input-fc"
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />
        </div>
      </div>

      <label>Motivo de consulta *</label>
      <textarea
        className="textarea-fc"
        placeholder="Describe el motivo de la consulta..."
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />

      <button className="btn-crear" onClick={enviar}>
        Crear cita
      </button>
    </div>
  );
}