import { useState } from "react";
import "./styles/BuscadorPaciente.css";
import RegistrarPaciente from "./RegistrarPaciente";

// AHORA RECIBE LA LISTA REAL DE PACIENTES
export default function BuscadorPaciente({
  pacientes = [],
  onSelectPaciente,
  onNuevoPaciente, // Opcional: Para abrir modal desde el padre
}) {
  const [query, setQuery] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  // Filtrado en tiempo real (Nombre o Celular)
  const resultados = pacientes.filter((p) => {
    const nombreCompleto = `${p.nombres} ${p.apellidos}`.toLowerCase();
    const telefono = p.telefono || "";
    const busqueda = query.toLowerCase();

    return nombreCompleto.includes(busqueda) || telefono.includes(busqueda);
  });

  return (
    <div className="buscador-container">
      <div className="buscador-top">
        <input
          type="text"
          placeholder="Buscar paciente (nombre o celular)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Botón para abrir modal de registro */}
        <button className="btn-nuevo" onClick={() => setMostrarModal(true)}>
          Registrar nuevo paciente
        </button>

        {mostrarModal && (
          <RegistrarPaciente
            onClose={() => setMostrarModal(false)}
            onSave={(data) => {
              console.log("Paciente guardado:", data);
              setMostrarModal(false);
              // Recargar la página para ver al nuevo paciente en la lista
              window.location.reload();
            }}
          />
        )}
      </div>

      {/* Lista de resultados */}
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
                  setQuery(""); // Limpiar búsqueda al seleccionar
                }}
              >
                <div>
                  <strong>{p.nombres} {p.apellidos}</strong>
                  <br />
                  <span style={{ fontSize: '0.85em', color: '#666' }}> {p.telefono}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}