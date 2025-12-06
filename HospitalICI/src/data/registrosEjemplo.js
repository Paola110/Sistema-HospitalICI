export const registrosEjemplo = [
  {
    id: "#A-0045A",
    usuario: "Andrea Torres",
    puesto: "Administradora",
    accion: "actualizar",
    fecha: "2025-01-22",
    hora: "10:32",
    ip: "192.168.0.14",
    entidad: {
      tipo: "Paciente",
      nombre: "María Juana López",
      id: 1,
    },
    descripcion: "Actualización de datos de contacto del paciente.",
    detalles: {
      telefono: { antes: "449 910 98 81", despues: "449 910 11 22" },
      correo: {
        antes: "maria.juana@gmail.com",
        despues: "m.juana@clinicadental.mx",
      },
    },
  },

  {
    id: "#A-0046B",
    usuario: "Andrea Torres",
    puesto: "Administradora",
    accion: "crear",
    fecha: "2025-01-22",
    hora: "11:10",
    ip: "192.168.0.14",
    entidad: {
      tipo: "Paciente",
      nombre: "Elena Torres Jiménez",
      id: 7,
    },
    descripcion: "Registro de nuevo paciente en el sistema.",
    detalles: {
      creado: {
        nombres: "Elena",
        apellidos: "Torres Jiménez",
        edad: 45,
        telefono: "449 778 34 15",
        correo: "elena.torres@gmail.com",
      },
    },
  },

  // === Usa Dr. Kim ===
  {
    id: "#A-0047C",
    usuario: "Dr. James Kim",
    puesto: "Médico",
    accion: "actualizar",
    fecha: "2025-01-23",
    hora: "09:45",
    ip: "192.168.0.21",
    entidad: {
      tipo: "Doctor",
      nombre: "Dr. James Kim",
      id: 3,
    },
    descripcion: "Actualización de información del consultorio del doctor.",
    detalles: {
      consultorio: {
        antes: "Consultorio 5",
        despues: "Consultorio 2 - Piso 1",
      },
    },
  },

  {
    id: "#A-0048D",
    usuario: "Andrea Torres",
    puesto: "Administradora",
    accion: "eliminar",
    fecha: "2025-01-23",
    hora: "12:20",
    ip: "192.168.0.14",
    entidad: {
      tipo: "Paciente",
      nombre: "Miguel Sánchez Flores",
      id: 8,
    },
    descripcion: "Eliminación del registro del paciente por duplicado.",
    detalles: {
      motivo: "Duplicado detectado en el sistema.",
      idDuplicado: 12,
    },
  },

  // === Usa Dra. Reed ===
  {
    id: "#A-0049E",
    usuario: "Dra. Elizabeth Reed",
    puesto: "Médica",
    accion: "actualizar",
    fecha: "2025-01-24",
    hora: "08:55",
    ip: "192.168.0.22",
    entidad: {
      tipo: "Paciente",
      nombre: "Carlos Ramírez Soto",
      id: 2,
    },
    descripcion: "Actualización de edad del paciente tras revisión de expediente.",
    detalles: {
      edad: { antes: 34, despues: 35 },
    },
  },

  // === Usa Dra. Connor ===
  {
    id: "#A-0050A",
    usuario: "Andrea Torres",
    puesto: "Administradora",
    accion: "crear",
    fecha: "2025-01-24",
    hora: "13:18",
    ip: "192.168.0.14",
    entidad: {
      tipo: "Doctor",
      nombre: "Dra. Sarah Connor",
      id: 2,
    },
    descripcion: "Alta de doctora en módulo de personal médico.",
    detalles: {
      creado: {
        nombres: "Sarah",
        apellidos: "Connor",
        especialidad: "Pediatría",
        cedula: "CED-4044556",
        consultorio: "Consultorio 1 - Piso 2",
      },
    },
  },

  {
    id: "#A-0051B",
    usuario: "Recep. Mariana Flores",
    puesto: "Recepcionista",
    accion: "actualizar",
    fecha: "2025-01-25",
    hora: "16:47",
    ip: "192.168.0.33",
    entidad: {
      tipo: "Paciente",
      nombre: "Patricia Nava Castañeda",
      id: 9,
    },
    descripcion:
      "Actualización de antecedentes familiares en el expediente clínico.",
    detalles: {
      antecedentesFamiliares: {
        antes: ["Diabetes"],
        despues: ["Diabetes", "Hipertensión"],
      },
    },
  },

  // === Nuevos 7 registros ===

  {
    id: "#A-0052C",
    usuario: "Dr. Andrew Grant",
    puesto: "Médico",
    accion: "crear",
    fecha: "2025-01-26",
    hora: "11:22",
    ip: "192.168.0.25",
    entidad: {
      tipo: "Paciente",
      nombre: "Luis Aguilar Romero",
      id: 11,
    },
    descripcion: "Registro de nuevo paciente para valoración dermatológica.",
    detalles: {
      creado: {
        nombres: "Luis",
        apellidos: "Aguilar Romero",
        edad: 29,
        telefono: "449 881 11 55",
        correo: "l.aguilar@gmail.com",
      },
    },
  },

  {
    id: "#A-0053D",
    usuario: "Recep. Mariana Flores",
    puesto: "Recepcionista",
    accion: "actualizar",
    fecha: "2025-01-26",
    hora: "14:10",
    ip: "192.168.0.33",
    entidad: {
      tipo: "Paciente",
      nombre: "Elisa Juárez Torres",
      id: 14,
    },
    descripcion: "Actualización de número telefónico del paciente.",
    detalles: {
      telefono: { antes: "449 556 12 46", despues: "449 556 77 88" },
    },
  },

  // === Usa Dr. Kim ===
  {
    id: "#A-0054E",
    usuario: "Dr. James Kim",
    puesto: "Médico",
    accion: "eliminar",
    fecha: "2025-01-26",
    hora: "16:40",
    ip: "192.168.0.21",
    entidad: {
      tipo: "Doctor",
      nombre: "Dr. Andrew Grant",
      id: 4,
    },
    descripcion: "Eliminación de registro temporal por actualización.",
    detalles: {
      motivo: "Se migró la información a un nuevo formato.",
    },
  },

  {
    id: "#A-0055F",
    usuario: "Andrea Torres",
    puesto: "Administradora",
    accion: "crear",
    fecha: "2025-01-27",
    hora: "09:18",
    ip: "192.168.0.14",
    entidad: {
      tipo: "Doctor",
      nombre: "Dr. Hugo Robles",
      id: 6,
    },
    descripcion: "Registro de nuevo médico general.",
    detalles: {
      creado: {
        nombres: "Hugo",
        apellidos: "Robles Vega",
        especialidad: "General",
        cedula: "CED-8934431",
        consultorio: "Consultorio 3 - Piso 1",
      },
    },
  },

  {
    id: "#A-0056G",
    usuario: "Recep. Mariana Flores",
    puesto: "Recepcionista",
    accion: "actualizar",
    fecha: "2025-01-27",
    hora: "13:30",
    ip: "192.168.0.33",
    entidad: {
      tipo: "Paciente",
      nombre: "Nadia Fernández Olvera",
      id: 15,
    },
    descripcion: "Corrección de nombre en expediente.",
    detalles: {
      nombre: {
        antes: "Nadia Fernádez Olvera",
        despues: "Nadia Fernández Olvera",
      },
    },
  },

  // === Usa Dra. Reed ===
  {
    id: "#A-0057H",
    usuario: "Dra. Elizabeth Reed",
    puesto: "Médica",
    accion: "actualizar",
    fecha: "2025-01-27",
    hora: "17:50",
    ip: "192.168.0.22",
    entidad: {
      tipo: "Paciente",
      nombre: "Diego Sandoval León",
      id: 16,
    },
    descripcion: "Actualización de diagnóstico tras nueva valoración.",
    detalles: {
      diagnostico: {
        antes: "Gripe estacional",
        despues: "Sinusitis aguda",
      },
    },
  },

  {
    id: "#A-0058I",
    usuario: "Andrea Torres",
    puesto: "Administradora",
    accion: "crear",
    fecha: "2025-01-28",
    hora: "10:05",
    ip: "192.168.0.14",
    entidad: {
      tipo: "Paciente",
      nombre: "Rodrigo Gómez Sierra",
      id: 17,
    },
    descripcion: "Alta de paciente nuevo en el sistema.",
    detalles: {
      creado: {
        nombres: "Rodrigo",
        apellidos: "Gómez Sierra",
        edad: 51,
        telefono: "449 920 55 84",
        correo: "rodrigo.gs@gmail.com",
      },
    },
  },
];

export default registrosEjemplo;
