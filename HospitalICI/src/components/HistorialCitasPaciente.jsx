import React from "react";
import "../pages/styles/DetalleExpediente.css";

export default function HistorialCitasPaciente({ pacienteNombre, citas }) {
  const filtradas = citas
    .filter(
      (c) => (c.paciente || "").toLowerCase() === pacienteNombre.toLowerCase()
    )
    .sort((a, b) => {
      const parse = (d) => {
        const [day, month, year] = d.split("/").map(Number);
        return new Date(year, month - 1, day).getTime();
      };
      return parse(b.fecha) - parse(a.fecha);
    });

  if (filtradas.length === 0) {
    return (
      <div style={{ padding: "16px", color: "#6b7280" }}>
        No hay citas registradas.
      </div>
    );
  }

  return (
    <div className="historial-table">
      <table>
        <thead>
          <tr>
            <th>FECHA</th>
            <th>HORA</th>
            <th>DOCTOR</th>
            <th>MOTIVO</th>
            <th>ESTADO</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map((c) => (
            <tr key={c.id}>
              <td>{c.fecha}</td>
              <td>{c.hora}</td>
              <td>{c.doctor}</td>
              <td>{c.tipo}</td>
              <td>
                <span className={`badge badge-${c.estadoClase}`}>
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
