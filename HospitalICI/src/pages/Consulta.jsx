import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

import TarjetaPersona from "../components/TarjetaPersona";
import QuickAction from "../components/QuickAction";

import { API_URL } from "../config";

import CrearReceta from "../components/CrearReceta";
import ReservarQuirofano from "../components/ReservarQuirofano";

import backIcon from "../assets/back-arrow.svg";
import documento from "../assets/checklist.svg";
import expediente from "../assets/cedula.svg";
import doctorIcon from "../assets/doctor.svg";

import "./styles/Consulta.css";

export default function Consulta() {
  const navigate = useNavigate();
  const { citaId } = useParams();
  const { userId } = useUser();

  // 1. Recuperar la cita seleccionada del Contexto o LocalStorage
  const [cita, setCita] = useState(null);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para Nota Médica
  const [nota, setNota] = useState({
    peso: "",
    altura: "",
    presion: "",
    temperatura: "",
    saturacion: "",
    diagnostico: "",
    tratamiento: ""
  });

  const [procesando, setProcesando] = useState(false);
  const [mostrarReceta, setMostrarReceta] = useState(false);
  const [mostrarQuir, setMostrarQuir] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      // Intentar leer de localStorage (seteado en HomeMed)
      const stored = localStorage.getItem("citaSeleccionadaMedico");
      let citaData = null;

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.id.toString() === citaId) {
          citaData = parsed;
        }
      }

      // Si no hay cita en localStorage, idealmente haríamos fetch a /citas/:id
      if (!citaData) {
        setLoading(false);
        return;
      }

      setCita(citaData);

      // VALIDACIÓN: Si la cita ya terminó, no permitir ingresar a la pantalla de consulta
      if (citaData.estado === "Terminada") {
        alert("Esta consulta ya ha sido finalizada. No se puede volver a editar.");
        navigate("/homemed");
        return;
      }

      // 2. Fetch detalles del paciente
      if (citaData.id_paciente) {
        try {
          const resp = await fetch(`${API_URL}/pacientes/${citaData.id_paciente}`);
          if (resp.ok) {
            const dataPac = await resp.json();
            setPacienteSeleccionado(dataPac);
          }
        } catch (err) {
          console.error("Error cargando paciente:", err);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [citaId]);

  const handleChangeNota = (campo, valor) => {
    setNota({ ...nota, [campo]: valor });
  };

  const handleFinalizar = async () => {
    if (!nota.diagnostico || !nota.tratamiento) {
      alert("Por favor completa el diagnóstico y tratamiento.");
      return;
    }

    setProcesando(true);

    try {
      // 1. Actualizar estado de la Cita -> 'terminada'
      const citaPayload = {
        id: cita.id,
        fecha_hora: cita.fecha_hora_raw,
        motivo: cita.tipo,
        estado: "terminada",
        id_medico: userId,
        id_paciente: cita.id_paciente
      };

      const updateRes = await fetch(`${API_URL}/citas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(citaPayload)
      });

      if (!updateRes.ok) throw new Error("Error al finalizar la cita.");

      // 2. Crear Nota Médica
      const notaPayload = {
        id_paciente: cita.id_paciente,
        id_medico: userId,
        peso: parseFloat(nota.peso) || 0,
        altura: parseFloat(nota.altura) || 0,
        presion: nota.presion,
        temperatura: parseFloat(nota.temperatura) || 0,
        saturacion: parseFloat(nota.saturacion) || 0,
        diagnostico: nota.diagnostico,
        tratamiento: nota.tratamiento
      };

      const notaRes = await fetch(`${API_URL}/notas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notaPayload)
      });

      if (!notaRes.ok) throw new Error("Error al guardar la nota médica.");

      alert("Consulta finalizada exitosamente.");
      navigate("/homemed");

    } catch (error) {
      console.error("Error finalizando:", error);
      alert("Ocurrió un error: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  if (loading) return <div className="consulta-page"><p>Cargando datos de consulta...</p></div>;
  if (!cita) return <div className="consulta-page"><p>No se encontró la información de la cita.</p></div>;

  return (
    <div className="consulta-page">
      {/* ENCABEZADO */}
      <div className="header-consulta">
        <button className="back-button" onClick={() => navigate("/homemed")}>
          <img src={backIcon} alt="volver" />
        </button>

        <h2 className="title">Consulta</h2>

        <div className="header-fecha-motivo">
          <p>
            Fecha y hora de la consulta: {cita.fecha} {cita.hora}
          </p>
        </div>

        <div className="header-fecha-motivo">
          <p>Motivo de la consulta: {cita.tipo}</p>
        </div>
      </div>

      <p className="subtitulo-consul">Registro de consulta médica</p>

      <div className="consulta-layout">
        {/* PANEL IZQUIERDO */}
        <div className="left-panel">
          {pacienteSeleccionado ? (
            <TarjetaPersona paciente={pacienteSeleccionado} type="paciente" />
          ) : (
            <p>Cargando datos del paciente...</p>
          )}

          <div className="acciones-box-consulta">
            <h3>Acciones rápidas</h3>

            <QuickAction
              pequeño
              titulo="Crear receta"
              icono={documento}
              onClick={() => setMostrarReceta(true)}
            />

            <QuickAction
              pequeño
              titulo="Ver datos médicos"
              icono={expediente}
              to={`/expediente/${cita.id_paciente}`}
            />

            <QuickAction
              titulo="Reservar quirófano"
              icono={doctorIcon}
              onClick={() => setMostrarQuir(true)}
            />
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="right-panel">

          <div className="nota-medica-box">
            <h3>Signos Vitales</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <input style={{ flex: 1, padding: '8px' }} type="number" placeholder="Peso (kg)" value={nota.peso} onChange={(e) => handleChangeNota('peso', e.target.value)} />
              <input style={{ flex: 1, padding: '8px' }} type="number" placeholder="Altura (cm)" value={nota.altura} onChange={(e) => handleChangeNota('altura', e.target.value)} />
              <input style={{ flex: 1, padding: '8px' }} type="text" placeholder="T/A (120/80)" value={nota.presion} onChange={(e) => handleChangeNota('presion', e.target.value)} />
              <input style={{ flex: 1, padding: '8px' }} type="number" placeholder="Temp (°C)" value={nota.temperatura} onChange={(e) => handleChangeNota('temperatura', e.target.value)} />
              <input style={{ flex: 1, padding: '8px' }} type="number" placeholder="SatO2 (%)" value={nota.saturacion} onChange={(e) => handleChangeNota('saturacion', e.target.value)} />
            </div>

            <h3>Nota médica</h3>
            <label style={{ fontWeight: 'bold' }}>Diagnóstico</label>
            <textarea
              placeholder="Diagnóstico del paciente..."
              style={{ height: '100px', marginBottom: '15px' }}
              value={nota.diagnostico}
              onChange={(e) => handleChangeNota('diagnostico', e.target.value)}
            ></textarea>

            <label style={{ fontWeight: 'bold' }}>Tratamiento / Plan</label>
            <textarea
              placeholder="Plan de tratamiento..."
              style={{ height: '100px' }}
              value={nota.tratamiento}
              onChange={(e) => handleChangeNota('tratamiento', e.target.value)}
            ></textarea>
          </div>

          <button className="btn-finalizar" onClick={handleFinalizar} disabled={procesando}>
            {procesando ? "Finalizando..." : "Finalizar consulta"}
          </button>
        </div>

        {mostrarReceta && (
          <CrearReceta
            paciente={pacienteSeleccionado}
            cita={cita}
            onClose={() => setMostrarReceta(false)}
          />
        )}

        {mostrarQuir && (
          <ReservarQuirofano
            medico={cita.doctor}
            paciente={pacienteSeleccionado}
            cita={cita}
            onClose={() => setMostrarQuir(false)}
          />
        )}
      </div>
    </div>
  );
}
