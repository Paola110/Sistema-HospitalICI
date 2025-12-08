import React from "react";
import "../pages/styles/DetalleMedico.css";

export default function HistorialCitasDoctor({ citas }) {
  if (!citas || citas.length === 0) {
    return (
      <div style={{ padding: "16px", color: "#6b7280", textAlign: "center" }}>
        No hay citas registradas para este doctor en la Base de Datos.
      </div>
    );
  }

  const citasOrdenadas = [...citas].sort((a, b) => {
    return new Date(b.fecha_hora) - new Date(a.fecha_hora);
  });

  const getBadgeClass = (estado) => {
    const est = (estado || "").toLowerCase();
    if (est === "terminada" || est === "asistió") return "finalizada";
    if (est === "cancelada") return "cancelada"; 
    if (est === "en curso") return "en-curso";   
    return "programada";
  };

  return (
    <div className="historial-table">
      <table>
        <thead>
          <tr>
            <th>FECHA</th>
            <th>PACIENTE</th>
            <th>MOTIVO DE CONSULTA</th>
            <th>ESTADO</th>
          </tr>
        </thead>

        <tbody>
          {citasOrdenadas.map((c) => (
            <tr key={c.id || Math.random()}>
              <td>
                {new Date(c.fecha_hora).toLocaleDateString("es-MX")}{" "}
                <small style={{ color: "#888" }}>
                  {new Date(c.fecha_hora).toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </td>
              
              <td>Paciente #{c.id_paciente}</td>
              
              <td>{c.motivo_consulta}</td>
              
              <td>
                <span className={`badge badge-${getBadgeClass(c.estado)}`}>
                  {c.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}