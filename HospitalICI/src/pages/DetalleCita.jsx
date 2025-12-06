import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerDetalleCita } from "../data/detallesEjemplo";

import "./styles/DetalleCita.css";

import TarjetaPersona from "../components/TarjetaPersona";

import BackIcon from "../assets/back-arrow.svg";

import TarjetaInfoCita from "../components/TarjetaInfoCita";
import TarjetaMotivoConsulta from "../components/TarjetaMotivoConsulta";

export default function DetalleCita() {
  const { citaId } = useParams();
  const navigate = useNavigate();
  const [detalleCita, setDetalleCita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const idToFetch = citaId || "1";
      const data = obtenerDetalleCita(idToFetch);

      if (data) {
        setDetalleCita(data);
      } else {
        setError(true);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [citaId]);

  if (loading) {
    return (
      <>
        <div className="detalle-page loading text-center p-10 text-xl font-semibold text-gray-600">
          Cargando detalles de la cita...
        </div>
      </>
    );
  }

  if (error || !detalleCita) {
    return (
      <>
        <div className="detalle-page error text-center p-10 text-xl font-bold text-red-600">
          Error: Cita no encontrada o ID inválido ({citaId}).
        </div>
      </>
    );
  }

  const estadoClase = `status-${detalleCita.estadoClase}`;

  return (
    <>
      <div className="detalle-page">
        <div className="header-detalle">
          <button className="back-button" onClick={() => navigate(-2)}>
            <img className="icono" src={BackIcon} />
          </button>

          <h2 className="title">Detalle de Cita #{detalleCita.id}</h2>

          <span className={`estado-principal ${estadoClase}`}>
            {detalleCita.estado}
          </span>
        </div>
        <p className="subtitulo">Información completa de la cita médica</p>

        <div className="content-grid">
          <div className="sidebar">
            <TarjetaPersona
              persona={detalleCita.pacienteDetalle}
              type="paciente"
            />
            <TarjetaPersona persona={detalleCita.doctorDetalle} type="medico" />
          </div>

          <div className="main-content">
            <TarjetaInfoCita cita={detalleCita} />
            <TarjetaMotivoConsulta
              motivoDetallado={detalleCita.motivoDetallado}
              sintomas={detalleCita.sintomas}
            />
          </div>
        </div>
      </div>
    </>
  );
}
