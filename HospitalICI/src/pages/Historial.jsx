import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AppointmentsTable from "../components/AppointmentsTable.jsx";
import listaDeCitas from "/src/data/citasEjemplo.js";
import "./styles/Historial.css";

import backIcon from "../assets/back-arrow.svg";

const estadosUnicos = [...new Set(listaDeCitas.map((c) => c.estado))];
const motivosUnicos = [...new Set(listaDeCitas.map((c) => c.tipo))];

export default function HistorialCitas() {
  const navigate = useNavigate();

  const [filtro, setFiltro] = useState({
    paciente: "",
    estado: "Todos",
    fecha: "",
    motivo: "Todos",
  });
  const [citasFiltradas, setCitasFiltradas] = useState(listaDeCitas);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltro((prev) => ({ ...prev, [name]: value }));
  };

  const handleLimpiarFiltros = () => {
    setFiltro({
      paciente: "",
      estado: "Todos",
      fecha: "",
      motivo: "Todos",
    });
  };

  const handleRowClick = (cita) => {
    navigate(`/detalle-cita/${cita.id}`);
    console.log(`Navegando al detalle de la cita ID: ${cita.id}`);
  };

  useEffect(() => {
    let resultados = listaDeCitas.filter((cita) => {
      const coincidePaciente = cita.paciente
        .toLowerCase()
        .includes(filtro.paciente.toLowerCase());

      const coincideEstado =
        filtro.estado === "Todos" || cita.estado === filtro.estado;

      const coincideFecha = filtro.fecha === "" || cita.fecha === filtro.fecha;

      const coincideMotivo =
        filtro.motivo === "Todos" || cita.tipo === filtro.motivo;

      return (
        coincidePaciente && coincideEstado && coincideFecha && coincideMotivo
      );
    });

    setCitasFiltradas(resultados);
  }, [filtro]);

  return (
    <div className="historial">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="volver" />
        </button>

        <h2 className="title">Historial</h2>
      </div>

      <p className="subtitulo">Consulta y gestiona todas tus citas médicas</p>
      <div className="filter-bar">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="paciente">Buscar paciente</label>
            <input
              type="text"
              id="paciente"
              name="paciente"
              placeholder="Ej. Juan Pérez"
              value={filtro.paciente}
              onChange={handleChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={filtro.estado}
              onChange={handleChange}
            >
              <option value="Todos">Todos</option>
              {estadosUnicos.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="fecha">Fecha (DD/MM/AAAA)</label>
            <input
              type="text"
              id="fecha"
              name="fecha"
              placeholder="Ej. 01/12/2025"
              value={filtro.fecha}
              onChange={handleChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="motivo">Motivo</label>
            <select
              id="motivo"
              name="motivo"
              value={filtro.motivo}
              onChange={handleChange}
            >
              <option value="Todos">Todos</option>
              {motivosUnicos.map((motivo) => (
                <option key={motivo} value={motivo}>
                  {motivo}
                </option>
              ))}
            </select>
          </div>

          <button className="clear-filters-btn" onClick={handleLimpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      </div>

      <AppointmentsTable data={citasFiltradas} onRowClick={handleRowClick} />
    </div>
  );
}
