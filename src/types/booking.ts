
// Estados posibles de una reserva.
export type BookingStatus =
  | 'Confirmada'
  | 'Pendiente'
  | 'Cancelada'

// Estructura de una reserva.
export type Booking = {
  id: number
  client: string
  service: string
  date: string
  time: string
  status: BookingStatus
}
