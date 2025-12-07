import { useState } from "react";
import servicios from "/src/data/serviciosEjemplo.js";
import "./styles/Modal.css";
import "./styles/RegistrarPaciente.css";

export default function CobrarConsulta({ cita, onClose }) {
  if (!cita) return null;

  const servicioKey = Object.keys(servicios).find(
    (s) => servicios[s].nombre.toLowerCase() === cita.tipo.toLowerCase()
  );

  const servicio = servicioKey ? servicios[servicioKey] : null;

  const [efectivo, setEfectivo] = useState("");
  const precio = servicio?.precio ?? 0;

  const cambio = efectivo ? Math.max(0, efectivo - precio) : 0;

  const imprimirRecibo = () => {
    console.log("Se imprimió el ticket");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* ENCABEZADO */}
        <div className="modal-header-green">
          <h2 className="title">Cobrar consulta</h2>
          <span className="subtitle">Procesar pago del servicio</span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          {/* MEDICO Y PACIENTE */}
          <div
            className="receta-card"
            style={{
              justifyContent: "space-between",
              paddingRight: "15px",
            }}
          >
            {/* MÉDICO */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div className="avatar">{cita.doctor[0]}</div>
              <div>
                <div className="paciente-label">Médico</div>
                <div className="paciente-nombre">{cita.doctor}</div>
              </div>
            </div>

            {/* PACIENTE */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div className="avatar">{cita.paciente[0]}</div>
              <div>
                <div className="paciente-label">Paciente</div>
                <div className="paciente-nombre">{cita.paciente}</div>
              </div>
            </div>
          </div>

          <div className="modal-body">
            {/* SERVICIO A PAGAR */}
            <div className="modal-section">
              <h3 className="section-title">Servicio</h3>

              {servicio ? (
                <div className="servicio-item">
                  <div>
                    <div className="servicio-nombre">{servicio.nombre}</div>
                    <div className="servicio-cat">{servicio.categoria}</div>
                  </div>

                  <div className="servicio-precio">
                    ${precio.toLocaleString("es-MX")}
                  </div>
                </div>
              ) : (
                <div className="servicio-item">
                  <div className="servicio-nombre">Servicio no encontrado</div>
                </div>
              )}
            </div>

            {/* PAGO */}
            <div className="modal-section">
              <h3 className="section-title">Pago en efectivo</h3>

              <label className="input-label">Cantidad recibida</label>
              <input
                type="number"
                className="input"
                placeholder="Ej. 500"
                value={efectivo}
                onChange={(e) => setEfectivo(Number(e.target.value))}
              />

              <div className="cambio-box">
                <span>Debe regresar:</span>
                <strong>${cambio.toLocaleString("es-MX")}</strong>
              </div>
            </div>
          </div>

          {/* BOTONES */}
          <div className="receta-buttons">
            <button className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>

            <button
              className="btn-primary"
              disabled={!efectivo || efectivo < precio}
              onClick={imprimirRecibo}
            >
              Imprimir recibo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
