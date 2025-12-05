import "./styles/HomeRecep.css";

import { useUser } from "../context/UserContext";
import HeaderRecep from "../components/Header";
import MetricCard from "../components/MetricCard";
import AppointmentsTable from "../components/AppointmentsTable";
import QuickAction from "../components/QuickAction";

import listaDeCitas from "/src/data/citasEjemplo.js";

import ingresos from "../assets/ingresos.svg";
import calendar from "../assets/calendar.png";
import add from "../assets/user-add.svg";
import checkin from "../assets/checkin.svg";
import pay from "../assets/pay.png";
import historyIcon from "../assets/informes.png";

export default function HomeRecep() {
  const { nombre, puesto } = useUser();

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
          <h3>Próximas citas</h3>
          <AppointmentsTable data={listaDeCitas} />
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
            to="/pago"
          />

          <QuickAction
            titulo="Historial de citas"
            descripcion="Buscar registros pasados"
            icono={historyIcon}
            to="/historial"
          />
        </div>
      </div>
    </div>
  );
}
