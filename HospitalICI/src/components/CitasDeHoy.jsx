import React, { useState, useEffect, useMemo } from "react";
import "./styles/CitasDeHoy.css";

// Componente simple para la tarjeta
const TarjetaCita = ({ cita, isSelected, onClick }) => (
  <div
    className={`cita-card ${cita.estado === 'Terminada' ? 'finalizada' : ''} ${
      isSelected ? "selected" : ""
    }`}
    onClick={() => onClick(cita)}
  >
    <div className="cita-time-block">
      {/* Asumimos que cita.hora ya viene formateada (HH:MM AM/PM) */}
      <span className="cita-time">{cita.hora}</span>
    </div>
    <div className="cita-details">
      <h4 className="cita-title">{cita.tipo || cita.motivo_consulta}</h4>
      <p className="cita-date">{new Date(cita.fecha_hora || Date.now()).toLocaleDateString()}</p>
      <div className="cita-doctor-info">
        {/* Mostramos ID si no hay nombre, para evitar errores */}
        <span className="cita-doctor">
            {cita.doctor || `Dr. ID: ${cita.id_medico}`}
        </span>
      </div>
    </div>
    <span className="cita-status">{cita.estado}</span>
  </div>
);

export default function CitasDeHoy({
  citas = [],
  pacienteNombre = "",
  onConfirmarCheckin = () => {},
}) {
  
  // 1. Filtrar citas para el Check-in (Solo las de "Agendada")
  const citasFiltradas = useMemo(() => {
    if (!Array.isArray(citas)) return [];

    return citas.filter((c) => {
        // Filtro por nombre (o ID simulado)
        // Nota: En un sistema real buscaríamos por ID de paciente, no por string
        const pacienteCoincide = c.paciente && c.paciente.toLowerCase().includes(pacienteNombre.toLowerCase());
        
        // Filtro por estado
        const esProgramada = c.estado === "Agendada"; 
        
        return pacienteCoincide && esProgramada;
    });
  }, [citas, pacienteNombre]);

  // 2. Estado para la selección
  const [selectedCitaId, setSelectedCitaId] = useState(null);

  useEffect(() => {
    if (citasFiltradas.length > 0) {
      setSelectedCitaId(citasFiltradas[0].id);
    } else {
        setSelectedCitaId(null);
    }
  }, [citasFiltradas]);

  const citaPrincipal = citasFiltradas.find((c) => c.id === selectedCitaId);
  const otrasCitas = citasFiltradas.filter((c) => c.id !== selectedCitaId);

  const handleConfirmCheckin = () => {
    if (citaPrincipal) {
      onConfirmarCheckin(citaPrincipal);
    }
  };

  if (citasFiltradas.length === 0) {
    return (
      <div className="citas-de-hoy-module">
        <h3>Citas de hoy</h3>
        <p className="no-citas">
          No se encontraron citas agendadas para "{pacienteNombre}".
        </p>
      </div>
    );
  }

  return (
    <div className="citas-de-hoy-module">
      <h3 className="module-title">Citas de hoy</h3>
      
      {/* Cita Principal Seleccionada */}
      {citaPrincipal && (
        <TarjetaCita
          cita={citaPrincipal}
          isSelected
          onClick={() => {}}
        />
      )}

      {/* Lista colapsable de otras citas */}
      {otrasCitas.length > 0 && (
        <div className="otras-citas-container">
          <details className="otras-citas-details">
            <summary className="otras-citas-summary">
              Otras citas ({otrasCitas.length})
            </summary>
            <div className="otras-citas-list scrollable-list">
              {otrasCitas.map((cita) => (
                <TarjetaCita
                  key={cita.id}
                  cita={cita}
                  onClick={setSelectedCitaId}
                />
              ))}
            </div>
          </details>
        </div>
      )}

      <button
        className="confirmar-checkin-btn"
        onClick={handleConfirmCheckin}
        disabled={!citaPrincipal || citaPrincipal.estado !== "Agendada"}
        style={{ opacity: (!citaPrincipal || citaPrincipal.estado !== "Agendada") ? 0.5 : 1, cursor: 'pointer' }}
      >
        <span className="icon-check">✓</span> Confirmar llegada (Check-in)
      </button>
    </div>
  );
}