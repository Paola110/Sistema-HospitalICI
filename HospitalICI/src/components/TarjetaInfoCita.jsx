import React from "react";

import tag from "../assets/tag.svg";
import consultorioIcon from "../assets/consultorio.svg";
import FolioIcon from "../assets/tag.svg";
import UserIcon from "../assets/user.png";
import DateCreatedIcon from "../assets/calendar.png";
import ModifyIcon from "../assets/doctor.svg";
import CalendarIcon from "../assets/calendar.png";

import "./styles/TarjetasDetalles.css";

export default function TarjetaInfoCita({ cita }) {
  if (!cita) return null;

  const {
    fecha,
    hora,
    duracion,
    folio,
    creadaPor,
    tipo,
    fechaCreacion,
    ultimaModificacion,
    consultorio,
  } = cita;

  return (
    <div className="tarjeta-info-cita">
      <div className="header-with-icon">
        <h2>Información de la Cita</h2>
        <img
          className="card-header-icon"
          src={CalendarIcon}
          alt="Icono Calendario"
        />
      </div>

      <div className="info-blocks-grid">
        <div className="info-block info-block-fecha">
          <div className="label">Fecha</div>
          <div className="value">{fecha}</div>
        </div>
        <div className="info-block info-block-hora">
          <div className="label">Hora</div>
          <div className="value">{hora}</div>
        </div>
        <div className="info-block info-block-duracion">
          <div className="label">Duración</div>
          <div className="value">{duracion}</div>
        </div>
      </div>

      <div className="data-list-grid">
        <div className="data-item">
          <div className="label">Folio</div>
          <div className="value">{folio}</div>
        </div>

        <div className="data-item">
          <div className="label">Creada por</div>
          <div className="value">{creadaPor}</div>
        </div>

        <div className="data-item">
          <div className="label">Tipo de cita</div>
          <div className="value">{tipo}</div>
        </div>

        <div className="data-item">
          <div className="label">Fecha creación</div>
          <div className="value">{fechaCreacion}</div>
        </div>

        <div className="data-item">
          <div className="label">Consultorio</div>
          <div className="value">{consultorio}</div>
        </div>

        <div className="data-item">
          <div className="label">Última modificación</div>
          <div className="value">{ultimaModificacion}</div>
        </div>
      </div>
    </div>
  );
}
