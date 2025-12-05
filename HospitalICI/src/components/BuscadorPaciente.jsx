import { useState } from "react";
import "./styles/BuscadorPaciente.css";
import RegistrarPaciente from "./RegistrarPaciente";

export default function BuscadorPaciente({
  pacientes,
  onSelectPaciente,
  onNuevoPaciente,
}) {
  const [query, setQuery] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const resultados = pacientes.filter((p) =>
    `${p.nombres} ${p.apellidos}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="buscador-container">
      <div className="buscador-top">
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {onNuevoPaciente && (
          <button className="btn-nuevo" onClick={() => setMostrarModal(true)}>
            Registrar nuevo paciente
          </button>
        )}

        {mostrarModal && (
          <RegistrarPaciente
            onClose={() => setMostrarModal(false)}
            onSave={(data) => {
              console.log("Paciente guardado:", data);
              setMostrarModal(false);
            }}
          />
        )}
      </div>

      {query.length > 0 && (
        <div className="buscador-resultados">
          {resultados.length === 0 ? (
            <p className="sin-resultados">No se encontraron pacientes</p>
          ) : (
            resultados.map((p) => (
              <div
                key={p.id}
                className="buscador-item"
                onClick={() => {
                  onSelectPaciente(p);
                  setQuery("");
                }}
              >
                {p.nombres} {p.apellidos}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
