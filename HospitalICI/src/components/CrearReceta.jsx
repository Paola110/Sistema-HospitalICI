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
      <div className="modal-content" style={{ maxWidth: '800px' }}> {/* Un poco más ancho para medicamentos */}
        {/* ENCABEZADO */}
        <div className="modal-header">
          <div>
            <h2 className="title">Crear Receta</h2>
            <span style={{ fontSize: '0.9em', color: '#666' }}>Nuevo registro clínico para {paciente.nombres} {paciente.apellidos}</span>
          </div>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="form-registro">

          {/* LISTA DE MEDICAMENTOS */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>Medicamentos</label>

            {medicamentos.map((m, i) => (
              <div className="med-item" key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Nombre Medicamento"
                  value={m.nombre}
                  onChange={(e) => actualizarCampo(i, "nombre", e.target.value)}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                  type="text"
                  placeholder="Dosis"
                  value={m.dosis}
                  onChange={(e) => actualizarCampo(i, "dosis", e.target.value)}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                  type="text"
                  placeholder="Frecuencia"
                  value={m.frecuencia}
                  onChange={(e) => actualizarCampo(i, "frecuencia", e.target.value)}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <input
                  type="text"
                  placeholder="Duración"
                  value={m.duracion}
                  onChange={(e) => actualizarCampo(i, "duracion", e.target.value)}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={agregarMedicamento}
              style={{ background: '#e0f2fe', color: '#0284c7', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9em' }}
            >
              + Agregar otro medicamento
            </button>
          </div>

          {/* INSTRUCCIONES */}
          <div className="form-group">
            <label>Instrucciones adicionales (opcional)</label>
            <textarea
              placeholder="Instrucciones extra para el paciente..."
              value={instruccionesExtra}
              onChange={(e) => setInstruccionesExtra(e.target.value)}
              rows={4}
            ></textarea>
          </div>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

          <button className="save-button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar Receta"}
          </button>
        </div>
      </div>
    </div>
  );
}
