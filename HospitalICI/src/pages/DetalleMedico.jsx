import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import doctoresEjemplo from "../data/doctoresEjemplo.js";
import listaDeCitas from "../data/citasEjemplo.js";

import TarjetaDoctorCompleta from "../components/TarjetaDoctorCompleta.jsx";
import TarjetaFormacion from "../components/TarjetaFormacion.jsx";
import TarjetaEstadisticas from "../components/TarjetaEstadisticas.jsx";
import HistorialCitasDoctor from "../components/HistorialCitasDoctor.jsx";

import BackIcon from "../assets/back-arrow.svg";
import "./styles/DetalleMedico.css";

export default function DetalleMedico() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setLoading(true);
    const id = doctorId ? Number(doctorId) : null;

    let found = null;
    if (id) {
      found = doctoresEjemplo.find((d) => Number(d.id) === id);
    }
    if (!found) {
      found = doctoresEjemplo[0];
    }

    const enriched = {
      ...found,
      anosExperiencia: found.anosExperiencia ?? 0,
      horarioLaboral: found.horarioLaboral ?? "No definido",
      serviciosOfrece: found.serviciosOfrece ?? [],
      formacion: found.formacion ?? [],
      certificaciones: found.certificaciones ?? [],
      stats: found.stats ?? {
        pacientesAtendidos: 0,
        satisfaccion: 0,
        ingresosGenerados: 0,
        calificacionPromedio: 0.0,
      },
    };

    setDoctor(enriched);
    setLoading(false);
  }, [doctorId]);

  const onStartEdit = () => setEditing(true);
  const onCancelEdit = () => {
    const id = doctor?.id ?? null;
    const original = doctoresEjemplo.find((d) => Number(d.id) === id);
    if (original) {
      setDoctor(original);
    }
    setEditing(false);
  };

  const onSave = (updated) => {
    setDoctor(updated);
    setEditing(false);
    alert("Datos actualizados localmente (no guardados en backend real).");
  };

  if (loading || !doctor) {
    return (
      <div className="detalle-medico-page loading">
        Cargando detalle del médico...
      </div>
    );
  }

  const doctorNombreCompleto = `${doctor.nombres} ${doctor.apellidos}`;

  return (
    <div className="detalle-medico-page">
      <div className="header-detalle">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img className="icono" src={BackIcon} alt="back" />
        </button>

        <h2 className="title-det">Detalle del Médico</h2>

        <div className="header-actions">
          {!editing ? (
            <button className="btn-edit" onClick={onStartEdit}>
              Editar
            </button>
          ) : (
            <>
              <button className="btn-secondary small" onClick={onCancelEdit}>
                Cancelar
              </button>
              <button
                className="btn-primary small"
                onClick={() => onSave(doctor)}
              >
                Guardar
              </button>
            </>
          )}
        </div>
      </div>

      <p className="subtitulo-de">
        Información personal y profesional completa
      </p>

      <div className="content-grid">
        <div className="sidebar">
          <TarjetaDoctorCompleta
            doctor={doctor}
            editing={editing}
            setDoctor={setDoctor}
          />
        </div>

        <div className="main-content">
          <TarjetaFormacion
            doctor={doctor}
            editing={editing}
            setDoctor={setDoctor}
          />

          <TarjetaEstadisticas doctor={doctor} />

          <div className="card historial-card">
            <div className="historial-header">
              <h3>Historial de Pacientes</h3>
            </div>

            <HistorialCitasDoctor
              doctorNombre={doctorNombreCompleto}
              citas={listaDeCitas}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
