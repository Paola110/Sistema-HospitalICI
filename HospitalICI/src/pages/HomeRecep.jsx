import "./styles/HomeRecep.css";
import { useState, useEffect } from "react";

import { useUser } from "../context/UserContext";
import HeaderRecep from "../components/Header";
import MetricCard from "../components/MetricCard";
import AppointmentsTable from "../components/AppointmentsTable";
import QuickAction from "../components/QuickAction";
import CobrarConsulta from "../components/CobrarConsulta";

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

  // Estados dinámicos para la API
  const [listaCitasHoy, setListaCitasHoy] = useState([]);
  const [ingresosHoy, setIngresosHoy] = useState("0.00");
  const [citasHoyCount, setCitasHoyCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const today = new Date();
        const d = today.getDate().toString().padStart(2, '0');
        const m = (today.getMonth() + 1).toString().padStart(2, '0');
        const y = today.getFullYear();
        const todayStr = `${d}/${m}/${y}`; // "DD/MM/YYYY"

        // 1. Obtener Citas
        const respCitas = await fetch("http://localhost:3000/citas");
        if (respCitas.ok) {
          const dataCitas = await respCitas.json();

          // Mapear respuesta API -> Formato UI
          const citasMapeadas = dataCitas.map((cita) => {
            const fechaObj = new Date(cita.fecha_hora);

            // Fecha DD/MM/YYYY
            const _d = fechaObj.getDate().toString().padStart(2, '0');
            const _m = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
            const _y = fechaObj.getFullYear();
            const fechaStr = `${_d}/${_m}/${_y}`;

            // Hora 12h
            let horas = fechaObj.getHours();
            const minutos = fechaObj.getMinutes().toString().padStart(2, '0');
            const ampm = horas >= 12 ? 'PM' : 'AM';
            horas = horas % 12;
            horas = horas ? horas : 12;
            const horaStr = `${horas.toString().padStart(2, '0')}:${minutos} ${ampm}`;

            // Estado -> Clase CSS
            let claseEstado = "programada";
            const est = cita.estado ? cita.estado.toLowerCase() : "";

            if (est.includes("cancel")) claseEstado = "cancelada";
            else if (est.includes("terminada") || est.includes("final")) claseEstado = "finalizada";
            else if (est.includes("curso")) claseEstado = "consulta";
            else if (est.includes("check")) claseEstado = "checkin";
            else if (est.includes("pagada")) claseEstado = "pagada";
            else if (est.includes("no") && est.includes("asist")) claseEstado = "noasistio";

            return {
              id: cita.id,
              fecha: fechaStr,
              hora: horaStr,
              paciente: `${cita.nombres_paciente} ${cita.apellidos_paciente}`,
              doctor: `${cita.nombres_medico} ${cita.apellidos_medico}`,
              tipo: cita.motivo_consulta,
              estado: cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1),
              estadoClase: claseEstado,
              id_paciente: cita.id_paciente
            };
          });

          // Filtrar: Solo mostrar citas de HOY en el Home
          const citasDelDia = citasMapeadas.filter((c) => c.fecha === todayStr);

          setListaCitasHoy(citasDelDia);
          setCitasHoyCount(citasDelDia.length);
        }

        // 2. Obtener Ingresos
        const respIngresos = await fetch("http://localhost:3000/pagos/ingresos");
        if (respIngresos.ok) {
          const dataIngresos = await respIngresos.json();

          // Formato fecha API Ingresos: "DD Mon" (ej. "08 Dic")
          const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
          const todayDay = today.getDate().toString().padStart(2, '0');
          const todayMonth = meses[today.getMonth()];
          const fechaBusqueda = `${todayDay} ${todayMonth}`;

          const ingresoEncontrado = dataIngresos.find((i) => i.fecha === fechaBusqueda);
          const monto = ingresoEncontrado ? ingresoEncontrado.monto : 0;

          setIngresosHoy(monto.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }

      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

      {/* MÉTRICAS */}
      <div className="top-grid">
        <MetricCard
          titulo="Ingresos del día"
          valor={`$${ingresosHoy}`}
          icono={ingresos}
          color="green"
          to="/reportes-ingresos"
        />

        <MetricCard
          titulo="Citas del día"
          valor={loading ? "-" : citasHoyCount.toString()}
          icono={calendar}
          color="blue"
        />
      </div>

      {/* TABLA + ACCIONES */}
      <div className="main-grid">
        <div className="Titulo-tabla-recep">
          <h3>Citas de hoy</h3>
          {loading ? (
            <p>Cargando citas...</p>
          ) : listaCitasHoy.length > 0 ? (
            <AppointmentsTable
              data={listaCitasHoy}
              onRowClick={handleSeleccionCita}
              selectedId={selectedId}
            />
          ) : (
            <div style={{ padding: "20px", color: "gray", textAlign: "center" }}>
              No hay citas programadas para hoy ({new Date().toLocaleDateString()}).
            </div>
          )}
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
