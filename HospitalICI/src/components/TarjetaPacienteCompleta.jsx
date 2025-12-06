import "../pages/styles/DetalleExpediente.css";

export default function TarjetaPacienteCompleta({
  paciente,
  editing,
  setPaciente,
}) {
  if (!paciente) return null;

  const handleField = (field, value) => {
    setPaciente({ ...paciente, [field]: value });
  };

  return (
    <div className="card paciente-full-card">
      <div className="avatar-row">
        <div className="avatar-large">
          {(
            (paciente.nombres || " ").charAt(0) +
            (paciente.apellidos || " ").charAt(0)
          ).toUpperCase()}
        </div>
      </div>
      <div className="nombre-block">
        <h3 className="paciente-nombre">
          {paciente.nombres} {paciente.apellidos}
        </h3>
        <div className="meta">
          <span className="tag">
            {paciente.sexo === "M" ? "Masculino" : "Femenino"}
          </span>
          •<span className="edad"> {paciente.edad} años</span>
        </div>
        <div className="exp">
          Expediente: #PAC-{String(paciente.id).padStart(3, "0")}
        </div>
      </div>

      <div className="info-grid">
        <label>Fecha de Nac.</label>
        {editing ? (
          <input
            value={paciente.fechaNacimiento ?? ""}
            onChange={(e) => handleField("fechaNacimiento", e.target.value)}
            placeholder="dd/mm/aaaa"
          />
        ) : (
          <div>{paciente.fechaNacimiento ?? "No registrado"}</div>
        )}

        <label>Dirección</label>
        {editing ? (
          <input
            value={paciente.direccion ?? ""}
            onChange={(e) => handleField("direccion", e.target.value)}
          />
        ) : (
          <div>{paciente.direccion ?? "No registrado"}</div>
        )}

        <label>Teléfono</label>
        {editing ? (
          <input
            value={paciente.telefono}
            onChange={(e) => handleField("telefono", e.target.value)}
          />
        ) : (
          <div>{paciente.telefono}</div>
        )}

        <label>Email</label>
        {editing ? (
          <input
            value={paciente.correo}
            onChange={(e) => handleField("correo", e.target.value)}
          />
        ) : (
          <div>{paciente.correo}</div>
        )}
      </div>

      <hr />

      <div className="contacto-emergencia">
        <h4>Contacto de Emergencia</h4>
        {editing ? (
          <>
            <input
              value={paciente.contactoEmergencia?.nombre || ""}
              onChange={(e) =>
                setPaciente({
                  ...paciente,
                  contactoEmergencia: {
                    ...paciente.contactoEmergencia,
                    nombre: e.target.value,
                  },
                })
              }
              placeholder="Nombre"
            />

            <input
              value={paciente.contactoEmergencia?.relacion || ""}
              onChange={(e) =>
                setPaciente({
                  ...paciente,
                  contactoEmergencia: {
                    ...paciente.contactoEmergencia,
                    relacion: e.target.value,
                  },
                })
              }
              placeholder="Relación"
            />
            <input
              value={paciente.contactoEmergencia?.telefono || ""}
              onChange={(e) =>
                setPaciente({
                  ...paciente,
                  contactoEmergencia: {
                    ...paciente.contactoEmergencia,
                    telefono: e.target.value,
                  },
                })
              }
              placeholder="Teléfono"
            />
          </>
        ) : (
          <div className="DatosCont">
            <p>
              <strong>{paciente.contactoEmergencia?.nombre}</strong>
            </p>
            <p className="Relacion">{paciente.contactoEmergencia?.relacion}</p>
            <p>{paciente.contactoEmergencia?.telefono}</p>
          </div>
        )}
      </div>
    </div>
  );
}
