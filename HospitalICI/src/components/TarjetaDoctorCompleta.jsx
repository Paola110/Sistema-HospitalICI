import React from "react";
import "../pages/styles/DetalleMedico.css";

import phone from "../assets/phone.svg";
import mail from "../assets/email.png";

export default function TarjetaDoctorCompleta({ doctor, editing, setDoctor }) {
  if (!doctor) return null;

  const handleField = (field, value) => {
    setDoctor({ ...doctor, [field]: value });
  };

  const getInitials = () => {
    const firstInitial = (doctor.nombres || " ").charAt(0);
    const lastInitial = (doctor.apellidos || " ").charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <div className="card doctor-full-card">
      <div className="avatar-row">
        <div className="avatar-large">{getInitials()}</div>
      </div>
      <div className="nombre-block">
        <h3 className="doctor-nombre">
          Dra. {doctor.nombres} {doctor.apellidos}
        </h3>
        <div className="cedula">Cédula: #{doctor.cedula}</div>
      </div>

      <div className="info-grid">
        <label>Especialidad</label>
        {editing ? (
          <input
            value={doctor.especialidad}
            onChange={(e) => handleField("especialidad", e.target.value)}
          />
        ) : (
          <div>{doctor.especialidad}</div>
        )}

        <label>Cédula Profesional</label>
        {editing ? (
          <input
            value={doctor.cedula}
            onChange={(e) => handleField("cedula", e.target.value)}
          />
        ) : (
          <div>#{doctor.cedula}</div>
        )}

        <label>Años de Experiencia</label>
        {editing ? (
          <input
            type="number"
            value={doctor.anosExperiencia}
            onChange={(e) =>
              handleField("anosExperiencia", Number(e.target.value))
            }
          />
        ) : (
          <div>{doctor.anosExperiencia} años</div>
        )}

        <label>Horario Laboral</label>
        {editing ? (
          <input
            value={doctor.horarioLaboral}
            onChange={(e) => handleField("horarioLaboral", e.target.value)}
          />
        ) : (
          <div>{doctor.horarioLaboral}</div>
        )}

        <label>Consultorio Asignado</label>
        {editing ? (
          <input
            value={doctor.consultorio}
            onChange={(e) => handleField("consultorio", e.target.value)}
          />
        ) : (
          <div>{doctor.consultorio}</div>
        )}
      </div>

      <hr className="divider" />

      <div className="servicios-ofrece">
        <h4>Servicios que Ofrece</h4>
        <div className="tags-container">
          {doctor.serviciosOfrece.map((servicio, index) => (
            <span key={index} className="servicio-tag">
              {servicio}
            </span>
          ))}
          {editing && (
            <input
              className="servicio-input"
              placeholder="Añadir/Editar (separar por comas)"
              value={doctor.serviciosOfrece.join(", ")}
              onChange={(e) =>
                handleField(
                  "serviciosOfrece",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
            />
          )}
        </div>
      </div>

      <hr className="divider" />

      <div className="contacto-info">
        <h4>Información de Contacto</h4>

        <div className="contacto-row">
          <span>
            <img className="icon-tel" src={phone} />
          </span>
          {editing ? (
            <input
              value={doctor.telefono}
              onChange={(e) => handleField("telefono", e.target.value)}
            />
          ) : (
            <div>{doctor.telefono}</div>
          )}
        </div>

        <div className="contacto-row">
          <span>
            <img className="icon-mail" src={mail} />
          </span>
          {editing ? (
            <input
              type="email"
              value={doctor.correo}
              onChange={(e) => handleField("correo", e.target.value)}
            />
          ) : (
            <div>{doctor.correo}</div>
          )}
        </div>
      </div>
    </div>
  );
}
