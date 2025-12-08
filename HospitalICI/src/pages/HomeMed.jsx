import "./styles/HomeMed.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../context/UserContext";
import HeaderMed from "../components/Header";
import MetricCard from "../components/MetricCard";
import AppointmentsTable from "../components/AppointmentsTable";
import QuickAction from "../components/QuickAction";

import calendar from "../assets/calendar.png";
import doctor from "../assets/doctor.svg";
import historial from "../assets/clock.svg";

export default function HomeMed() {
  const { nombre, puesto, userId } = useUser();
  const navigate = useNavigate();

  const [listaMedico, setListaMedico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchCitas = async () => {
      // Si no tenemos ID de usuario, no podemos cargar sus citas
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch a la API: /citas/:id (donde id es el id del medico)
        const response = await fetch(`http://localhost:3000/citas/${userId}`);

        if (!response.ok) {
          // Manejo especial si devuelve 404 (sin citas) o error real
          if (response.status === 404) {
            setListaMedico([]);
            return;
          }
          throw new Error("Error al consultar las citas.");
        }

        const data = await response.json();

        const today = new Date();
        const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

        // Mapear los datos que vienen de la BD a lo que espera el Frontend
        const citasMapeadas = data.map((cita) => {
          const fechaObj = new Date(cita.fecha_hora);

          // Formato fecha: DD/MM/YYYY
          const dia = fechaObj.getDate().toString().padStart(2, '0');
          const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
          const anio = fechaObj.getFullYear();
          const fechaStr = `${dia}/${mes}/${anio}`;

          // Formato hora: HH:MM AM/PM
          let horas = fechaObj.getHours();
          const minutos = fechaObj.getMinutes().toString().padStart(2, '0');
          const ampm = horas >= 12 ? 'PM' : 'AM';
          horas = horas % 12;
          horas = horas ? horas : 12;
          const horaStr = `${horas.toString().padStart(2, '0')}:${minutos} ${ampm}`;

          // Clase CSS segun estado ('agendada', 'en curso', 'terminada', 'cancelada')
          let claseEstado = "programada";
          const estadoLower = cita.estado ? cita.estado.toLowerCase() : "";

          if (estadoLower === "cancelada") claseEstado = "cancelada";
          else if (estadoLower === "terminada") claseEstado = "finalizada";
          else if (estadoLower === "en curso") claseEstado = "consulta";
          else if (estadoLower === "agendada") claseEstado = "programada";
          else {
            // Fallback para otros estados si llegaran a existir
            if (estadoLower.includes("cancel")) claseEstado = "cancelada";
            else if (estadoLower.includes("final")) claseEstado = "finalizada";
            else if (estadoLower.includes("curso")) claseEstado = "consulta";
          }

          return {
            id: cita.id,
            fecha: fechaStr,
            hora: horaStr,
            paciente: `${cita.nombres_paciente} ${cita.apellidos_paciente}`,
            doctor: nombre,
            tipo: cita.motivo_consulta,
            estado: cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1),
            estadoClase: claseEstado,
            id_paciente: cita.id_paciente,
            fecha_hora_raw: cita.fecha_hora
          };
        });

        // Filtrar solo las citas de hoy
        const citasDeHoy = citasMapeadas.filter(c => c.fecha === todayStr);

        setListaMedico(citasDeHoy);

      } catch (err) {
        console.error("Error cargando citas:", err);
        setError("Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchCitas();
  }, [userId, nombre]);

  useEffect(() => {
    const guardada = localStorage.getItem("citaSeleccionadaMedico");
    if (guardada) {
      try {
        setCitaSeleccionada(JSON.parse(guardada));
      } catch (e) {
        localStorage.removeItem("citaSeleccionadaMedico");
      }
    }
  }, []);

  const handleRowClick = (cita) => {
    setCitaSeleccionada(cita);
    localStorage.setItem("citaSeleccionadaMedico", JSON.stringify(cita));
  };

  const iniciarConsulta = () => {
    if (citaSeleccionada) {
      if (citaSeleccionada.estado === 'Terminada') {
        alert("Esta cita ya fue finalizada.");
        return;
      }
      if (citaSeleccionada.estado !== 'En curso') {
        alert("Solo puedes iniciar consultas que estén 'En curso' (Check-in realizado).");
        return;
      }
      navigate(`/consulta/${citaSeleccionada.id}`);
    }
  };

  // Calcular citas de hoy
  const citasHoyCount = listaMedico.filter((c) => {
    const today = new Date();
    // c.fecha viene como "DD/MM/YYYY"
    return c.fecha === `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  }).length;

  return (
    <div className="med-container">
      <HeaderMed nombre={nombre} puesto={puesto} />

      <div className="main-content-area">
        {/* TABLA */}
        <div className="Titulo-tabla-Med">
          <h3>Próximas citas</h3>

          {loading && <p>Cargando citas...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!loading && !error && (
            <AppointmentsTable
              data={listaMedico}
              onRowClick={handleRowClick}
              selectedId={citaSeleccionada?.id}
            />
          )}
        </div>

        {/* MÉTRICAS + ACCIONES */}
        <div className="side-grid">
          <MetricCard
            titulo="Citas del día"
            valor={loading ? "-" : citasHoyCount.toString()}
            icono={calendar}
            color="blue"
          />

          <div className="acciones-box-med">
            <h3>Acciones rápidas</h3>

            <QuickAction
              titulo="Iniciar consulta"
              descripcion="Comenzar atención"
              icono={doctor}
              disabled={!citaSeleccionada || citaSeleccionada.estado !== 'En curso'}
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
