
// Importamos el tipo Service para comprobar
// que todos los servicios tienen la estructura correcta.
import type { Service } from '../types/service'

// Servicios iniciales que tendrá nuestra aplicación.
// Se utilizarán cuando todavía no existan servicios guardados.
export const initialServices: Service[] = [

  {
    // Identificador único del servicio.
    id: 1,

    // Nombre del servicio.
    name: 'Consulta general',

    // Descripción del servicio.
    description: 'Consulta inicial para conocer las necesidades del cliente.',

    // Duración expresada en minutos.
    duration: 30,

    // Precio expresado en euros.
    price: 45,

    // Estado del servicio.
    status: 'Activo',
  },

  {
    id: 2,
    name: 'Revisión',
    description: 'Revisión y seguimiento del estado del cliente.',
    duration: 45,
    price: 60,
    status: 'Activo',
  },

  {
    id: 3,
    name: 'Seguimiento',
    description: 'Consulta de seguimiento y valoración de resultados.',
    duration: 20,
    price: 30,
    status: 'Activo',
  },

  {
    id: 4,
    name: 'Evaluación inicial',
    description: 'Evaluación inicial antes de comenzar un tratamiento o servicio.',
    duration: 60,
    price: 75,
    status: 'Inactivo',
  },

]
