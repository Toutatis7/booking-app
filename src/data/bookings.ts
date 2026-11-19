
import type { Booking } from '../types/booking'

// Datos iniciales de ejemplo para nuestra aplicación.
export const initialBookings: Booking[] = [

  {
    id: 1,
    client: 'Laura Martínez',
    service: 'Consulta general',
    date: '2026-11-20',
    time: '09:00',
    status: 'Confirmada',
  },

  {
    id: 2,
    client: 'Carlos García',
    service: 'Revisión',
    date: '2026-11-20',
    time: '10:30',
    status: 'Pendiente',
  },

  {
    id: 3,
    client: 'María López',
    service: 'Sesión individual',
    date: '2026-11-21',
    time: '12:00',
    status: 'Confirmada',
  },

  {
    id: 4,
    client: 'Javier Sánchez',
    service: 'Consulta inicial',
    date: '2026-11-21',
    time: '09:30',
    status: 'Cancelada',
  },

  {
    id: 5,
    client: 'Ana Fernández',
    service: 'Revisión',
    date: '2026-11-22',
    time: '11:00',
    status: 'Confirmada',
  },

]
