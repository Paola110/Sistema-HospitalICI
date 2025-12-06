import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BuscadorPaciente from "../components/BuscadorPaciente";
import TarjetaPersona from "../components/TarjetaPersona";
import FormCita from "../components/FormCita";

import backIcon from "../assets/back-arrow.svg";

import { pacientesEjemplo } from "../data/pacientesEjemplo";
import "./styles/CrearCita.css";

export default function CrearCita() {
  const navigate = useNavigate();

  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const handleCrearCita = (datosCita) => {
    if (!pacienteSeleccionado) {
      alert("Selecciona un paciente primero");
      return;
    }

    console.log("Cita creada:", {
      paciente: pacienteSeleccionado,
      ...datosCita,
    });

    alert("Cita creada con éxito");
  };

  return (
    <div className="crear-cita-page">
      <div className="header-crearcita">
        <button className="back-button" onClick={() => navigate("/homerecep")}>
          <img src={backIcon} alt="volver" />
        </button>

        <h2 className="title">Crear Cita</h2>
      </div>

      <p className="subtitulo-cc">Agenda una nueva cita para el paciente</p>
      {/* BUSCADOR */}
      <BuscadorPaciente
        pacientes={pacientesEjemplo}
        onSelectPaciente={(p) => setPacienteSeleccionado(p)}
        onNuevoPaciente={() => alert("Registrar nuevo paciente")}
      />
      <div className="contenido">
        {/* TARJETA DEL PACIENTE (izquierda) */}
        <TarjetaPersona paciente={pacienteSeleccionado} type="paciente" />

        {/* FORMULARIO (derecha) */}
        <FormCita onCrear={handleCrearCita} />
      </div>
    </div>
  );
}
