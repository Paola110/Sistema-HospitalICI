import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import TarjetaDoctorCompleta from "../components/TarjetaDoctorCompleta.jsx";
import TarjetaFormacion from "../components/TarjetaFormacion.jsx";
import TarjetaEstadisticas from "../components/TarjetaEstadisticas.jsx";
import HistorialCitasDoctor from "../components/HistorialCitasDoctor.jsx";
import { API_URL } from "../config";

import BackIcon from "../assets/back-arrow.svg";
import "./styles/DetalleMedico.css";

export default function DetalleMedico() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [citasDoctor, setCitasDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      try {
        if (!doctorId) return;

        const resDoctor = await fetch(`${API_URL}/medicos/${doctorId}`);

        if (!resDoctor.ok) {
          throw new Error("Médico no encontrado");
        }

        const dataDoctor = await resDoctor.json();

        const doctorSeguro = {
          ...dataDoctor,
          anosExperiencia: dataDoctor.anosExperiencia ?? 0,
          horarioLaboral: dataDoctor.horarioLaboral ?? "No definido",
          serviciosOfrece: dataDoctor.serviciosOfrece ?? [],
          formacion: dataDoctor.formacion ?? [],
          certificaciones: dataDoctor.certificaciones ?? [],
          stats: dataDoctor.stats ?? {
            pacientesAtendidos: 0,
            satisfaccion: 0,
            ingresosGenerados: 0,
            calificacionPromedio: 0.0,
          },
        };

        setDoctor(doctorSeguro);

        const resCitas = await fetch("http://localhost:3000/citas");
        if (resCitas.ok) {
          const todasLasCitas = await resCitas.json();
          const citasDeEsteDoctor = todasLasCitas.filter(
            (c) => Number(c.id_medico) === Number(doctorId)
          );
          setCitasDoctor(citasDeEsteDoctor);
        }

      } catch (error) {
        console.error("Error cargando detalles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [doctorId]);

  const onStartEdit = () => setEditing(true);

  const onCancelEdit = () => {
    setEditing(false);
    window.location.reload();
  };

  const onSave = async (updatedDoctor) => {
    try {
      const datosParaEnviar = {
        nombres: updatedDoctor.nombres,
        apellidos: updatedDoctor.apellidos,
        email: updatedDoctor.correo,
        cedula: updatedDoctor.cedula,
        especialidad: updatedDoctor.especialidad,
        horarioLaboral: updatedDoctor.horarioLaboral
      };

      const response = await fetch(`http://localhost:3000/medicos/${updatedDoctor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosParaEnviar)
      });

      if (response.ok) {
        setDoctor(updatedDoctor);
        setEditing(false);
        alert("Médico actualizado correctamente en la Base de Datos");
      } else {
        alert("Error al actualizar: Verifica los datos.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
  };

  if (loading) {
    return (
      <div className="detalle-medico-page loading">
        Cargando detalle del médico...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="detalle-medico-page loading">
        <h3>Médico no encontrado o error de conexión.</h3>
        <button className="btn-secondary" onClick={() => navigate(-1)}>Volver</button>
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
              citas={citasDoctor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}