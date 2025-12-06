import React from "react";
import "../pages/styles/DetalleMedico.css";

export default function TarjetaEstadisticas({ doctor }) {
  if (!doctor || !doctor.stats) return null;

  const {
    pacientesAtendidos,
    satisfaccion,
    ingresosGenerados,
    calificacionPromedio,
  } = doctor.stats;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="card stats-card">
      <div className="card-header-icon">
        <h3>Estadísticas Mensuales</h3>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{pacientesAtendidos}</div>
          <div className="stat-label">Pacientes Atendidos</div>
        </div>

        <div className="stat-item">
          <div className="stat-value">{satisfaccion}%</div>
          <div className="stat-label">Satisfacción</div>
        </div>

        <div className="stat-item">
          <div className="stat-value">{formatCurrency(ingresosGenerados)}</div>
          <div className="stat-label">Ingresos Generados</div>
        </div>

        <div className="stat-item">
          <div className="stat-value">{calificacionPromedio}</div>
          <div className="stat-label">Calificación Promedio</div>
        </div>
      </div>
    </div>
  );
}
