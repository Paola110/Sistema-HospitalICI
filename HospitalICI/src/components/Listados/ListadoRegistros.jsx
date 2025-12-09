import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
// BORRAMOS: import registros from "../../data/registrosEjemplo";
import "./Listados.css";

import backIcon from "../../assets/back-arrow.svg";

export default function ListadoRegistros() {
  const navigate = useNavigate();

  // Estados para datos reales
  const [registrosOriginal, setRegistrosOriginal] = useState([]);
  const [resultado, setResultado] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtro, setFiltro] = useState({
    usuario: "",
    accion: "Todos",
    fecha: "",
  });

  // 1. CARGAR LOGS DEL BACKEND
  useEffect(() => {
    fetch("http://localhost:3000/admin/registros")
      .then((res) => res.json())
      .then((data) => {
        setRegistrosOriginal(data);
        setResultado(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Extraer acciones únicas dinámicamente de los datos reales
  const accionesUnicas = ["Todos", ...new Set(registrosOriginal.map((r) => r.accion))];

  // 2. LÓGICA DE FILTRADO
  useEffect(() => {
    const res = registrosOriginal.filter((r) => {
      const coincideUsuario = r.usuario
        .toLowerCase()
        .includes(filtro.usuario.toLowerCase());

      const coincideAccion =
        filtro.accion === "Todos" || r.accion === filtro.accion;

      // Filtro de fecha simple (String match)
      const coincideFecha = filtro.fecha === "" || r.fecha.includes(filtro.fecha);

      return coincideUsuario && coincideAccion && coincideFecha;
    });

    setResultado(res);
  }, [filtro, registrosOriginal]);

  const handleLimpiarFiltros = () => {
    setFiltro({
      usuario: "",
      accion: "Todos",
      fecha: "",
    });
  };

  const handleRowClick = (registro) => {
    // Aquí podrías abrir un modal con el detalle (valores anteriores/nuevos)
    // Por ahora no navegamos a ningún lado si no tienes esa pantalla
    console.log("Ver detalle del log:", registro);
    // navigate(`/detalle-registro/${registro.id}`); 
  };

  return (
    <div className="listado-container">
      <div className="header-listado">
        <button className="back-button" onClick={() => navigate("/homeadmin")}>
          <img src={backIcon} alt="volver" />
        </button>

        <h2 className="title">Bitácora de Movimientos</h2>
      </div>

      <p className="subtitulo">Historial de auditoría y seguridad del sistema</p>

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
              placeholder="DD/MM/AAAA"
              value={filtro.fecha}
              onChange={(e) => setFiltro({ ...filtro, fecha: e.target.value })}
            />
          </div>

          <button className="clear-filters-btn" onClick={handleLimpiarFiltros}>
            Limpiar
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
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: "center" }}>Cargando bitácora...</td></tr>
            ) : resultado.length > 0 ? (
              resultado.map((r) => (
                <tr key={r.id} onClick={() => handleRowClick(r)} style={{ cursor: 'default' }}>
                  <td><strong>{r.usuario}</strong></td>
                  <td>
                    <span style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.85em', fontWeight: 'bold',
                      backgroundColor: r.accion === 'CREAR' ? '#dcfce7' : r.accion === 'ELIMINAR' ? '#fee2e2' : '#e0f2fe',
                      color: r.accion === 'CREAR' ? '#166534' : r.accion === 'ELIMINAR' ? '#991b1b' : '#075985'
                    }}>
                      {r.accion}
                    </span>
                  </td>
                  <td>{r.descripcion}</td>
                  <td>{r.fecha}</td>
                  <td>{r.hora}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No se encontraron registros de auditoría.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}