import { useState } from "react";
import "./styles/Modal.css";

export default function ReservarQuirofano({ medico, paciente, onClose }) {
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    duracion: "",
    quirofano: "",
    notas: "",
  });

  const actualizar = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* ENCABEZADO */}
        <div className="modal-header-red">
          <h2 className="title">Reservar Quirófano</h2>
          <span className="subtitle">Procedimiento quirúrgico</span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          {/* TARJETAS MÉDICO + PACIENTE */}
          <div
            className="receta-card"
            style={{
              justifyContent: "space-between",
              paddingRight: "15px",
            }}
          >
            {/* MEDICO */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div className="avatar">{medico[0]}</div>
              <div>
                <div className="paciente-label">Médico</div>
                <div className="paciente-nombre">{medico}</div>
              </div>
            </div>

            {/* PACIENTE */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div className="avatar">
                {paciente.nombres[0]}
                {paciente.apellidos[0]}
              </div>
              <div>
                <div className="paciente-label">Paciente</div>
                <div className="paciente-nombre">
                  {paciente.nombres} {paciente.apellidos}
                </div>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="modal-body">
            <label>Fecha</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => actualizar("fecha", e.target.value)}
            />

            <label>Hora</label>
            <input
              type="time"
              value={form.hora}
              onChange={(e) => actualizar("hora", e.target.value)}
            />

            <label>Duración estimada</label>
            <input
              type="text"
              placeholder="Ej. 2 horas"
              value={form.duracion}
              onChange={(e) => actualizar("duracion", e.target.value)}
            />

            <label>Seleccionar quirófano</label>
            <select
              value={form.quirofano}
              onChange={(e) => actualizar("quirofano", e.target.value)}
            >
              <option value="">Seleccione...</option>
              <option>Quirófano 1</option>
              <option>Quirófano 2</option>
              <option>Quirófano 3</option>
              <option>Quirófano 4</option>
            </select>

            <label>Notas adicionales</label>
            <textarea
              placeholder="Instrucciones especiales, equipo requerido..."
              value={form.notas}
              onChange={(e) => actualizar("notas", e.target.value)}
            />
          </div>
        </div>

        {/* BOTONES */}
        <div className="qf-buttons">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary">Confirmar Reserva</button>
        </div>
      </div>
    </div>
  );
}
