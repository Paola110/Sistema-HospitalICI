import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BuscadorPaciente from "../components/BuscadorPaciente";
import SelectorMedico from "../components/SelectorMedico";
import TarjetaPersona from "../components/TarjetaPersona";
import FormCita from "../components/FormCita";

import backIcon from "../assets/back-arrow.svg";
import "./styles/CrearCita.css";

export default function CrearCita() {
  const navigate = useNavigate();

  // Estados para datos reales
  const [pacientesReales, setPacientesReales] = useState([]);
  const [medicosReales, setMedicosReales] = useState([]);

  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState(null);

  // 1. CARGAR DATOS DEL BACKEND AL INICIAR
  useEffect(() => {
    // Cargar Pacientes
    fetch("http://localhost:3000/pacientes")
      .then((res) => res.json())
      .then((data) => setPacientesReales(data))
      .catch((err) => console.error("Error cargando pacientes:", err));

    // Cargar Médicos
    fetch("http://localhost:3000/medicos")
      .then((res) => res.json())
      .then((data) => setMedicosReales(data))
      .catch((err) => console.error("Error cargando médicos:", err));
  }, []);

  // 2. FUNCIÓN PARA GUARDAR EN BD
  const handleCrearCita = async (datosCita) => {
    // Validación de Paciente
    if (!pacienteSeleccionado) {
      alert("Selecciona un paciente primero en el buscador.");
      return;
    }

    // Validación de Médico
    if (!medicoSeleccionado) {
      alert("Selecciona un médico de la lista.");
      return;
    }

    // Validación de Datos del Formulario
    if (!datosCita.fecha || !datosCita.hora) {
      alert("Faltan datos: Fecha, Hora o Motivo.");
      return;
    }

    // Preparar JSON para el Backend
    const fechaHora = `${datosCita.fecha} ${datosCita.hora}:00`;

    const payload = {
      fecha_hora: fechaHora,
      motivo: datosCita.motivo || "Consulta General",
      id_medico: Number(medicoSeleccionado.id),
      id_paciente: Number(pacienteSeleccionado.id),
      estado: "Agendada"
    };

    console.log("Enviando cita:", payload);

    try {
      const res = await fetch("http://localhost:3000/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        alert("Cita creada con éxito (ID: " + data.id + ")");
        navigate("/homerecep");
      } else {
        const err = await res.json();
        alert("Error del servidor: " + (err.error || "No se pudo agendar"));
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
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

      <BuscadorPaciente
        pacientes={pacientesReales}
        onSelectPaciente={(p) => setPacienteSeleccionado(p)}
        onNuevoPaciente={() => alert("Función registrar paciente rápido pendiente")}
      />

      <div className="contenido" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>

        {/* COLUMNA 1: PACIENTE */}
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ marginBottom: '10px', color: '#555' }}>1. Paciente Seleccionado</h4>
          <TarjetaPersona paciente={pacienteSeleccionado} type="paciente" />
        </div>

        {/* COLUMNA 2: MÉDICO */}
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ marginBottom: '10px', color: '#555' }}>2. Seleccionar Médico</h4>
          <SelectorMedico
            medicos={medicosReales}
            onSelect={setMedicoSeleccionado}
            selectedId={medicoSeleccionado?.id}
          />
        </div>

        {/* COLUMNA 3: FORMULARIO */}
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ marginBottom: '10px', color: '#555' }}>3. Detalles de Cita</h4>
          <FormCita onCrear={handleCrearCita} />
        </div>

      </div>
    </div>
  );
}