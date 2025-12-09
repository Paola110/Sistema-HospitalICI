import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Listados.css";

import backIcon from "../../assets/back-arrow.svg";
import { API_URL } from "../../config";

export default function ListadoMedicos() {
  const navigate = useNavigate();

  const [medicosOriginal, setMedicosOriginal] = useState([]);
  const [resultado, setResultado] = useState([]);

  const [filtro, setFiltro] = useState({
    nombre: "",
    especialidad: "Todos",
    email: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/medicos")
      .then((res) => res.json())
      .then((data) => {
        setMedicosOriginal(data);
        setResultado(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleLimpiarFiltros = () => {
    setFiltro({
      nombre: "",
      especialidad: "Todos",
      email: "",
    });
  };

  const especialidadesUnicas = [
    "Todos",
    ...new Set(medicosOriginal.map((d) => d.especialidad)),
  ];

  useEffect(() => {
    const res = medicosOriginal.filter((d) => {
      const coincideNombre = `${d.nombres} ${d.apellidos} ${d.nombreCorto}`
        .toLowerCase()
        .includes(filtro.nombre.toLowerCase());

      const coincideEspecialidad =
        filtro.especialidad === "Todos" ||
        d.especialidad === filtro.especialidad;

      const coincideEmail = d.correo
        .toLowerCase()
        .includes(filtro.email.toLowerCase());

      return coincideNombre && coincideEspecialidad && coincideEmail;
    });

    setResultado(res);
  }, [filtro, medicosOriginal]);

  const handleRowClick = (doctor) => {
    navigate(`/detalle-medico/${doctor.id}`);
  };

  return (
    <div className="listado-container">
      <div className="header-listado">
        <button className="back-button" onClick={() => navigate("/homeadmin")}>
          <img src={backIcon} alt="volver" />
        </button>

        <h2 className="title">Listado Medicos</h2>
      </div>

      <p className="subtitulo">
        Gestiona el personal médico - busca por nombre, especialidad o email.
      </p>

      <div className="filter-bar">
        <div className="filter-row">
          <div className="filter-group">
            <label>Buscar nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej. Reed"
              value={filtro.nombre}
              onChange={(e) => setFiltro({ ...filtro, nombre: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Especialidad</label>
            <select
              name="especialidad"
              value={filtro.especialidad}
              onChange={(e) =>
                setFiltro({ ...filtro, especialidad: e.target.value })
              }
            >
              {especialidadesUnicas.map((esp) => (
                <option key={esp}>{esp}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="correo..."
              value={filtro.email}
              onChange={(e) => setFiltro({ ...filtro, email: e.target.value })}
            />
          </div>
          <button className="clear-filters-btn" onClick={handleLimpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      </div>

      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Email</th>
              <th>Teléfono</th>
            </tr>
          </thead>

          <tbody>
            {resultado.length > 0 ? (
              resultado.map((d) => (
                <tr key={d.id} onClick={() => handleRowClick(d)}>
                  <td>{d.nombreCorto}</td>
                  <td>{d.especialidad}</td>
                  <td>{d.correo}</td>
                  <td>{d.telefono}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No se encontraron médicos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}