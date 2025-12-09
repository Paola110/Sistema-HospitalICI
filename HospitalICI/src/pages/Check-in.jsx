import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderRecep from "../components/Header";
import CitasDeHoy from "../components/CitasDeHoy";
import { useUser } from "../context/UserContext";
import BackIcon from "../assets/back-arrow.svg";
import "./styles/Check-in.css";
import { API_URL } from "../config";

export default function CheckinPage() {
  const { nombre, puesto } = useUser();
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [citasDelDia, setCitasDelDia] = useState([]);

  // 1. Cargar Citas y filtrar
  useEffect(() => {
    fetch(`${API_URL}/citas`)
      .then(res => res.json())
      .then(data => {
        const hoyString = new Date().toDateString();

        const filtradas = data
          // FILTRO 1: Solo citas de HOY
          .filter(c => new Date(c.fecha_hora).toDateString() === hoyString)
          // FILTRO 2: Ocultar las que ya terminaron o se cancelaron
          .filter(c => c.estado !== 'Terminada' && c.estado !== 'Cancelada')
          .map(c => {
            const fechaObj = new Date(c.fecha_hora);

            // Normalizar estado (Primera mayúscula) para evitar errores de botón
            const estadoNormalizado = c.estado.charAt(0).toUpperCase() + c.estado.slice(1).toLowerCase();

            return {
              id: c.id,
              paciente: c.nombres_paciente
                ? `${c.nombres_paciente} ${c.apellidos_paciente}`
                : `Paciente #${c.id_paciente}`,
              doctor: c.nombres_medico
                ? `Dr. ${c.nombres_medico} ${c.apellidos_medico}`
                : `Dr. #${c.id_medico}`,

              hora: fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              fecha: fechaObj.toLocaleDateString(),
              tipo: c.motivo_consulta,

              estado: estadoNormalizado, // "Agendada", "En curso"

              original: c
            };
          });

        setCitasDelDia(filtradas);
      })
      .catch(console.error);
  }, []);

  const handleConfirmarCheckin = async (citaVisual) => {
    // REGLA: Verificar si el doctor ya tiene una cita "En curso"
    const doctorId = citaVisual.original.id_medico;

    // Buscar en la lista local de citas de hoy
    const citaEnCurso = citasDelDia.find(
      c => c.original.id_medico === doctorId && c.estado === 'En curso' && c.id !== citaVisual.id
    );

    if (citaEnCurso) {
      alert("⚠️ Este doctor ya tiene una consulta en curso. No se puede hacer Check-in hasta que finalice la anterior.");
      return;
    }

    try {
      const payload = {
        id: citaVisual.id,
        estado: 'en curso',
        fecha_hora: citaVisual.original.fecha_hora,
        motivo: citaVisual.original.motivo_consulta,
        id_medico: citaVisual.original.id_medico,
        id_paciente: citaVisual.original.id_paciente
      };

      const res = await fetch(`${API_URL}/citas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(`✅ Check-in exitoso. Paciente ${citaVisual.paciente} en sala.`);
        // Recargar o navegar
        navigate("/homerecep");
      } else {
        alert("❌ Error al realizar check-in");
      }

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="checkin-page">
      <div className="header-checkin">
        <button className="back-button" onClick={() => navigate("/homerecep")}>
          <img src={BackIcon} alt="volver" />
        </button>
        <h2 className="title">Check-in</h2>
      </div>

      <p className="subtitulo">Registra la llegada de pacientes HOY</p>

      <div className="contenido" style={{ display: 'block' }}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Escribe el nombre del paciente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: '100%', padding: '12px', fontSize: '16px',
              borderRadius: '8px', border: '1px solid #ccc'
            }}
          />
        </div>

        <CitasDeHoy
          citas={citasDelDia}
          pacienteNombre={busqueda}
          onConfirmarCheckin={handleConfirmarCheckin}
        />
      </div>
    </div>
  );
}