import React, { useState, useEffect, useMemo } from "react";
import "./styles/CitasDeHoy.css";

const TarjetaCita = ({ cita, isSelected, onClick }) => (
  <div
    className={`cita-card ${isSelected ? "selected" : ""}`}
    onClick={() => onClick(cita.id)} // Pasamos el ID directamente
    style={{ 
        cursor: 'pointer',
        borderLeft: `5px solid ${cita.estado === 'Agendada' ? '#3b82f6' : '#10b981'}` 
    }}
  >
    <div className="cita-time-block">
      <span className="cita-time">{cita.hora}</span>
    </div>
    <div className="cita-details">
      <h4 className="cita-title">{cita.paciente}</h4>
      <p className="cita-date">{cita.tipo}</p>
      <div className="cita-doctor-info">
        <span className="cita-doctor">{cita.doctor}</span>
      </div>
    </div>
    <span className="cita-status" style={{ fontWeight: 'bold', color: '#555' }}>
        {cita.estado}
    </span>
  </div>
);

export default function CitasDeHoy({
  citas = [],
  pacienteNombre = "",
  onConfirmarCheckin,
}) {
  
  // Filtrar citas según búsqueda
  const citasFiltradas = useMemo(() => {
    if (!pacienteNombre) return citas; 
    return citas.filter((c) => 
        c.paciente.toLowerCase().includes(pacienteNombre.toLowerCase())
    );
  }, [citas, pacienteNombre]);

  const [selectedCitaId, setSelectedCitaId] = useState(null);

  // Seleccionar la primera automáticamente si cambia la lista o no hay selección
  useEffect(() => {
    if (citasFiltradas.length > 0) {
        // Si la seleccionada ya no existe en la lista filtrada, reseteamos a la primera
        const sigueExistiendo = citasFiltradas.find(c => c.id === selectedCitaId);
        if (!selectedCitaId || !sigueExistiendo) {
            setSelectedCitaId(citasFiltradas[0].id);
        }
    } else {
        setSelectedCitaId(null);
    }
  }, [citasFiltradas]);

  const citaPrincipal = citasFiltradas.find((c) => c.id === selectedCitaId);
  const otrasCitas = citasFiltradas.filter((c) => c.id !== selectedCitaId);

  // El botón se activa SOLO si el estado es "Agendada"
  const puedeHacerCheckin = citaPrincipal && citaPrincipal.estado === "Agendada";

  return (
    <div className="citas-de-hoy-module">
      <h3 className="module-title">Resultados ({citasFiltradas.length})</h3>
      
      {citasFiltradas.length === 0 ? (
          <p className="no-citas">No se encontraron citas para hoy con ese criterio.</p>
      ) : (
          <>
            {/* Cita Principal (Seleccionada) */}
            {citaPrincipal && (
                <TarjetaCita
                    cita={citaPrincipal}
                    isSelected={true}
                    onClick={() => {}} // Ya está seleccionada
                />
            )}

            {/* Lista de otras citas */}
            {otrasCitas.length > 0 && (
                <div className="otras-citas-list scrollable-list" style={{ marginTop: '10px' }}>
                    <p style={{fontSize: '0.9em', color: '#666'}}>Otras coincidencias:</p>
                    {otrasCitas.map((cita) => (
                        <TarjetaCita
                            key={cita.id}
                            cita={cita}
                            isSelected={false}
                            onClick={(id) => setSelectedCitaId(id)}
                        />
                    ))}
                </div>
            )}

            <button
                className="confirmar-checkin-btn"
                onClick={() => onConfirmarCheckin(citaPrincipal)}
                disabled={!puedeHacerCheckin}
                style={{ 
                    marginTop: '20px',
                    opacity: puedeHacerCheckin ? 1 : 0.6, 
                    cursor: puedeHacerCheckin ? 'pointer' : 'not-allowed',
                    backgroundColor: puedeHacerCheckin ? '#3b82f6' : '#6b7280'
                }}
            >
                <span className="icon-check">✓</span> 
                {/* Texto dinámico según estado */}
                {citaPrincipal?.estado === 'En curso' ? 'Paciente ya en sala (Check-in listo)' : 'Confirmar llegada (Check-in)'}
            </button>
          </>
      )}
    </div>
  );
}