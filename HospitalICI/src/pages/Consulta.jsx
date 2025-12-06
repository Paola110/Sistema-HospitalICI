import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import TarjetaPersona from "../components/TarjetaPersona";
import QuickAction from "../components/QuickAction";

import serviciosEjemplo from "../data/serviciosEjemplo.js";
import listaDeCitas from "../data/citasEjemplo.js";
import pacientes from "../data/pacientesEjemplo.js";

import CrearReceta from "../components/CrearReceta";
import ReservarQuirofano from "../components/ReservarQuirofano";

import backIcon from "../assets/back-arrow.svg";
import documento from "../assets/checklist.svg";
import expediente from "../assets/cedula.svg";
import doctor from "../assets/doctor.svg";

import "./styles/Consulta.css";

export default function Consulta() {
  const navigate = useNavigate();
  const { citaId } = useParams();

  const cita = listaDeCitas.find((c) => c.id.toString() === citaId);

  if (!cita) {
    return <p style={{ padding: "2rem" }}> Cita no encontrada</p>;
  }

  const partes = cita.paciente.trim().split(/\s+/);
  const nombres = partes[0] || "";
  const apellidos = partes.slice(1).join(" ") || "";

  const pacienteReal = pacientes.find(
    (p) =>
      p.nombres.toLowerCase() === nombres.toLowerCase() &&
      p.apellidos.toLowerCase() === apellidos.toLowerCase()
  );

  const pacienteSeleccionado = {
    nombres,
    apellidos,
    sexo: pacienteReal?.sexo || "M",
    edad: pacienteReal?.edad || "N/A",
    telefono: pacienteReal?.telefono || "N/A",
    correo: pacienteReal?.correo || "N/A",
  };

  const [busqueda, setBusqueda] = useState("");
  const [serviciosAgregados, setServiciosAgregados] = useState([]);

  const listaServicios = Object.values(serviciosEjemplo);

  const filtrados = listaServicios.filter((s) =>
    s.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarServicio = (serv) => {
    if (!serviciosAgregados.some((s) => s.id === serv.id)) {
      setServiciosAgregados([...serviciosAgregados, serv]);
    }
    setBusqueda("");
  };

  const eliminarServicio = (id) => {
    setServiciosAgregados(serviciosAgregados.filter((s) => s.id !== id));
  };

  const total = serviciosAgregados.reduce((sum, s) => sum + s.precio, 0);

  const [mostrarReceta, setMostrarReceta] = useState(false);
  const [mostrarQuir, setMostrarQuir] = useState(false);

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
          <TarjetaPersona paciente={pacienteSeleccionado} type="paciente" />

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
              to={`/expediente/${pacienteReal?.id}`}
            />

            <QuickAction
              titulo="Reservar quirófano"
              icono={doctor}
              onClick={() => setMostrarQuir(true)}
            />
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="right-panel">
          {/* Nota médica */}
          <div className="nota-medica-box">
            <h3>Nota médica</h3>
            <textarea placeholder="Escribir nota médica aquí..."></textarea>
          </div>

          {/* Servicios */}
          <div className="servicios-box">
            <h3>Agregar servicios</h3>

            <input
              className="buscador"
              placeholder="Buscar servicio..."
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            {/* AUTOCOMPLETE */}
            {busqueda && (
              <div className="autocomplete-box">
                {filtrados.map((s) => (
                  <div
                    key={s.id}
                    className="autocomplete-item"
                    onClick={() => agregarServicio(s)}
                  >
                    {s.nombre} — ${s.precio}
                  </div>
                ))}
              </div>
            )}

            {/* Lista agregada */}
            <div className="servicios-lista">
              {serviciosAgregados.map((s) => (
                <div key={s.id} className="servicio-item">
                  <p>{s.nombre}</p>
                  <span>${s.precio.toFixed(2)}</span>
                  <button
                    className="remove-btn"
                    onClick={() => eliminarServicio(s.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="total-box">
              <p>Total de servicios:</p>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>

          <button className="btn-finalizar">Finalizar consulta</button>
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
