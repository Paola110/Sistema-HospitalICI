import React from "react";
import "../pages/styles/DetalleMedico.css";

export default function HistorialCitasDoctor({ doctorNombre, citas }) {
  const filtradas = citas
    .filter(
      (c) => (c.doctor || "").toLowerCase() === doctorNombre.toLowerCase()
    )
    .sort((a, b) => {
      const parse = (d) => {
        const [day, month, year] = d.split("/").map(Number);
        return new Date(2025, month - 1, day).getTime();
      };
      return parse(b.fecha) - parse(a.fecha);
    });

  const citasMock = [
    {
      fecha: "28/11/2025",
      paciente: "Luis Morena",
      motivo: "Control Diabetes",
      estado: "Asistió",
      estadoClase: "finalizada",
    },
    {
      fecha: "15/11/2025",
      paciente: "Ana Torres",
      motivo: "Revisión Cardiovascular",
      estado: "Pendiente",
      estadoClase: "programada",
    },
    {
      fecha: "03/11/2025",
      paciente: "José Pérez",
      motivo: "Consulta Rutinaria",
      estado: "Consulta Rutinaria",
      estadoClase: "finalizada",
    },
    {
      fecha: "28/11/2025",
      paciente: "Luis Morena",
      motivo: "Control Diabetes",
      estado: "Asistió",
      estadoClase: "finalizada",
    },
    {
      fecha: "15/11/2025",
      paciente: "Ana Torres",
      motivo: "Revisión Cardiovascular",
      estado: "Pendiente",
      estadoClase: "programada",
    },
    {
      fecha: "03/11/2025",
      paciente: "José Pérez",
      motivo: "Consulta Rutinaria",
      estado: "Consulta Rutinaria",
      estadoClase: "finalizada",
    },
    {
      fecha: "28/11/2025",
      paciente: "Luis Morena",
      motivo: "Control Diabetes",
      estado: "Asistió",
      estadoClase: "finalizada",
    },
    {
      fecha: "15/11/2025",
      paciente: "Ana Torres",
      motivo: "Revisión Cardiovascular",
      estado: "Pendiente",
      estadoClase: "programada",
    },
    {
      fecha: "03/11/2025",
      paciente: "José Pérez",
      motivo: "Consulta Rutinaria",
      estado: "Consulta Rutinaria",
      estadoClase: "finalizada",
    },
    {
      fecha: "28/11/2025",
      paciente: "Luis Morena",
      motivo: "Control Diabetes",
      estado: "Asistió",
      estadoClase: "finalizada",
    },
    {
      fecha: "15/11/2025",
      paciente: "Ana Torres",
      motivo: "Revisión Cardiovascular",
      estado: "Pendiente",
      estadoClase: "programada",
    },
    {
      fecha: "03/11/2025",
      paciente: "José Pérez",
      motivo: "Consulta Rutinaria",
      estado: "Consulta Rutinaria",
      estadoClase: "finalizada",
    },
  ];

  const citasAMostrar = filtradas.length > 0 ? filtradas : citasMock;

  if (citasAMostrar.length === 0) {
    return (
      <div style={{ padding: "16px", color: "#6b7280" }}>
        No hay citas registradas para este doctor.
      </div>
    );
  }

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
          {citasAMostrar.map((c, index) => (
            <tr key={index}>
              <td>{c.fecha}</td>
              <td>{c.paciente}</td>
              <td>{c.motivo}</td>
              <td>
                <span
                  className={`badge badge-${c.estadoClase || "finalizada"}`}
                >
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
