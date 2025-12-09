import { useState } from "react";

export default function SelectorMedico({ medicos = [], onSelect, selectedId }) {
    const [filtro, setFiltro] = useState("");

    const safeMedicos = Array.isArray(medicos) ? medicos : [];

    const filtrados = safeMedicos.filter((m) => {
        const term = filtro.toLowerCase();
        const nombre = (m.nombreCorto || `${m.nombres} ${m.apellidos}`).toLowerCase();
        const esp = (m.especialidad || "").toLowerCase();
        return nombre.includes(term) || esp.includes(term);
    });

    return (
        <div className="selector-medico">
            <div className="search-box-medico" style={{ marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar médico o especialidad..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ddd" }}
                />
            </div>

            <div className="lista-medicos" style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #eee", borderRadius: "8px" }}>
                {filtrados.length === 0 ? (
                    <p style={{ padding: "10px", color: "#999", textAlign: "center" }}>No se encontraron médicos.</p>
                ) : (
                    filtrados.map((m) => {
                        const isSelected = m.id === selectedId;
                        return (
                            <div
                                key={m.id}
                                onClick={() => onSelect(m)}
                                style={{
                                    padding: "10px",
                                    borderBottom: "1px solid #f0f0f0",
                                    cursor: "pointer",
                                    backgroundColor: isSelected ? "#eff6ff" : "white",
                                    borderLeft: isSelected ? "4px solid #2563eb" : "4px solid transparent",
                                    transition: "all 0.2s"
                                }}
                            >
                                <div style={{ fontWeight: "bold", color: "#333" }}>
                                    {m.nombreCorto || `${m.nombres} ${m.apellidos}`}
                                </div>
                                <div style={{ fontSize: "0.85em", color: "#666" }}>
                                    {m.especialidad}
                                </div>
                                <div style={{ fontSize: "0.8em", color: "#888", marginTop: "2px" }}>
                                    {m.horarioLaboral || "Horario no disponible"}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
