import { useState } from "react";
import "./styles/FormCita.css";

export default function FormCita({ onCrear }) {
  const [doctor, setDoctor] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");

  const enviar = () => {
    if (!doctor || !fecha || !hora)
      return alert("Completa los campos obligatorios");

    onCrear({
      doctor,
      fecha,
      hora,
      motivo,
    });
  };

  return (
    <div className="form-cita">
      <h3 className="titulo">Detalles de la cita</h3>

      <label>Médico / Especialidad</label>
      <select value={doctor} onChange={(e) => setDoctor(e.target.value)}>
        <option value="">Seleccionar médico...</option>
        <option>Dr. Miguel García - Cardiología</option>
        <option>Dra. Sofía Ruiz - Ginecología</option>
        <option>Dr. Juan Pérez - General</option>
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
