import React from "react";
import { compareCitasByDateTime } from "../utils/compareCitasByDateTime";
import "./components.css";

/**
 * Tabla para mostrar citas, ordenadas por fecha y hora.
 * @param {Array<object>} data
 */
export default function AppointmentsTable({ data, onRowClick, selectedId }) {
  const getEstadoClass = (estado) => {
    if (!estado) return "default";
    const est = estado.toLowerCase();
    
    if (est === 'agendada') return 'agendada';
    if (est === 'terminada') return 'terminada';
    if (est === 'en curso') return 'en-curso';
    if (est === 'cancelada') return 'cancelada';
    
    return 'default';
  };

  const citasOrdenadas = [...data].sort((a, b) => {
     return new Date(b.fecha_hora || b.fecha) - new Date(a.fecha_hora || a.fecha);
  });

  const isClickable = !!onRowClick;

  return (
    <div className="appt-table">
      <div className="tabla-scroll">
        <table className="custom-table">
          <thead>
            <tr>
              <th>FECHA</th>
              <th>HORA</th>
              <th>PACIENTE</th>
              <th>DOCTOR</th>
              <th>SERVICIO</th>
              <th>ESTADO</th>
            </tr>
          </thead>

          <tbody>
            {citasOrdenadas.map((cita) => {
              const claseColor = getEstadoClass(cita.estado);

              return (
                <tr
                  key={cita.id}
                  className={`table-row 
                    ${isClickable ? "clickable" : ""} 
                    ${selectedId === cita.id ? "selected-row" : ""}
                  `}
                  onClick={() => isClickable && onRowClick(cita)}
                >
                  <td>{cita.fecha}</td>
                  <td className="font-bold">{cita.hora}</td>
                  <td>{cita.paciente}</td>
                  <td>{cita.doctor}</td>
                  <td>{cita.tipo}</td>
                  <td>
                    <span className={`estado-badge ${claseColor}`}>
                      {cita.estado}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {citasOrdenadas.length === 0 && (
          <div className="empty-state">
            No se encontraron citas para hoy.
          </div>
        )}
      </div>
    </div>
  );
}