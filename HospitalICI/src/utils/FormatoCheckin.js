/**
 * Formatea una fecha DD/MM/YYYY a un formato legible (ej: 01 Dic 2025).
 * @param {string} dateString 
 * @returns {string}
 */
const formatFechaLegible = (dateString) => {
  const [day, month, year] = dateString.split('/');
  const date = new Date(`${year}-${month}-${day}T00:00:00`);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const options = { day: 'numeric', month: 'short', year: 'numeric' };

  const formatted = date.toLocaleDateString('es-ES', options);

  return formatted.replace(/\./g, '');
};

/**
 * Transforma un objeto de cita del formato Agenda al formato Check-in.
 * @param {Object} cita 
 * @returns {Object} 
 */
export const formatCitaForCheckin = (cita) => {
  const [hora, ampm] = cita.hora.split(" ");

  return {
    id: `${cita.paciente}-${cita.hora}-${cita.fecha}`,
    hora: hora,
    ampm: ampm,
    servicio: cita.tipo,
    dia: (cita.fecha === getCurrentDateFormatted()) ? "Hoy" : "Próximo",
    fecha: formatFechaLegible(cita.fecha),
    doctor: cita.doctor,
    estado: cita.estado,
  };
};

/**
 * Función auxiliar para obtener la fecha actual en formato DD/MM/YYYY
 * @returns {string} 
 */
const getCurrentDateFormatted = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};


/**
 * Filtra la lista de citas para encontrar solo las citas de un paciente específico.
 * @param {Array} listaCitas 
 * @param {string} nombrePaciente 
 * @returns {Array} 
 */
export const getPacienteCitasForCheckin = (listaCitas, nombrePaciente) => {
  const todayDate = getCurrentDateFormatted();

  return listaCitas
    .filter(cita =>
      cita.paciente === nombrePaciente &&
      cita.estado === "Programada" &&
      cita.fecha === todayDate
    )
    .map(formatCitaForCheckin);
};