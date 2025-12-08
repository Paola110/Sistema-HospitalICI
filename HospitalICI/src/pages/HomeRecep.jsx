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

export default function HomeRecep() {
  const { nombre, puesto } = useUser();
  const [citasHoy, setCitasHoy] = useState([]);
  const [ingresosHoy, setIngresosHoy] = useState(0);
  
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [abrirModalPago, setAbrirModalPago] = useState(false);

  // ==========================================
  // CONEXIÓN AL BACKEND
  // ==========================================
  useEffect(() => {
    // 1. Obtener Citas y filtrar SOLO LAS DE HOY
    fetch("http://localhost:3000/citas")
      .then((res) => res.json())
      .then((data) => {
        const hoyString = new Date().toDateString(); // Ej: "Sun Dec 07 2025"
        
        const citasDelDia = data
          .filter((c) => {
            // Convertimos la fecha de la cita (UTC/ISO) a objeto Date
            const fechaCita = new Date(c.fecha_hora);
            // Comparamos solo la parte de la fecha (ignorando hora)
            return fechaCita.toDateString() === hoyString;
          })
          // Filtramos las terminadas para que no estorben (Opcional, si quieres verlas quita esta línea)
          .filter((c) => c.estado !== 'Terminada') 
          .map((c) => {
            const fechaObj = new Date(c.fecha_hora);
            return {
              id: c.id,
              // Si tienes JOIN en backend usa c.nombre_paciente, si no, usa ID
              paciente: `Paciente #${c.id_paciente}`, 
              doctor: `Dr. #${c.id_medico}`,
              // El backend manda 'motivo_consulta', el componente espera 'tipo'
              tipo: c.motivo_consulta, 
              fecha: fechaObj.toLocaleDateString(),
              hora: fechaObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              estado: c.estado,
              // Guardamos datos crudos por si se necesitan (ej. para cobrar)
              id_paciente: c.id_paciente,
              id_medico: c.id_medico
            };
          });

        setCitasHoy(citasDelDia);
      })
      .catch((err) => console.error("Error cargando citas:", err));

    // 2. Obtener Ingresos de HOY
    fetch("http://localhost:3000/pagos/ingresos")
      .then((res) => res.json())
      .then((data) => {
        // Truco para coincidir con el formato del backend "DD Mes" (ej: "08 Dic")
        const hoy = new Date();
        const dia = hoy.getDate().toString().padStart(2, '0');
        const mes = hoy.toLocaleString('es-MX', { month: 'short' });
        // Capitalizar primera letra: 'dic' -> 'Dic'
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
    setAbrirModalPago(true);
  };

  return (
    <div className="recep-container">
      <HeaderRecep nombre={nombre} puesto={puesto} />

      {/* MÉTRICAS REALES */}
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

      {/* TABLA + ACCIONES */}
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
            <div style={{padding: '20px', textAlign: 'center', color: '#666', background: 'white', borderRadius: '8px'}}>
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