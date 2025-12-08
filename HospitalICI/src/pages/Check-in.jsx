import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderRecep from "../components/Header";
import CitasDeHoy from "../components/CitasDeHoy"; 
import { useUser } from "../context/UserContext";
import BackIcon from "../assets/back-arrow.svg";
import "./styles/Check-in.css";

export default function CheckinPage() {
  const { nombre, puesto } = useUser();
  const navigate = useNavigate();
  
  const [busqueda, setBusqueda] = useState("");
  const [todasLasCitas, setTodasLasCitas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/citas")
      .then(res => res.json())
      .then(data => {
        const hoy = new Date();
        
        const citasDeHoy = data.filter(c => {
            const fechaCita = new Date(c.fecha_hora);
            return (
                fechaCita.getDate() === hoy.getDate() &&
                fechaCita.getMonth() === hoy.getMonth() &&
                fechaCita.getFullYear() === hoy.getFullYear()
            );
        });

        const adaptadas = citasDeHoy.map(c => {
            const fechaObj = new Date(c.fecha_hora);
            return {
                id: c.id,
                paciente: `Paciente #${c.id_paciente}`, // O nombre si tienes JOIN
                doctor: `Dr. #${c.id_medico}`,
                hora: fechaObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                ampm: fechaObj.getHours() >= 12 ? 'PM' : 'AM',
                fecha: fechaObj.toLocaleDateString(),
                tipo: c.motivo_consulta,
                estado: c.estado,
                original: c 
            };
        });
        setTodasLasCitas(adaptadas);
      })
      .catch(console.error);
  }, []);

  const handleConfirmarCheckin = async (cita) => {
      try {
         const res = await fetch(`http://localhost:3000/citas`, {
           method: 'PUT',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify({ ...cita.original, estado: 'En curso' })
         });
         if(res.ok) { alert("✅ Check-in exitoso"); navigate("/homerecep"); }
      } catch (e) { console.error(e); }
  };

  return (
    <div className="checkin-page">
      <div className="header-checkin">
        <button className="back-button" onClick={() => navigate("/homerecep")}>
          <img src={BackIcon} alt="volver" />
        </button>
        <h2 className="title">Check-in (Hoy)</h2>
      </div>
      <p className="subtitulo">Registra la llegada del paciente a su cita de hoy</p>
      <div className="contenido" style={{ display: 'block' }}>
        <div style={{ marginBottom: '20px' }}>
            <input 
                type="text" 
                placeholder="Buscar por ID de paciente..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            />
        </div>
        <CitasDeHoy 
            citas={todasLasCitas} 
            pacienteNombre={busqueda} 
            onConfirmarCheckin={handleConfirmarCheckin}
        />
      </div>
    </div>
  );
}