import React, { useState, useEffect, useMemo } from "react";
import "./styles/CitasDeHoy.css";

const TarjetaCita = ({ cita, isSelected, onClick }) => (
  <div
    className={`cita-card ${cita.estadoClase || ""} ${
      isSelected ? "selected" : ""
    }`}
    onClick={() => onClick(cita)}
  >
    <div className="cita-time-block">
      <span className="cita-time">{cita.hora}</span>
      <span className="cita-ampm">{cita.ampm}</span>
    </div>
    <div className="cita-details">
      <h4 className="cita-title">{cita.tipo ?? cita.servicio}</h4>
      <p className="cita-date">{cita.fecha}</p>
      <div className="cita-doctor-info">
        <span className="cita-doctor">{cita.doctor}</span>
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
  const getPacienteCitasForCheckin = () => {
    if (!Array.isArray(citas) || !pacienteNombre) {
      return [];
    }

    const today = new Date();
    const todayDate = today.toDateString();

    const meses = {
      ene: 0,
      feb: 1,
      mar: 2,
      abr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      ago: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dic: 11,
    };

    const filtradas = citas.filter((cita) => {
      const pacienteMatch =
        cita.id?.startsWith(pacienteNombre) || cita.paciente === pacienteNombre;
      const estadoMatch = cita.estado === "Programada";

      let fechaMatch = false;
      if (cita.fecha) {
        const fechaParts = cita.fecha.split(" ");
        if (fechaParts.length === 3) {
          const dia = parseInt(fechaParts[0], 10);
          const mes = meses[fechaParts[1].toLowerCase()];
          const anio = parseInt(fechaParts[2], 10);
          const citaDate = new Date(anio, mes, dia);

          fechaMatch =
            citaDate.getDate() === today.getDate() &&
            citaDate.getMonth() === today.getMonth() &&
            citaDate.getFullYear() === today.getFullYear();
        }
      }

      return pacienteMatch && estadoMatch && fechaMatch;
    });

    return filtradas;
  };

  const citasFiltradas = getPacienteCitasForCheckin();

  const citasOrdenadas = useMemo(() => {
    const ordenadas = [...citasFiltradas].sort((a, b) => {
      const parseHora = (c) => {
        const [hours, minutes] = c.hora.split(":").map(Number);
        let h = hours;
        if (c.ampm === "PM" && hours < 12) h += 12;
        if (c.ampm === "AM" && hours === 12) h = 0;

        const [dia, mes, anio] = c.fecha.split(" ");
        const meses = {
          ene: 0,
          feb: 1,
          mar: 2,
          abr: 3,
          may: 4,
          jun: 5,
          jul: 6,
          ago: 7,
          sep: 8,
          oct: 9,
          nov: 10,
          dic: 11,
        };
        const month = meses[mes.toLowerCase()];
        return new Date(anio, month, dia, h, minutes);
      };

      const dateA = parseHora(a);
      const dateB = parseHora(b);
      return dateA - dateB;
    });

    return ordenadas;
  }, [citasFiltradas]);

  const [selectedCitaId, setSelectedCitaId] = useState(
    citasOrdenadas.length > 0 ? citasOrdenadas[0].id : null
  );

  useEffect(() => {
    if (citasOrdenadas.length === 0) return;
    if (
      !selectedCitaId ||
      !citasOrdenadas.some((c) => c.id === selectedCitaId)
    ) {
      setSelectedCitaId(citasOrdenadas[0].id);
    }
  }, [citasOrdenadas, selectedCitaId]);

  const citaPrincipal =
    citasOrdenadas.find((c) => c.id === selectedCitaId) || null;
  const otrasCitas = citasOrdenadas.filter((c) => c.id !== selectedCitaId);

  const handleSelectCita = (cita) => {
    setSelectedCitaId(cita.id);
  };

  const handleConfirmCheckin = () => {
    if (citaPrincipal && citaPrincipal.estado === "Programada") {
      onConfirmarCheckin(citaPrincipal);
    }
  };

  if (!citasOrdenadas.length) {
    return (
      <div className="citas-de-hoy-module">
        <h3>Citas de hoy</h3>
        <p className="no-citas">
          No hay citas programadas para este paciente hoy.
        </p>
      </div>
    );
  }

  const buttonText =
    citaPrincipal?.estado === "Check-in"
      ? "Check-in ya realizado"
      : "Confirmar check-in";

  const isButtonDisabled =
    !citaPrincipal || citaPrincipal.estado !== "Programada";

  return (
    <div className="citas-de-hoy-module">
      <h3 className="module-title">Citas de hoy</h3>
      {citaPrincipal && (
        <TarjetaCita
          cita={citaPrincipal}
          isSelected
          onClick={handleSelectCita}
        />
      )}
      {otrasCitas.length > 0 && (
        <div className="otras-citas-container">
          <details className="otras-citas-details" open>
            <summary className="otras-citas-summary">
              Otras citas programadas
              <span className="cita-count">{otrasCitas.length}</span>
            </summary>
            <div className="otras-citas-list scrollable-list">
              {otrasCitas.map((cita) => (
                <TarjetaCita
                  key={cita.id}
                  cita={cita}
                  onClick={handleSelectCita}
                />
              ))}
            </div>
          </details>
        </div>
      )}
      <button
        className="confirmar-checkin-btn"
        onClick={handleConfirmCheckin}
        disabled={isButtonDisabled}
      >
        <span className="icon-check">✓</span> {buttonText}
      </button>
    </div>
  );
}
