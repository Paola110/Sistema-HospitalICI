import { useState } from "react";
import "./styles/Modal.css";

import React from "react";
import "./styles/RegistrarPaciente.css";

export default function CrearReceta({ paciente, onClose, onSave }) {
  const [medicamentos, setMedicamentos] = useState([
    { nombre: "", dosis: "", frecuencia: "", duracion: "" },
  ]);

  const agregarMedicamento = () => {
    setMedicamentos([
      ...medicamentos,
      { nombre: "", dosis: "", frecuencia: "", duracion: "" },
    ]);
  };

  const actualizarCampo = (i, campo, valor) => {
    const copia = [...medicamentos];
    copia[i][campo] = valor;
    setMedicamentos(copia);
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* ENCABEZADO */}
        <div className="modal-header-blue">
          <h2 className="title">Crear Receta</h2>
          <span className="subtitle">Nuevo registro clínico</span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="receta-card">
            <div className="avatar">
              {paciente.nombres[0]}
              {paciente.apellidos[0]}
            </div>
            <div>
              <div className="paciente-label">Paciente</div>
              <div className="paciente-nombre">
                {paciente.nombres || "Nombre(s)"} {paciente.apellidos || ""}
              </div>
            </div>
          </div>

          <div className="modal-body">
            {/* DIAGNOSTICO */}
            <label>Diagnóstico</label>
            <input type="text" placeholder="Ingrese diagnóstico..." />

            {/* MEDICAMENTOS */}
            <label>Medicamentos</label>

            {medicamentos.map((m, i) => (
              <div className="med-item" key={i}>
                <input
                  type="text"
                  placeholder="Nom. Medicamento"
                  value={m.nombre}
                  onChange={(e) => actualizarCampo(i, "nombre", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Dosis"
                  value={m.dosis}
                  onChange={(e) => actualizarCampo(i, "dosis", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Frecuencia"
                  value={m.frecuencia}
                  onChange={(e) =>
                    actualizarCampo(i, "frecuencia", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Duración"
                  value={m.duracion}
                  onChange={(e) =>
                    actualizarCampo(i, "duracion", e.target.value)
                  }
                />
              </div>
            ))}

            <button className="btn-add" onClick={agregarMedicamento}>
              + Agregar medicamento
            </button>

            {/* INSTRUCCIONES */}
            <label>Instrucciones adicionales (opcional)</label>
            <textarea placeholder="Instrucciones extra..."></textarea>
          </div>
        </div>

        {/* BOTONES */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary">Imprimir Receta</button>
        </div>
      </div>
    </div>
  );
}
