import { useState } from "react";
import "./styles/Modal.css";
import "./styles/RegistrarPaciente.css"; // Reutilizamos estilos de formulario
import { API_URL } from "../config";

export default function RegistrarPersonal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        password: "", // Normalmente se requiere password para crear usuario
        rol: "doctor",
        cedula: "",
        especialidad: "",
        horarioLaboral: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validación básica
        if (!formData.nombres || !formData.apellidos || !formData.email || !formData.password) {
            alert("Por favor completa los campos obligatorios.");
            setLoading(false);
            return;
        }

        // Payload según requisitos
        const payload = {
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            email: formData.email,
            password: formData.password,
            rol: formData.rol,
            cedula: formData.cedula || "N/A",
            especialidad: formData.especialidad || "N/A",
            horarioLaboral: formData.horarioLaboral || "N/A"
        };

        try {
            const response = await fetch(`${API_URL}/medicos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Personal registrado con éxito.");
                if (onSave) onSave();
                onClose();
            } else {
                const err = await response.json();
                alert("Error al registrar: " + (err.message || err.error || "Datos inválidos"));
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión al registrar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2>Registrar Personal</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="form-registro">

                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre(s) *</label>
                            <input name="nombres" value={formData.nombres} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Apellidos *</label>
                            <input name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Contraseña *</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Rol en el sistema *</label>
                        <select name="rol" value={formData.rol} onChange={handleChange} style={{ padding: '8px', width: '100%' }}>
                            <option value="doctor">Doctor</option>
                            <option value="recepcionista">Recepcionista</option>
                            <option value="administrativo">Administrativo</option>
                        </select>
                    </div>

                    {/* Campos condicionales o generales */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Cédula (Opcional)</label>
                            <input name="cedula" value={formData.cedula} onChange={handleChange} placeholder="Ej. 12345678" />
                        </div>
                        <div className="form-group">
                            <label>Horario Laboral</label>
                            <input name="horarioLaboral" value={formData.horarioLaboral} onChange={handleChange} placeholder="Ej. L-V 8:00 - 16:00" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Especialidad / Departamento</label>
                        <input name="especialidad" value={formData.especialidad} onChange={handleChange} placeholder="Ej. Cardiología o Administración" />
                    </div>

                    <button type="submit" className="save-button" disabled={loading}>
                        {loading ? "Registrando..." : "Registrar Usuario"}
                    </button>
                </form>
            </div>
        </div>
    );
}
