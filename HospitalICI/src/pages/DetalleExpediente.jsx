import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import TarjetaPacienteCompleta from "../components/TarjetaPacienteCompleta";
import TarjetaDatosClinicos from "../components/TarjetaDatosClinicos";
import HistorialCitasPaciente from "../components/HistorialCitasPaciente";

import BackIcon from "../assets/back-arrow.svg";
import "./styles/DetalleExpediente.css";
import { API_URL } from "../config";

export default function DetalleExpediente() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [citasPaciente, setCitasPaciente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      try {
        if (!pacienteId) return;

        const resPaciente = await fetch(`${API_URL}/pacientes/${pacienteId}`);
        if (!resPaciente.ok) throw new Error("Paciente no encontrado");

        const dataPaciente = await resPaciente.json();

        const enriched = {
          ...dataPaciente,
          altura: dataPaciente.altura ?? 170,
          peso: dataPaciente.peso ?? 70,
          imc: 0,
          alergias: dataPaciente.alergias ?? "Sin registro",
          enfermedadesCronicas: "No refiere",
          cirugiasPrevias: "No refiere",
          antecedentesFamiliares: [],
          contactoEmergencia: dataPaciente.contactoEmergencia ?
            { nombre: dataPaciente.contactoEmergencia, telefono: "", relacion: "" } :
            { nombre: "No registrado", telefono: "N/A", relacion: "" },
        };

        enriched.imc = calcularIMC(enriched.altura, enriched.peso);
        setPaciente(enriched);

        const resCitas = await fetch("http://localhost:3000/citas");
        if (resCitas.ok) {
          const todasCitas = await resCitas.json();
          const delPaciente = todasCitas.filter(c => Number(c.id_paciente) === Number(pacienteId));
          setCitasPaciente(delPaciente);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [pacienteId]);

  const calcularIMC = (alturaCm, pesoKg) => {
    const h = Number(alturaCm) / 100;
    if (!h || !isFinite(h) || h <= 0) return 0;
    return +(Number(pesoKg) / (h * h)).toFixed(1);
  };

  const onStartEdit = () => setEditing(true);

  const onCancelEdit = () => {
    setEditing(false);
    window.location.reload();
  };

  const onSave = async (updated) => {
    try {
      const recalculado = {
        ...updated,
        imc: calcularIMC(updated.altura, updated.peso),
      };

      const datosParaEnviar = {
        nombres: updated.nombres,
        apellidos: updated.apellidos,
        fechaNacimiento: updated.fechaNacimiento,
        sexo: updated.sexo,
        telefono: updated.telefono,
        email: updated.email,
        direccion: updated.direccion,
        contactoEmergencia: updated.contactoEmergencia?.nombre,
        telefonoEmergencia: updated.contactoEmergencia?.telefono
      };

      const response = await fetch(`http://localhost:3000/pacientes/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaEnviar)
      });

      if (response.ok) {
        setPaciente(recalculado);
        setEditing(false);
        alert(" Expediente actualizado correctamente.");
      } else {
        const errorData = await response.json();
        alert(" Error: " + (errorData.error || "No se pudo actualizar"));
      }

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  if (loading) {
    return <div className="detalle-page loading">Cargando detalle de expediente...</div>;
  }

  if (!paciente) {
    return (
      <div className="detalle-page loading">
        <h3>Paciente no encontrado.</h3>
        <button className="btn-secondary" onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  return (
    <div className="detalle-page">
      <div className="header-detalle">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img className="icono" src={BackIcon} alt="back" />
        </button>

        <h2 className="title-det">Detalle del Paciente</h2>

        <div className="header-actions">
          {!editing ? (
            <button className="btn-edit" onClick={onStartEdit}>Editar</button>
          ) : (
            <>
              <button className="btn-secondary small" onClick={onCancelEdit}>Cancelar</button>
              <button className="btn-primary small" onClick={() => onSave(paciente)}>Guardar</button>
            </>
          )}
        </div>
      </div>

      <p className="subtitulo-de">Información personal y expediente clínico completo</p>

      <div className="content-grid">
        <div className="sidebar">
          <TarjetaPacienteCompleta
            paciente={paciente}
            editing={editing}
            setPaciente={setPaciente}
          />
        </div>

        <div className="main-content">
          <TarjetaDatosClinicos
            paciente={paciente}
            editing={editing}
            setPaciente={setPaciente}
            calcularIMC={calcularIMC}
          />

          <div className="card historial-card">
            <div className="historial-header">
              <h3>Historial de Citas</h3>
            </div>

            <HistorialCitasPaciente
              pacienteNombre={`${paciente.nombres} ${paciente.apellidos}`}
              citas={citasPaciente}
            />
          </div>
        </div>
      </div>
    </div>
  );
}