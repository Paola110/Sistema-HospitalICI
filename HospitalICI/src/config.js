// Si estamos en producción (npm run build), import.meta.env.PROD es true automáticamente.
// Usamos '' para que las peticiones sean relativas al dominio del servidor en producción.
// En desarrollo, usamos localhost:3000.
export const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';