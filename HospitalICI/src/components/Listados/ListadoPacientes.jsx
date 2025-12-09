import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// BORRAMOS: import pacientes from "../../data/pacientesEjemplo"; 
import { API_URL } from "../../config";
import "./Listados.css";

import backIcon from "../../assets/back-arrow.svg";

export default function ListadoPacientes() {
  const navigate = useNavigate();

  const [pacientesOriginal, setPacientesOriginal] = useState([]);

  const [resultado, setResultado] = useState([]);

  const [filtro, setFiltro] = useState({
    nombre: "",
    telefono: "",
    id: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/pacientes`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos recibidos del backend:", data);
        setPacientesOriginal(data);
        setResultado(data);
      })
      .catch((error) => {
        console.error("Error conectando al servidor:", error);
      });
  }, []);


  useEffect(() => {
    const res = pacientesOriginal.filter((p) => {
      const coincideNombre = `${p.nombres} ${p.apellidos}`
        .toLowerCase()
        .includes(filtro.nombre.toLowerCase());

      const coincideTelefono = p.telefono
        .toLowerCase()
        .includes(filtro.telefono.toLowerCase());

      const coincideId = String(p.id)
        .toLowerCase()
        .includes(filtro.id.toLowerCase());

      return coincideNombre && coincideTelefono && coincideId;
    });

    setResultado(res);
  }, [filtro, pacientesOriginal]);
  const handleLimpiarFiltros = () => {
    setFiltro({
      nombre: "",
      telefono: "",
      id: "",
    });
  };

  const handleRowClick = (paciente) => {
    navigate(`/expediente/${paciente?.id}`);
  };

  return (
    <div className="listado-container">
      <div className="header-listado">
        <button className="back-button" onClick={() => navigate("/homeadmin")}>
          <img src={backIcon} alt="volver" />
        </button>

        <h2 className="title">Listado Pacientes</h2>
      </div>

      <p className="subtitulo">
        Gestiona los pacientes - busca por nombre, telefono o ID.
      </p>

      <div className="filter-bar">
        <div className="filter-row">
          <div className="filter-group">
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Ej. Juan Pérez"
              value={filtro.nombre}
              onChange={(e) => setFiltro({ ...filtro, nombre: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>ID</label>
            <input
              type="text"
              placeholder="Ej. 25"
              value={filtro.id}
              onChange={(e) => setFiltro({ ...filtro, id: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Teléfono</label>
            <input
              type="text"
              placeholder="Ej. 449 123 4567"
              value={filtro.telefono}
              onChange={(e) =>
                setFiltro({ ...filtro, telefono: e.target.value })
              }
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
              <th>ID</th>
              <th>Domicilio</th>
              <th>Teléfono</th>
            </tr>
          </thead>

          <tbody>
            {resultado.length > 0 ? (
              resultado.map((p) => (
                <tr key={p.id} onClick={() => handleRowClick(p)}>
                  <td>
                    {p.nombres} {p.apellidos}
                  </td>
                  <td>{p.id}</td>
                  <td>{p.direccion || "Sin dirección"}</td>
                  <td>{p.telefono}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No se encontraron pacientes (o no hay conexión al servidor).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}