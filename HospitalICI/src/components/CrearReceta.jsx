import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { API_URL } from "../config";
import "./styles/Modal.css";
import "./styles/RegistrarPaciente.css";

export default function CrearReceta({ paciente, cita, onClose }) {
  const { userId } = useUser(); // Obtener ID del médico autenticado

  const [medicamentos, setMedicamentos] = useState([
    { nombre: "", dosis: "", frecuencia: "", duracion: "" },
  ]);
  const [instruccionesExtra, setInstruccionesExtra] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // 1. Formatear Medicamentos para la BD (String)
    const medsString = medicamentos
      .filter((m) => m.nombre.trim() !== "") // Ignorar vacíos
      .map((m) => `${m.nombre} (${m.dosis})`)
      .join("\n");

    // 2. Formatear Indicaciones para la BD (String)
    const indicacionesMeds = medicamentos
      .filter((m) => m.nombre.trim() !== "")
      .map((m) => `${m.nombre}: ${m.frecuencia} por ${m.duracion}`)
      .join("\n");

    // Unir indicaciones de medicamentos + instrucciones extra
    const indicacionesFinal = `${indicacionesMeds}\n\nNota Adicional: ${instruccionesExtra}`.trim();

    if (!medsString) {
      setError("Agrega al menos un medicamento.");
      setLoading(false);
      return;
    }

    const payload = {
      medicamentos: medsString,
      indicaciones: indicacionesFinal,
      id_paciente: paciente.id,  // Asegurarse de que paciente venga con ID real
      id_medico: userId
    };

    try {
      const response = await fetch(`${API_URL}/recetas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Error al guardar la receta.");
      }

      alert("Receta guardada exitosamente");
      onClose(); // Cerrar modal

    } catch (err) {
      console.error("Error al crear receta:", err);
      setError("Fallo al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
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
              {paciente.nombres?.[0] || "?"}
              {paciente.apellidos?.[0] || "?"}
            </div>
            <div>
              <div className="paciente-label">Paciente</div>
              <div className="paciente-nombre">
                {paciente.nombres || "Nombre"} {paciente.apellidos || ""}
              </div>
            </div>
          </div>

          <div className="modal-body">
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
                  placeholder="Dosis (500mg)"
                  value={m.dosis}
                  onChange={(e) => actualizarCampo(i, "dosis", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Frecuencia (8hrs)"
                  value={m.frecuencia}
                  onChange={(e) =>
                    actualizarCampo(i, "frecuencia", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Duración (3 días)"
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
            <textarea
              placeholder="Instrucciones extra..."
              value={instruccionesExtra}
              onChange={(e) => setInstruccionesExtra(e.target.value)}
            ></textarea>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </div>
        </div>

        {/* BOTONES */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar Receta"}
          </button>
        </div>
      </div>
    </div>
  );
}
