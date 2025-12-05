import listaDeCitas from "./citasEjemplo";
import pacientesEjemplo from "./pacientesEjemplo";
import doctoresEjemplo from "./doctoresEjemplo";

export function obtenerDetalleCita(citaId) {
  const citaBase = listaDeCitas.find((c) => c.id === parseInt(citaId));

  // Validación primero
  if (!citaBase) return null;

  // Datos base
  const fecha = citaBase.fecha;
  const hora = citaBase.hora;

  const pacienteDetalle = pacientesEjemplo.find(
    (p) => `${p.nombres} ${p.apellidos}` === citaBase.paciente
  );

  const doctorDetalle = doctoresEjemplo.find(
    (d) => d.nombreCorto === citaBase.doctor
  );

  // Detalles comunes
  const detallesComunes = {
    consultorio: "Consultorio C-101",
    duracion: "30 minutos",
    folio: `#CIT-${String(citaBase.id).padStart(6, "0")}`,
    creadaPor: doctorDetalle.nombreCorto,
    fechaCreacion: "01 Nov 2025, 10:00 AM",
    ultimaModificacion: "03 Dic 2025, 08:30 AM",
  };


  // Motivo y síntomas
  let motivoDetallado;
  let sintomas;

  switch (citaBase.tipo) {
    case "Limpieza Dental":
      motivoDetallado =
        "El paciente solicita una limpieza dental de rutina, no ha tenido una en los últimos 6 meses. No presenta molestias mayores, solo acumulación leve de sarro.";
      sintomas = [
        "Acumulación de sarro",
        "Sensibilidad leve (frio)",
        "Encías ligeramente inflamadas",
      ];
      break;

    case "Urgencia":
      motivoDetallado =
        "El paciente reporta un dolor de muela súbito e intenso en el cuadrante inferior derecho, que se irradia hacia el oído.";
      sintomas = ["Dolor agudo", "Hinchazón facial", "Sensibilidad a la presión"];
      break;

    case "Consulta General":
      motivoDetallado =
        "Revisión anual de salud. El paciente quiere discutir hábitos alimenticios y fatiga reciente.";
      sintomas = ["Fatiga", "Molestia estomacal", "Dificultad para dormir"];
      break;

    case "Seguimiento":
      motivoDetallado =
        "Cita de seguimiento para evaluar la medicación prescrita la semana anterior.";
      sintomas = ["Malestar persistente", "Fiebre leve intermitente"];
      break;

    default:
      motivoDetallado =
        "Cita de control rutinario sin detalles específicos.";
      sintomas = ["Ninguno"];
  }

  return {
    fecha,
    hora,
    ...citaBase,
    ...detallesComunes,
    motivoDetallado,
    sintomas,
    pacienteDetalle,
    doctorDetalle
  };
}
