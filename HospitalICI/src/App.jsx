import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

import HomeRecep from "./pages/HomeRecep";
import HomeMed from "./pages/HomeMed";
import HomeAdmin from "./pages/HomeAdmin";

import Ingresos from "./pages/Ingresos";
import CrearCita from "./pages/CrearCita";
import Checkin from "./pages/Check-in";
import Historial from "./pages/Historial";
import DetalleCita from "./pages/DetalleCita";

import Consulta from "./pages/Consulta";
import DetalleExpediente from "./pages/DetalleExpediente";

import ListadoPacientes from "./components/Listados/ListadoPacientes";
import ListadoMedicos from "./components/Listados/ListadoMedicos";
import ListadoRegistros from "./components/Listados/ListadoRegistros";
import DetalleMedico from "./pages/DetalleMedico";
import DetalleRegistro from "./pages/DetallesRegistro";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/homeRecep" element={<HomeRecep />} />
      <Route path="/homeMed" element={<HomeMed />} />
      <Route path="/homeAdmin" element={<HomeAdmin />} />

      <Route path="/reportes-ingresos" element={<Ingresos />} />
      <Route path="/crear-cita" element={<CrearCita />} />
      <Route path="/checkin" element={<Checkin />} />
      <Route path="/historial" element={<Historial />} />
      <Route path="/detalle-cita/:citaId" element={<DetalleCita />} />

      <Route path="/consulta/:citaId" element={<Consulta />} />
      <Route path="/expediente/:pacienteId" element={<DetalleExpediente />} />

      <Route path="listado-pacientes" element={<ListadoPacientes />} />
      <Route path="listado-medicos" element={<ListadoMedicos />} />
      <Route path="listado-registros" element={<ListadoRegistros />} />
      <Route path="/detalle-medico/:doctorId" element={<DetalleMedico />} />
      <Route path="/detalle-registro/:id" element={<DetalleRegistro />} />
    </Routes>
  );
}
