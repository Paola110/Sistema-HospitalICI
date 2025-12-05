import "./styles/HomeMed.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../context/UserContext";
import HeaderRecep from "../components/Header";
import MetricCard from "../components/MetricCard";
import AppointmentsTable from "../components/AppointmentsTable";
import QuickAction from "../components/QuickAction";

import listaDeCitas from "../data/citasEjemplo.js";

import calendar from "../assets/calendar.png";
import doctor from "../assets/doctor.svg";
import historial from "../assets/clock.svg";

export default function HomeMed() {
  const { nombre, puesto } = useUser();
  const navigate = useNavigate();

  const listaMedico = listaDeCitas.filter((cita) => cita.doctor === nombre);

  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  useEffect(() => {
    const guardada = localStorage.getItem("citaSeleccionadaMedico");
    if (guardada) {
      setCitaSeleccionada(JSON.parse(guardada));
    }
  }, []);

  const handleRowClick = (cita) => {
    setCitaSeleccionada(cita);
    localStorage.setItem("citaSeleccionadaMedico", JSON.stringify(cita));
  };

  const iniciarConsulta = () => {
    if (citaSeleccionada) {
      navigate(`/consulta/${citaSeleccionada.id}`);
    }
  };

  return (
    <div className="med-container">
      <HeaderRecep nombre={nombre} puesto={puesto} />

      <div className="main-content-area">
        {/* TABLA */}
        <div className="Titulo-tabla-Med">
          <h3>Próximas citas</h3>

          <AppointmentsTable
            data={listaMedico}
            onRowClick={handleRowClick}
            selectedId={citaSeleccionada?.id}
          />
        </div>

        {/* MÉTRICAS + ACCIONES */}
        <div className="side-grid">
          <MetricCard
            titulo="Citas del día"
            valor="29"
            icono={calendar}
            color="blue"
          />

          <div className="acciones-box-med">
            <h3>Acciones rápidas</h3>

            <QuickAction
              titulo="Iniciar consulta"
              descripcion="Comenzar atención"
              icono={doctor}
              disabled={!citaSeleccionada}
              onClick={iniciarConsulta}
            />

            <QuickAction
              titulo="Historial de citas"
              descripcion="Buscar citas pasadas"
              icono={historial}
              to="/historial"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
