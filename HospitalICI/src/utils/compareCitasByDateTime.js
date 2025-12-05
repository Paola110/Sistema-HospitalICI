/**
 * Convierte una hora en formato 12h (HH:MM AM/PM) a minutos desde la medianoche.
 * Esto es necesario para la comparación numérica de las horas.
 * @param {string} timeString
 * @returns {number} 
 */
export const timeToMinutes = (timeString) => {
  if (!timeString) return 0;

  const parts = timeString.split(' ');
  if (parts.length !== 2) return 0;

  const [time, period] = parts;
  const [hourStr, minuteStr] = time.split(':');

  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

/**
 * Convierte una fecha en formato DD/MM/YYYY a un objeto Date de JavaScript.
 * @param {string} dateString 
 * @returns {Date} 
 */
const dateToJSDate = (dateString) => {
  if (!dateString) return new Date(0);

  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Función de comparación principal para ordenar citas por fecha (ascendente) y luego por hora (ascendente).
 * @param {object} a 
 * @param {object} b 
 * @returns {number} 
 */
export const compareCitasByDateTime = (a, b) => {
  const dateA = dateToJSDate(a.fecha);
  const dateB = dateToJSDate(b.fecha);

  if (dateA.getTime() !== dateB.getTime()) {
    return dateA.getTime() - dateB.getTime();
  }

  const timeA = timeToMinutes(a.hora);
  const timeB = timeToMinutes(b.hora);

  return timeA - timeB;
};