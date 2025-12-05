const listaDeCitas = [
  {
    id: 1,
    hora: "01:00 PM",
    fecha: "05/12/2025",
    paciente: "María Juana López",
    doctor: "Dr. E. Reed",
    tipo: "Limpieza Dental",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 2,
    hora: "09:30 AM",
    fecha: "05/12/2025",
    paciente: "María Juana López",
    doctor: "Dra. S. Connor",
    tipo: "Consulta General",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 3,
    hora: "10:00 AM",
    fecha: "05/12/2025",
    paciente: "María Juana López",
    doctor: "Dr. J. Kim",
    tipo: "Seguimiento",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 4,
    hora: "10:30 AM",
    fecha: "06/01/2026",
    paciente: "María Juana López",
    doctor: "Dr. A. Grant",
    tipo: "Control",
    estado: "Cancelada",
    estadoClase: "cancelada"
  },

  {
    id: 5,
    hora: "11:00 AM",
    fecha: "03/12/2025",
    paciente: "Carlos Ramírez Soto",
    doctor: "Dr. A. Grant",
    tipo: "Urgencia",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 6,
    hora: "11:30 AM",
    fecha: "15/12/2025",
    paciente: "Carlos Ramírez Soto",
    doctor: "Dr. E. Reed",
    tipo: "Revisión",
    estado: "Pagada",
    estadoClase: "pagada"
  },
  {
    id: 7,
    hora: "12:00 PM",
    fecha: "27/12/2025",
    paciente: "Carlos Ramírez Soto",
    doctor: "Dra. S. Connor",
    tipo: "Laboratorio",
    estado: "No asistió",
    estadoClase: "noasistio"
  },
  {
    id: 8,
    hora: "04:00 PM",
    fecha: "08/01/2026",
    paciente: "Carlos Ramírez Soto",
    doctor: "Dr. J. Kim",
    tipo: "Consulta General",
    estado: "En consulta",
    estadoClase: "consulta"
  },

  {
    id: 9,
    hora: "09:00 AM",
    fecha: "05/12/2025",
    paciente: "Ana González Ruiz",
    doctor: "Dra. S. Connor",
    tipo: "Seguimiento",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 10,
    hora: "09:30 AM",
    fecha: "17/12/2025",
    paciente: "Ana González Ruiz",
    doctor: "Dr. E. Reed",
    tipo: "Limpieza Dental",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 11,
    hora: "10:00 AM",
    fecha: "29/12/2025",
    paciente: "Ana González Ruiz",
    doctor: "Dr. J. Kim",
    tipo: "Urgencia",
    estado: "Check-in",
    estadoClase: "checkin"
  },
  {
    id: 12,
    hora: "10:30 AM",
    fecha: "10/01/2026",
    paciente: "Ana González Ruiz",
    doctor: "Dr. A. Grant",
    tipo: "Control",
    estado: "Finalizada",
    estadoClase: "finalizada"
  },

  {
    id: 13,
    hora: "11:00 AM",
    fecha: "07/12/2025",
    paciente: "Roberto Díaz Herrera",
    doctor: "Dr. E. Reed",
    tipo: "Laboratorio",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 14,
    hora: "11:30 AM",
    fecha: "19/12/2025",
    paciente: "Roberto Díaz Herrera",
    doctor: "Dr. A. Grant",
    tipo: "Consulta General",
    estado: "Cancelada",
    estadoClase: "cancelada"
  },
  {
    id: 15,
    hora: "12:00 PM",
    fecha: "31/12/2025",
    paciente: "Roberto Díaz Herrera",
    doctor: "Dra. S. Connor",
    tipo: "Revisión",
    estado: "Pagada",
    estadoClase: "pagada"
  },
  {
    id: 16,
    hora: "04:00 PM",
    fecha: "12/01/2026",
    paciente: "Roberto Díaz Herrera",
    doctor: "Dr. J. Kim",
    tipo: "Seguimiento",
    estado: "En consulta",
    estadoClase: "consulta"
  },

  {
    id: 17,
    hora: "09:00 AM",
    fecha: "09/12/2025",
    paciente: "Lucía Méndez Aguilar",
    doctor: "Dr. J. Kim",
    tipo: "Consulta General",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 18,
    hora: "09:30 AM",
    fecha: "21/12/2025",
    paciente: "Lucía Méndez Aguilar",
    doctor: "Dra. S. Connor",
    tipo: "Control",
    estado: "No asistió",
    estadoClase: "noasistio"
  },
  {
    id: 19,
    hora: "10:00 AM",
    fecha: "02/01/2026",
    paciente: "Lucía Méndez Aguilar",
    doctor: "Dr. E. Reed",
    tipo: "Laboratorio",
    estado: "Finalizada",
    estadoClase: "finalizada"
  },
  {
    id: 20,
    hora: "10:30 AM",
    fecha: "14/01/2026",
    paciente: "Lucía Méndez Aguilar",
    doctor: "Dr. A. Grant",
    tipo: "Urgencia",
    estado: "Programada",
    estadoClase: "programada"
  },

  {
    id: 21,
    hora: "11:00 AM",
    fecha: "11/12/2025",
    paciente: "Juan Pérez Mendoza",
    doctor: "Dr. A. Grant",
    tipo: "Revisión",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 22,
    hora: "11:30 AM",
    fecha: "23/12/2025",
    paciente: "Juan Pérez Mendoza",
    doctor: "Dr. E. Reed",
    tipo: "Limpieza Dental",
    estado: "Check-in",
    estadoClase: "checkin"
  },
  {
    id: 23,
    hora: "12:00 PM",
    fecha: "04/01/2026",
    paciente: "Juan Pérez Mendoza",
    doctor: "Dr. J. Kim",
    tipo: "Consulta General",
    estado: "Pagada",
    estadoClase: "pagada"
  },
  {
    id: 24,
    hora: "04:00 PM",
    fecha: "16/01/2026",
    paciente: "Juan Pérez Mendoza",
    doctor: "Dra. S. Connor",
    tipo: "Seguimiento",
    estado: "En consulta",
    estadoClase: "consulta"
  },

  {
    id: 25,
    hora: "09:00 AM",
    fecha: "13/12/2025",
    paciente: "Elena Torres Jiménez",
    doctor: "Dr. E. Reed",
    tipo: "Control",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 26,
    hora: "09:30 AM",
    fecha: "25/12/2025",
    paciente: "Elena Torres Jiménez",
    doctor: "Dr. J. Kim",
    tipo: "Urgencia",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 27,
    hora: "10:00 AM",
    fecha: "06/01/2026",
    paciente: "Elena Torres Jiménez",
    doctor: "Dr. A. Grant",
    tipo: "Laboratorio",
    estado: "Cancelada",
    estadoClase: "cancelada"
  },
  {
    id: 28,
    hora: "10:30 AM",
    fecha: "18/01/2026",
    paciente: "Elena Torres Jiménez",
    doctor: "Dra. S. Connor",
    tipo: "Revisión",
    estado: "Finalizada",
    estadoClase: "finalizada"
  },

  {
    id: 29,
    hora: "11:00 AM",
    fecha: "15/12/2025",
    paciente: "Miguel Sánchez Flores",
    doctor: "Dr. A. Grant",
    tipo: "Laboratorio",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 30,
    hora: "11:30 AM",
    fecha: "27/12/2025",
    paciente: "Miguel Sánchez Flores",
    doctor: "Dra. S. Connor",
    tipo: "Control",
    estado: "Finalizada",
    estadoClase: "finalizada"
  },
  {
    id: 31,
    hora: "12:00 PM",
    fecha: "08/01/2026",
    paciente: "Miguel Sánchez Flores",
    doctor: "Dr. E. Reed",
    tipo: "Consulta General",
    estado: "Check-in",
    estadoClase: "checkin"
  },
  {
    id: 32,
    hora: "04:00 PM",
    fecha: "20/01/2026",
    paciente: "Miguel Sánchez Flores",
    doctor: "Dr. J. Kim",
    tipo: "Limpieza Dental",
    estado: "Pagada",
    estadoClase: "pagada"
  },

  {
    id: 33,
    hora: "09:00 AM",
    fecha: "17/12/2025",
    paciente: "Patricia Nava Castañeda",
    doctor: "Dra. S. Connor",
    tipo: "Seguimiento",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 34,
    hora: "09:30 AM",
    fecha: "29/12/2025",
    paciente: "Patricia Nava Castañeda",
    doctor: "Dr. J. Kim",
    tipo: "Revisión",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 35,
    hora: "10:00 AM",
    fecha: "10/01/2026",
    paciente: "Patricia Nava Castañeda",
    doctor: "Dr. A. Grant",
    tipo: "Urgencia",
    estado: "No asistió",
    estadoClase: "noasistio"
  },
  {
    id: 36,
    hora: "10:30 AM",
    fecha: "22/01/2026",
    paciente: "Patricia Nava Castañeda",
    doctor: "Dr. E. Reed",
    tipo: "Control",
    estado: "Cancelada",
    estadoClase: "cancelada"
  },

  {
    id: 37,
    hora: "11:00 AM",
    fecha: "19/12/2025",
    paciente: "Esteban Martínez Ríos",
    doctor: "Dr. J. Kim",
    tipo: "Consulta General",
    estado: "Programada",
    estadoClase: "programada"
  },
  {
    id: 38,
    hora: "11:30 AM",
    fecha: "31/12/2025",
    paciente: "Esteban Martínez Ríos",
    doctor: "Dr. E. Reed",
    tipo: "Limpieza Dental",
    estado: "En consulta",
    estadoClase: "consulta"
  },
  {
    id: 39,
    hora: "12:00 PM",
    fecha: "24/01/2026",
    paciente: "Esteban Martínez Ríos",
    doctor: "Dra. S. Connor",
    tipo: "Laboratorio",
    estado: "Finalizada",
    estadoClase: "finalizada"
  },
  {
    id: 40,
    hora: "04:00 PM",
    fecha: "05/02/2026",
    paciente: "Esteban Martínez Ríos",
    doctor: "Dr. A. Grant",
    tipo: "Revisión",
    estado: "Pagada",
    estadoClase: "pagada"
  },
];

export default listaDeCitas;