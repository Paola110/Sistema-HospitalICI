import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import registrosEjemplo from "../data/registrosEjemplo";
import backIcon from "../assets/back-arrow.svg";
import "./styles/DetallesRegistro.css";

const formatDetailsForTable = (details) => {
  if (!details) return [];

  const formattedRows = [];

  if (details.creado) {
    for (const key in details.creado) {
      formattedRows.push({
        campo:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        antes: "N/A",
        despues: details.creado[key],
      });
    }
    return formattedRows;
  }

  for (const key in details) {
    const { antes, despues } = details[key];
    const campoNombre =
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

    formattedRows.push({
      campo: campoNombre,
      antes: Array.isArray(antes) ? antes.join(", ") : antes,
      despues: Array.isArray(despues) ? despues.join(", ") : despues,
    });
  }

  return formattedRows;
};

const getActionColorClass = (accion) => {
  switch (accion.toLowerCase()) {
    case "crear":
      return "badge-crear";
    case "actualizar":
      return "badge-actualizar";
    case "eliminar":
      return "badge-eliminar";
    default:
      return "badge-default";
  }
};

export default function DetalleRegistro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [registro, setRegistro] = useState(null);
  const getShortId = (id) => {
    if (!id) return "";
    const str = String(id);
    return str.slice(-3);
  };

  useEffect(() => {
    if (id) {
      const fullId = `#${id}`;
      const foundRegistro = registrosEjemplo.find((r) => r.id === fullId);
      setRegistro(foundRegistro);
    }
  }, [id]);

  if (!registro) {
    return (
      <div className="detalle-registro-page">
        <p>Cargando o Registro no encontrado...</p>
      </div>
    );
  }

  const detallesTabla = formatDetailsForTable(registro.detalles);

  return (
    <div className="detalle-registro-page">
      <div className="header-detalle-registro">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="volver" />
        </button>
        <h2 className="title-det-reg">Detalle del Registro</h2>
      </div>

      <p className="subtitulo-de-reg">Auditoría de cambios y actividades</p>

      <div className="content-grid-reg">
        <div className="sidebar-reg">
          <div className="card card-audit">
            <div className="registro-id">{registro.id}</div>

            <div
              className={`badge-accion ${getActionColorClass(registro.accion)}`}
            >
              {registro.accion.toUpperCase()}
            </div>

            <div className="divider-reg"></div>

            <div className="info-block-reg">
              <label>Realizado por</label>
              <div>{registro.usuario}</div>
              <p className="puesto-reg">{registro.puesto}</p>
            </div>

            <div className="divider-reg"></div>

            <div className="info-block-reg">
              <label>Fecha</label>
              <div>
                {new Date(registro.fecha)
                  .toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/\./g, "")}
              </div>
            </div>

            <div className="info-block-reg">
              <label>Hora</label>
              <div>{registro.hora}</div>
            </div>

            <div className="info-block-reg">
              <label>IP Origen</label>
              <div>{registro.ip}</div>
            </div>

            <div className="info-block-reg description-block">
              <label>Descripción</label>
              <p>{registro.descripcion}</p>
            </div>
          </div>
        </div>

        <div className="main-content-reg">
          <div className="card card-entity">
            <div className="card-header-icon-reg">
              <h3>Entidad Afectada</h3>
            </div>

            <div className="entity-info-grid">
              <label>{registro.entidad.tipo.toUpperCase()}</label>
              <br />
              <div>{registro.entidad.nombre}</div>
              <br />
              <label>ID: {registro.entidad.id}</label>
            </div>
          </div>

          <div className="card card-changes">
            <div className="card-header-icon-reg">
              <h3>Detalle de Cambios</h3>
            </div>

            <div className="changes-table-wrapper">
              <table className="changes-table">
                <thead>
                  <tr>
                    <th>CAMPO</th>
                    <th>ANTES</th>
                    <th>DESPUÉS</th>
                  </tr>
                </thead>

                <tbody>
                  {detallesTabla.length > 0 ? (
                    detallesTabla.map((item, index) => (
                      <tr key={index}>
                        <td>{item.campo}</td>
                        <td>
                          <span
                            className={
                              item.antes !== "N/A" &&
                              registro.accion !== "crear"
                                ? "value-antes"
                                : ""
                            }
                          >
                            {item.antes ||
                              (registro.accion === "eliminar"
                                ? "Eliminado"
                                : "N/A")}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              item.despues !== "N/A" &&
                              registro.accion !== "eliminar"
                                ? "value-despues"
                                : ""
                            }
                          >
                            {item.despues ||
                              (registro.accion === "eliminar"
                                ? "N/A"
                                : "Creado")}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="no-changes">
                        No se registraron cambios específicos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
