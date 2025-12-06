import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import registros from "../../data/registrosEjemplo";
import "./Listados.css";

import backIcon from "../../assets/back-arrow.svg";

export default function ListadoRegistros() {
  const navigate = useNavigate();

  const [filtro, setFiltro] = useState({
    usuario: "",
    accion: "Todos",
    fecha: "",
  });

  const handleLimpiarFiltros = () => {
    setFiltro({
      usuario: "",
      accion: "Todos",
      fecha: "",
    });
  };

  const accionesUnicas = ["Todos", ...new Set(registros.map((r) => r.accion))];

  const [resultado, setResultado] = useState(registros);

  useEffect(() => {
    const res = registros.filter((r) => {
      const coincideUsuario = r.usuario
        .toLowerCase()
        .includes(filtro.usuario.toLowerCase());

      const coincideAccion =
        filtro.accion === "Todos" || r.accion === filtro.accion;

      const coincideFecha = filtro.fecha === "" || r.fecha === filtro.fecha;

      return coincideUsuario && coincideAccion && coincideFecha;
    });

    setResultado(res);
  }, [filtro]);

  const handleRowClick = (registro) => {
    const idSinHash = registro.id.replace("#", "");
    navigate(`/detalle-registro/${idSinHash}`);
  };

  return (
    <div className="listado-container">
      <div className="header-listado">
        <button className="back-button" onClick={() => navigate("/homeadmin")}>
          <img src={backIcon} alt="volver" />
        </button>

        <h2 className="title">Listado Registros</h2>
      </div>

      <p className="subtitulo">Historial de actividades del sistema</p>

      <div className="filter-bar">
        <div className="filter-row">
          <div className="filter-group">
            <label>Usuario</label>
            <input
              type="text"
              value={filtro.usuario}
              onChange={(e) =>
                setFiltro({ ...filtro, usuario: e.target.value })
              }
              placeholder="Ej. Admin"
            />
          </div>

          <div className="filter-group">
            <label>Tipo de acción</label>
            <select
              value={filtro.accion}
              onChange={(e) => setFiltro({ ...filtro, accion: e.target.value })}
            >
              {accionesUnicas.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Fecha</label>
            <input
              type="text"
              placeholder="01/12/2025"
              value={filtro.fecha}
              onChange={(e) => setFiltro({ ...filtro, fecha: e.target.value })}
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
              <th>Usuario</th>
              <th>Acción</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Hora</th>
            </tr>
          </thead>

          <tbody>
            {resultado.map((r) => (
              <tr key={r.id} onClick={() => handleRowClick(r)}>
                <td>{r.usuario}</td>
                <td>{r.accion}</td>
                <td>{r.descripcion}</td>
                <td>{r.fecha}</td>
                <td>{r.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
