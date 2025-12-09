
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import "./styles/Modal.css";
import { API_URL } from "../config";

export default function ReservarQuirofano({ medico, paciente, onClose }) {
  const { userId } = useUser();
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    quirofano: "",
    tipo_cirugia: "",
    notas: "",
  });

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar reservas existentes para ver disponibilidad
  useEffect(() => {
    fetch(`${API_URL}/quirofano`)
      .then((res) => res.json())
      .then((data) => setReservas(data))
      .catch((err) => console.error("Error cargando reservas:", err));
  }, []);

  const actualizar = (campo, valor) => {
    setForm({ ...form, [campo]: valor });
  };

  const handleReservar = async () => {
    setLoading(true);
    setError(null);

    if (!form.fecha || !form.hora || !form.quirofano || !form.tipo_cirugia) {
      setError("Por favor completa los campos obligatorios.");
      setLoading(false);
      return;
    }

    const payload = {
      id_medico: userId,
      id_paciente: paciente.id,
      sala: form.quirofano,
      tipo_cirugia: form.tipo_cirugia,
      fecha_hora: `${form.fecha} ${form.hora}:00`
    };

    try {
      const response = await fetch("http://localhost:3000/quirofano", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Error al reservar quirófano.");
      }

      alert("Reserva creada exitosamente");
      onClose();

    } catch (err) {
      console.error("Error reserving:", err);
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: '800px' }}>
        {/* ENCABEZADO */}
        <div className="modal-header-red">
          <h2 className="title">Reservar Quirófano</h2>
          <span className="subtitle">Procedimiento quirúrgico</span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content" style={{ display: 'flex', gap: '20px' }}>

          {/* FORMULARIO IZQUIERDA */}
          <div style={{ flex: 1 }}>
            <div
              className="receta-card"
              style={{
                justifyContent: "space-between",
                paddingRight: "15px",
                marginBottom: "20px"
              }}
            >
              {/* MEDICO */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="avatar" style={{ width: '30px', height: '30px', fontSize: '0.8em' }}>Dr</div>
                <div>
                  <div className="paciente-label">Médico</div>
                  <div className="paciente-nombre" style={{ fontSize: '0.9em' }}>{medico}</div>
                </div>
              </div>

              {/* PACIENTE */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="avatar" style={{ width: '30px', height: '30px', fontSize: '0.8em' }}>
                  {paciente.nombres?.[0]}
                </div>
                <div>
                  <div className="paciente-label">Paciente</div>
                  <div className="paciente-nombre" style={{ fontSize: '0.9em' }}>
                    {paciente.nombres} {paciente.apellidos}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-body-form">
              <label>Tipo de Cirugía *</label>
              <input
                type="text"
                placeholder="Ej. Apendicectomía"
                value={form.tipo_cirugia}
                onChange={(e) => actualizar("tipo_cirugia", e.target.value)}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label>Fecha *</label>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={(e) => actualizar("fecha", e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Hora *</label>
                  <input
                    type="time"
                    value={form.hora}
                    onChange={(e) => actualizar("hora", e.target.value)}
                  />
                </div>
              </div>

              <label>Seleccionar quirófano *</label>
              <select
                value={form.quirofano}
                onChange={(e) => actualizar("quirofano", e.target.value)}
              >
                <option value="">Seleccione...</option>
                <option value="Quirófano 1 - Planta Baja">Quirófano 1 - Planta Baja</option>
                <option value="Quirófano 2 - Planta Alta">Quirófano 2 - Planta Alta</option>
                <option value="Quirófano 3 - Urgencias">Quirófano 3 - Urgencias</option>
              </select>

              <label>Notas adicionales</label>
              <textarea
                placeholder="Instrucciones especiales..."
                value={form.notas}
                onChange={(e) => actualizar("notas", e.target.value)}
              />

              {error && <p style={{ color: 'red', fontSize: '0.9em' }}>{error}</p>}
            </div>
          </div>

          {/* LISTA DERECHA */}
          <div style={{ flex: 1, borderLeft: '1px solid #eee', paddingLeft: '20px' }}>
            <h4 style={{ marginBottom: '15px', color: '#555' }}>Reservas Actuales</h4>
            <div className="reservas-lista" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {reservas.length === 0 ? (
                <p style={{ color: '#999', fontSize: '0.9em' }}>No hay reservas registradas.</p>
              ) : (
                reservas.map(r => (
                  <div key={r.id} style={{
                    background: '#f9f9f9', padding: '10px', borderRadius: '6px', marginBottom: '10px',
                    borderLeft: '4px solid #e74c3c'
                  }}>
                    <strong style={{ display: 'block', fontSize: '0.9em' }}>{r.sala}</strong>
                    <span style={{ fontSize: '0.85em', color: '#666' }}>
                      {new Date(r.fecha_hora).toLocaleDateString()} - {new Date(r.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div style={{ fontSize: '0.8em', color: '#333', marginTop: '4px' }}>
                      {r.tipo_cirugia}
                    </div>
                    <div style={{ fontSize: '0.75em', color: '#999', marginTop: '2px' }}>
                      Dr. {r.medico_nombres} {r.medico_apellidos}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* BOTONES */}
        <div className="qf-buttons">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleReservar} disabled={loading}>
            {loading ? "Confirmando..." : "Confirmar Reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}
