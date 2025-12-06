import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pacientes from "../../data/pacientesEjemplo";
import "./Listados.css";

import backIcon from "../../assets/back-arrow.svg";

export default function ListadoPacientes() {
  const navigate = useNavigate();

  const [filtro, setFiltro] = useState({
    nombre: "",
    telefono: "",
    id: "",
  });

  const handleLimpiarFiltros = () => {
    setFiltro({
      nombre: "",
      telefono: "",
      id: "",
    });
  };

  const [resultado, setResultado] = useState(pacientes);

  useEffect(() => {
    const res = pacientes.filter((p) => {
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
  }, [filtro]);

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
            {resultado.map((p) => (
              <tr key={p.id} onClick={() => handleRowClick(p)}>
                <td>
                  {p.nombres} {p.apellidos}
                </td>
                <td>{p.id}</td>
                <td>{p.domicilio}</td>
                <td>{p.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
