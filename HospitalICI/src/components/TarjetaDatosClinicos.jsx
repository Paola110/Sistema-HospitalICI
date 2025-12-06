import React, { useEffect } from "react";
import "../pages/styles/DetalleExpediente.css";

export default function TarjetaDatosClinicos({
  paciente,
  editing,
  setPaciente,
  calcularIMC,
}) {
  if (!paciente) return null;

  useEffect(() => {
    const imc = calcularIMC(paciente.altura, paciente.peso);
    if (imc !== paciente.imc) {
      setPaciente({ ...paciente, imc });
    }
  }, [paciente.altura, paciente.peso]);

  const updateField = (field, value) => {
    setPaciente({ ...paciente, [field]: value });
  };

  return (
    <div className="card datos-clinicos-card">
      <div className="datos-grid">
        <div className="metric-alt">
          <div className="metric-label">ALTURA</div>
          <div className="metric-value">{paciente.altura} cm</div>
          {editing && (
            <input
              type="number"
              value={paciente.altura}
              onChange={(e) => updateField("altura", e.target.value)}
            />
          )}
        </div>

        <div className="metric-pes">
          <div className="metric-label">PESO</div>
          <div className="metric-value">{paciente.peso} kg</div>
          {editing && (
            <input
              type="number"
              value={paciente.peso}
              onChange={(e) => updateField("peso", e.target.value)}
            />
          )}
        </div>

        <div className="metric-imc">
          <div className="metric-label">IMC</div>
          <div className="metric-value">{paciente.imc}</div>
        </div>
      </div>

      <div className="clinicos-grid">
        <div>
          <label>Alergias conocidas</label>
          {editing ? (
            <input
              value={paciente.alergias}
              onChange={(e) => updateField("alergias", e.target.value)}
            />
          ) : (
            <div className="muted">{paciente.alergias}</div>
          )}
        </div>

        <div>
          <label>Cirugías previas</label>
          {editing ? (
            <input
              value={paciente.cirugiasPrevias}
              onChange={(e) => updateField("cirugiasPrevias", e.target.value)}
            />
          ) : (
            <div className="muted">{paciente.cirugiasPrevias}</div>
          )}
        </div>

        <div>
          <label>Enfermedades crónicas</label>
          {editing ? (
            <input
              value={paciente.enfermedadesCronicas}
              onChange={(e) =>
                updateField("enfermedadesCronicas", e.target.value)
              }
            />
          ) : (
            <div className="muted">{paciente.enfermedadesCronicas}</div>
          )}
        </div>

        <div>
          <label>Antecedentes familiares</label>
          {editing ? (
            <input
              value={(paciente.antecedentesFamiliares || []).join("; ")}
              onChange={(e) =>
                updateField(
                  "antecedentesFamiliares",
                  e.target.value.split(";").map((s) => s.trim())
                )
              }
            />
          ) : (
            <div className="muted">
              {(paciente.antecedentesFamiliares || []).map((a, i) => (
                <div key={i}>{a}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
