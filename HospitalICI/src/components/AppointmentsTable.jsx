import React from "react";
import { compareCitasByDateTime } from "../utils/compareCitasByDateTime";
import "./components.css";

/**
 * Tabla para mostrar citas, ordenadas por fecha y hora.
 * @param {Array<object>} data
 */
export default function AppointmentsTable({ data, onRowClick, selectedId }) {
  const citasOrdenadas = [...data].sort(compareCitasByDateTime);
  const isClickable = !!onRowClick;

  return (
    <div className="appt-table">
      <div className="tabla-scroll">
        <table>
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
            {citasOrdenadas.map((cita) => (
              <tr
                key={cita.id}
                className={`table-row
    ${isClickable ? "cursor-pointer hover:bg-gray-100" : ""}
    ${selectedId === cita.id ? "selected-row" : ""}
  `}
                onClick={() => isClickable && onRowClick(cita)}
                style={{ cursor: isClickable ? "pointer" : "default" }}
              >
                <td>{cita.fecha}</td>
                <td>{cita.hora}</td>
                <td>{cita.paciente}</td>
                <td>{cita.doctor}</td>
                <td>{cita.tipo}</td>
                <td>
                  <span className={`estado ${cita.estadoClase}`}>
                    {cita.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {citasOrdenadas.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}
          >
            No se encontraron citas que coincidan con los filtros.
          </div>
        )}
      </div>
    </div>
  );
}
