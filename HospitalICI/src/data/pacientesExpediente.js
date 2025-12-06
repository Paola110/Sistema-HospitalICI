import { pacientesEjemplo } from "./pacientesEjemplo.js";

export const pacientesExpediente = pacientesEjemplo.map(p => ({
  ...p,

  altura: 165,
  peso: 65,
  imc: 23.9,

  alergias: "Ninguna",
  enfermedadesCronicas: "No refiere",
  cirugiasPrevias: "Ninguna",
  medicamentosActuales: "Ninguno",

  antecedentesFamiliares: [
    "Padre: Diabetes",
    "Madre: Hipertensión"
  ],

  contactoEmergencia: {
    nombre: "Contacto Genérico",
    telefono: "449 000 00 00",
    relacion: "Familiar"
  },
}));

export default pacientesExpediente;
