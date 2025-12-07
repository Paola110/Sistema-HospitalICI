import "./styles/HomeRecep.css";
import { useState } from "react";

import { useUser } from "../context/UserContext";
import HeaderRecep from "../components/Header";
import MetricCard from "../components/MetricCard";
import AppointmentsTable from "../components/AppointmentsTable";
import QuickAction from "../components/QuickAction";
import CobrarConsulta from "../components/CobrarConsulta";

import listaDeCitas from "/src/data/citasEjemplo.js";

import ingresos from "../assets/ingresos.svg";
import calendar from "../assets/calendar.png";
import add from "../assets/user-add.svg";
import checkin from "../assets/checkin.svg";
import pay from "../assets/pay.png";
import historyIcon from "../assets/clock.svg";

export default function HomeRecep() {
  const { nombre, puesto } = useUser();
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [abrirModalPago, setAbrirModalPago] = useState(false);

  const handleSeleccionCita = (cita) => {
    setSelectedId(cita.id);
    setCitaSeleccionada(cita);
    setAbrirModalPago(false);
  };

  const handleProcesarPago = () => {
    if (!citaSeleccionada) {
      alert("Primero selecciona una cita de la tabla.");
      return;
    }
    setAbrirModalPago(true);
  };

  return (
    <div className="recep-container">
      <HeaderRecep nombre={nombre} puesto={puesto} />

      {/* MÉTRICAS */}
      <div className="top-grid">
        <MetricCard
          titulo="Ingresos del día"
          valor="$12,760.00"
          icono={ingresos}
          color="green"
          to="/reportes-ingresos"
        />

        <MetricCard
          titulo="Citas del día"
          valor="29"
          icono={calendar}
          color="blue"
        />
      </div>

      {/* TABLA + ACCIONES */}
      <div className="main-grid">
        <div className="Titulo-tabla-recep">
          <h3>Citas</h3>
          <AppointmentsTable
            data={listaDeCitas}
            onRowClick={handleSeleccionCita}
            selectedId={selectedId}
          />
        </div>

        <div className="acciones-box">
          <h3>Acciones rápidas</h3>

          <QuickAction
            titulo="Crear cita"
            descripcion="Agendar nueva consulta"
            icono={add}
            to="/crear-cita"
          />

          <QuickAction
            titulo="Check-in"
            descripcion="Registrar llegada de paciente"
            icono={checkin}
            to="/checkin"
          />

          <QuickAction
            titulo="Procesar pago"
            descripcion="Cobrar consulta"
            icono={pay}
            onClick={handleProcesarPago}
          />

          <QuickAction
            titulo="Historial de citas"
            descripcion="Buscar registros pasados"
            icono={historyIcon}
            to="/historial"
          />
        </div>
      </div>
      {abrirModalPago && citaSeleccionada && (
        <CobrarConsulta
          cita={citaSeleccionada}
          onClose={() => setAbrirModalPago(false)}
        />
      )}
    </div>
  );
}
