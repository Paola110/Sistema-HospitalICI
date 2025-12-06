import React from "react";
import "../pages/styles/DetalleMedico.css";

export default function TarjetaFormacion({ doctor, editing, setDoctor }) {
  const handleFormacionChange = (index, field, value) => {
    const newFormacion = [...doctor.formacion];
    newFormacion[index][field] = value;
    setDoctor({ ...doctor, formacion: newFormacion });
  };

  const handleCertificacionesChange = (value) => {
    setDoctor({
      ...doctor,
      certificaciones: value.split(",").map((s) => s.trim()),
    });
  };

  return (
    <div className="card formacion-card">
      <div className="card-header-icon">
        <h3>Formación Profesional</h3>
      </div>

      {/* Educación / Formación */}
      <div className="formacion-section">
        <h4>Educación</h4>
        {doctor.formacion
          .filter((f) => f.tipo === "Educación" || f.tipo === "Especialidad")
          .map((item, index) => (
            <div key={index} className="formacion-item">
              {editing ? (
                <input
                  value={item.detalle}
                  onChange={(e) =>
                    handleFormacionChange(index, "detalle", e.target.value)
                  }
                  className="formacion-input"
                />
              ) : (
                <p className="item-detail">• {item.detalle}</p>
              )}
            </div>
          ))}
      </div>

      {/* Certificaciones */}
      <div className="certificaciones-section">
        <h4>Certificaciones</h4>
        {editing ? (
          <input
            value={doctor.certificaciones.join(", ")}
            onChange={(e) => handleCertificacionesChange(e.target.value)}
            placeholder="Separar por comas: Certificación 1, Certificación 2"
            className="cert-input"
          />
        ) : (
          <div className="cert-tags-container">
            {doctor.certificaciones.map((cert, index) => (
              <span key={index} className="cert-tag">
                {cert}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
