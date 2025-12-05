import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import BuscadorPaciente from "../components/BuscadorPaciente";
import TarjetaPersona from "../components/TarjetaPersona";
import CitasDeHoy from "../components/CitasDeHoy";

import backIcon from "../assets/back-arrow.svg";

import { pacientesEjemplo } from "../data/pacientesEjemplo";
import listaDeCitas from "/src/data/citasEjemplo.js";
import { getPacienteCitasForCheckin } from "../utils/FormatoCheckin";
import "./styles/Check-in.css";

export default function CheckinPage() {
  const navigate = useNavigate();

  const pacienteInicial =
    pacientesEjemplo.find((p) => p.id === 1) || pacientesEjemplo[0] || null;

  const [pacienteSeleccionado, setPacienteSeleccionado] =
    useState(pacienteInicial);

  const nombreCompleto = `${pacienteSeleccionado.nombres} ${pacienteSeleccionado.apellidos}`;

  const citasDelPaciente = useMemo(() => {
    if (!pacienteSeleccionado) return [];
    const nombreCompleto = `${pacienteSeleccionado.nombres} ${pacienteSeleccionado.apellidos}`;
    return getPacienteCitasForCheckin(listaDeCitas, nombreCompleto);
  }, [pacienteSeleccionado]);

  const handleConfirmarCheckin = () => {
    if (!pacienteSeleccionado) {
      alert("Selecciona un paciente para realizar el check-in.");
      return;
    }

    const citaPrincipal = citasDelPaciente[0];
    if (!citaPrincipal) {
      alert("El paciente no tiene citas programadas hoy para hacer check-in.");
      return;
    }

    alert(`Check-in de ${pacienteSeleccionado.nombres} confirmado con éxito.`);
  };

  return (
    <div className="checkin-page">
      <div className="header-checkin">
        <button className="back-button" onClick={() => navigate("/homerecep")}>
          <img src={backIcon} alt="volver" />
        </button>

        <h2 className="title">Check-in</h2>
      </div>

      <p className="subtitulo">Registra la llegada del paciente a su cita</p>

      <BuscadorPaciente
        pacientes={pacientesEjemplo}
        onSelectPaciente={(p) => setPacienteSeleccionado(p)}
      />

      <div className="contenido">
        <TarjetaPersona paciente={pacienteSeleccionado} type="paciente" />

        <CitasDeHoy
          citas={citasDelPaciente}
          pacienteNombre={nombreCompleto}
          onConfirmarCheckin={handleConfirmarCheckin}
        />
      </div>
    </div>
  );
}
