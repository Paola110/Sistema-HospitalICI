import { useState } from "react";
import "./styles/Modal.css";

export default function CobrarConsulta({ cita, onClose }) {
  const [monto, setMonto] = useState("");
  const [metodo, setMetodo] = useState("Efectivo");
  const [loading, setLoading] = useState(false);

  const imprimirTicket = (datosPago) => {
    const ventana = window.open('', 'PRINT', 'height=600,width=400');
    ventana.document.write(`
      <html>
        <head><title>Ticket de Pago</title></head>
        <body style="font-family: monospace; padding: 20px; text-align: center;">
          <h2>HOSPITAL ICI</h2>
          <p>--------------------------------</p>
          <p style="text-align: left;">
            <strong>Fecha:</strong> ${new Date().toLocaleString()}<br>
            <strong>Paciente:</strong> ${cita.paciente}<br>
            <strong>Doctor:</strong> ${cita.doctor}<br>
            <strong>Servicio:</strong> ${cita.tipo}
          </p>
          <p>--------------------------------</p>
          <h3>TOTAL: $${parseFloat(datosPago.monto).toFixed(2)}</h3>
          <p>Método: ${datosPago.metodo}</p>
          <p>--------------------------------</p>
          <p>¡Gracias por su preferencia!</p>
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();
  };

  const handleCobrar = async () => {
    if (!monto) return alert("Ingrese un monto");
    setLoading(true);

    const idPaciente = typeof cita.paciente === 'string' && cita.paciente.includes('#')
        ? parseInt(cita.paciente.split('#')[1])
        : cita.id_paciente || 1;

    try {
      const resPago = await fetch("http://localhost:3000/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_paciente: idPaciente,
          id_recepcionista: 1, 
          monto: parseFloat(monto),
          metodo: metodo
        }),
      });

      if (!resPago.ok) throw new Error("Error al registrar pago");

 
      const payloadUpdate = {
          id: cita.id,
          fecha_hora: cita.original ? cita.original.fecha_hora : new Date().toISOString(), // Fallback
          motivo: cita.tipo, 
          id_medico: cita.original ? cita.original.id_medico : 1,
          id_paciente: idPaciente,
          estado: "Terminada" 
      };

      await fetch(`http://localhost:3000/citas`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payloadUpdate)
      });

      imprimirTicket({ monto, metodo });
      
      alert(" Pago registrado correctamente");
      onClose();
      window.location.reload(); 

    } catch (error) {
      console.error(error);
      alert("Error al procesar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header-green">
          <h2 className="title">Cobrar consulta</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-content">
          <div className="modal-body">
            <p><strong>Paciente:</strong> {cita.paciente}</p>
            <p><strong>Servicio:</strong> {cita.tipo}</p>
            <div className="modal-section">
              <label className="input-label">Monto ($)</label>
              <input type="number" className="input" placeholder="Ej. 500" value={monto} onChange={(e) => setMonto(e.target.value)} />
              <label className="input-label">Método</label>
              <select className="input" value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>Transferencia</option>
              </select>
            </div>
          </div>
          <div className="receta-buttons">
            <button className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button className="btn-primary" onClick={handleCobrar} disabled={loading}>
              {loading ? "Procesando..." : "Cobrar e Imprimir"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}