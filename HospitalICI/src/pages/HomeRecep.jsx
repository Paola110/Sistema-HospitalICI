import "./styles/HomeRecep.css";
import { useState, useEffect } from "react";

import { useUser } from "../context/UserContext";
import HeaderRecep from "../components/Header";
import MetricCard from "../components/MetricCard";
import AppointmentsTable from "../components/AppointmentsTable";
import QuickAction from "../components/QuickAction";
import CobrarConsulta from "../components/CobrarConsulta";

import ingresosIcon from "../assets/ingresos.svg";
import calendarIcon from "../assets/calendar.png";
import addIcon from "../assets/user-add.svg";
import checkinIcon from "../assets/checkin.svg";
import payIcon from "../assets/pay.png";
import historyIcon from "../assets/clock.svg";

import { API_URL } from "../config";

export default function HomeRecep() {
  const { nombre, puesto } = useUser();

  const [citasHoy, setCitasHoy] = useState([]);
  const [ingresosHoy, setIngresosHoy] = useState(0);

  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [abrirModalPago, setAbrirModalPago] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/citas`)
      .then((res) => res.json())
      .then((data) => {
        const hoyString = new Date().toDateString();

        const citasDelDia = data
          .filter((c) => {
            const fechaCita = new Date(c.fecha_hora);
            return fechaCita.toDateString() === hoyString;
          })
          // Eliminamos el filtro de 'Terminada' para ver TODAS las del día
          .map((c) => {
            const fechaObj = new Date(c.fecha_hora);
            return {
              id: c.id,
              // Usar nombres reales si vienen del backend
              paciente: c.nombres_paciente
                ? `${c.nombres_paciente} ${c.apellidos_paciente}`
                : `Paciente #${c.id_paciente}`,
              doctor: c.nombres_medico
                ? `Dr. ${c.nombres_medico} ${c.apellidos_medico}`
                : `Dr. #${c.id_medico}`,
              tipo: c.motivo_consulta,
              fecha: fechaObj.toLocaleDateString(),
              hora: fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              estado: c.estado,
              id_paciente: c.id_paciente,
              id_medico: c.id_medico
            };
          });

        setCitasHoy(citasDelDia);
      })
      .catch((err) => console.error("Error cargando citas:", err));

    fetch("http://localhost:3000/pagos/ingresos")
      .then((res) => res.json())
      .then((data) => {
        const hoy = new Date();
        const dia = hoy.getDate().toString().padStart(2, '0');
        const mes = hoy.toLocaleString('es-MX', { month: 'short' });
        const mesCap = mes.charAt(0).toUpperCase() + mes.slice(1);
        const fechaBusqueda = `${dia} ${mesCap}`;

        const ingreso = data.find(d => d.fecha === fechaBusqueda);
        setIngresosHoy(ingreso ? ingreso.monto : 0);
      })
      .catch(console.error);

  }, []);

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

    // VALIDACIÓN: Solo cobrar si está Terminada
    if (citaSeleccionada.estado !== 'Terminada') {
      alert("Solo se pueden cobrar citas que han sido terminadas (atendidas por el médico).");
      return;
    }

    setAbrirModalPago(true);
  };

  return (
    <div className="recep-container">
      <HeaderRecep nombre={nombre} puesto={puesto} />

      <div className="top-grid">
        <MetricCard
          titulo="Ingresos del día"
          valor={`$${ingresosHoy.toLocaleString("en-US")}.00`}
          icono={ingresosIcon}
          color="green"
          to="/reportes-ingresos"
        />

        <MetricCard
          titulo="Citas pendientes hoy"
          valor={citasHoy.length}
          icono={calendarIcon}
          color="blue"
        />
      </div>

      <div className="main-grid">
        <div className="Titulo-tabla-recep">
          <h3>Citas de Hoy</h3>
          {citasHoy.length > 0 ? (
            <AppointmentsTable
              data={citasHoy}
              onRowClick={handleSeleccionCita}
              selectedId={selectedId}
            />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666', background: 'white', borderRadius: '8px' }}>
              No hay citas pendientes para hoy.
            </div>
          )}
        </div>

        <div className="acciones-box">
          <h3>Acciones rápidas</h3>

          <QuickAction
            titulo="Crear cita"
            descripcion="Agendar nueva consulta"
            icono={addIcon}
            to="/crear-cita"
          />

          <QuickAction
            titulo="Check-in"
            descripcion="Registrar llegada de paciente"
            icono={checkinIcon}
            to="/checkin"
          />

          <QuickAction
            titulo="Procesar pago"
            descripcion="Cobrar consulta"
            icono={payIcon}
            onClick={handleProcesarPago}
          />

          <QuickAction
            titulo="Historial de citas"
            descripcion="Buscar registros pasados"
            icono={historyIcon}
            to="/historial-recep"
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