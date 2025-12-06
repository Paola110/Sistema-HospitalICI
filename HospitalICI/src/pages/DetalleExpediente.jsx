import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import pacientes from "../data/pacientesEjemplo.js";
import listaDeCitas from "../data/citasEjemplo.js";

import TarjetaPacienteCompleta from "../components/TarjetaPacienteCompleta";
import TarjetaDatosClinicos from "../components/TarjetaDatosClinicos";
import HistorialCitasPaciente from "../components/HistorialCitasPaciente";

import BackIcon from "../assets/back-arrow.svg";
import "./styles/DetalleExpediente.css";

export default function DetalleExpediente() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setLoading(true);
    const id = pacienteId ? Number(pacienteId) : null;

    let found = null;
    if (id) {
      found = pacientes.find((p) => Number(p.id) === id);
    }
    if (!found) {
      found = pacientes[0];
    }

    const enriched = {
      ...found,
      altura: found.altura ?? 165,
      peso: found.peso ?? 65,
      imc: 0,
      alergias: found.alergias ?? "Sin registro",
      enfermedadesCronicas: found.enfermedadesCronicas ?? "No refiere",
      cirugiasPrevias: found.cirugiasPrevias ?? "No refiere",
      antecedentesFamiliares: found.antecedentesFamiliares ?? [],
      contactoEmergencia: found.contactoEmergencia ?? {
        nombre: "No registrado",
        telefono: "N/A",
        relacion: "",
      },
    };

    enriched.imc = calcularIMC(enriched.altura, enriched.peso);

    setPaciente(enriched);
    setLoading(false);
  }, [pacienteId]);

  const calcularIMC = (alturaCm, pesoKg) => {
    const h = Number(alturaCm) / 100;
    if (!h || !isFinite(h) || h <= 0) return 0;
    return +(Number(pesoKg) / (h * h)).toFixed(1);
  };

  const onStartEdit = () => setEditing(true);
  const onCancelEdit = () => {
    const id = paciente?.id ?? null;
    const original = pacientes.find((p) => Number(p.id) === id);
    if (original) {
      setPaciente({
        ...original,
        altura: original.altura ?? 165,
        peso: original.peso ?? 65,
        imc: calcularIMC(original.altura ?? 165, original.peso ?? 65),
        alergias: original.alergias ?? "Sin registro",
        enfermedadesCronicas: original.enfermedadesCronicas ?? "No refiere",
        cirugiasPrevias: original.cirugiasPrevias ?? "No refiere",
        antecedentesFamiliares: original.antecedentesFamiliares ?? [],
        contactoEmergencia: original.contactoEmergencia ?? {
          nombre: "No registrado",
          telefono: "N/A",
          relacion: "",
        },
      });
    }
    setEditing(false);
  };

  const onSave = (updated) => {
    const recalculado = {
      ...updated,
      imc: calcularIMC(updated.altura, updated.peso),
    };
    setPaciente(recalculado);
    setEditing(false);
  };

  if (loading || !paciente) {
    return (
      <div className="detalle-page loading">
        Cargando detalle de expediente...
      </div>
    );
  }

  const pacienteNombreCompleto = `${paciente.nombres} ${paciente.apellidos}`;

  return (
    <div className="detalle-page">
      <div className="header-detalle">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img className="icono" src={BackIcon} alt="back" />
        </button>

        <h2 className="title-det">Detalle del Paciente</h2>

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
                onClick={() => onSave(paciente)}
              >
                Guardar
              </button>
            </>
          )}
        </div>
      </div>

      <p className="subtitulo-de">
        Información personal y expediente clínico completo
      </p>

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
            calcularIMC={(h, p) => calcularIMC(h, p)}
          />

          <div className="card historial-card">
            <div className="historial-header">
              <h3>Historial de Citas</h3>
              <div className="historial-actions">
                <button
                  className="btn-link"
                  onClick={() => navigate("/historial")}
                >
                  Ver historial completo
                </button>
              </div>
            </div>

            <HistorialCitasPaciente
              pacienteNombre={pacienteNombreCompleto}
              citas={listaDeCitas}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
