import "./styles/TarjetaPersona.css";

import phone from "../assets/phone.svg";
import mail from "../assets/email.png";
import doctor from "../assets/doctor.svg";
import cedula from "../assets/cedula.svg";

export default function TarjetaPersona({
  persona: personaProp,
  paciente,
  type,
}) {
  const persona = personaProp || paciente;

  if (!persona) return null;

  const esPaciente = type === "paciente";
  const titulo = esPaciente ? "Paciente" : "Médico Asignado";
  const nombres = persona.nombres || "";
  const apellidos = persona.apellidos || "";

  const nombreCompleto = `${nombres} ${apellidos}`;
  const iniciales = `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();

  return (
    <>
      <div className="tarjeta-persona" data-type={type}>
        <h4 className="titulo">{titulo}</h4>

        <div className="Avatar-Nombre_subinfo">
          <div className="avatar">
            <span>{iniciales}</span>
          </div>

          <h3 className="nombre">{nombreCompleto}</h3>
          {esPaciente && (
            <p className="sub-info">
              {persona.sexo === "M" ? "Masculino" : "Femenino"} -
              <span className="edad"> {persona.edad} años</span>
            </p>
          )}

          {!esPaciente && (
            <p className="sub-info-medico">
              {persona.especialidad} | Cédula:
              <span className="font-semibold ml-1">{persona.cedula}</span>
            </p>
          )}
        </div>

        <hr className="divider" />

        <div className="datos">
          {esPaciente ? (
            <>
              <p style={{ color: "#007bff" }}>
                <img className="icono" src={phone} />
                Teléfono: <strong>{persona.telefono}</strong>
              </p>
              <p style={{ color: "#007bff" }}>
                <img className="icono" src={mail} />
                Email: <strong>{persona.correo}</strong>
              </p>
            </>
          ) : (
            <>
              <p style={{ color: "#28a745" }}>
                <img className="icono" src={doctor} />
                Especialidad: <strong>{persona.especialidad}</strong>
              </p>
              <p style={{ color: "#28a745" }}>
                <img className="icono" src={cedula} />
                Cédula: <strong>{persona.cedula}</strong>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
