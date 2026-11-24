
// Estados posibles de una reserva.
export type BookingStatus =
  | 'Confirmada'
  | 'Pendiente'
  | 'Cancelada'

// Estructura de una reserva.
export type Booking = {
  // Identificador único de la reserva.
  id: number

  // Identificador del cliente registrado.
  // Es opcional temporalmente para mantener la compatibilidad
  // con las reservas antiguas que no tienen este dato.
  clientId?: number

  // Nombre del cliente.
  // Lo mantenemos para conservar las reservas antiguas
  // y mostrar el nombre en los listados.
  client: string

  // Servicio contratado o solicitado.
  service: string

// Identificador del servicio asociado a la reserva.
// Es opcional para mantener la compatibilidad con reservas antiguas.
serviceId?: number

  // Fecha de la reserva en formato YYYY-MM-DD.
  date: string

  // Hora de la reserva.
  time: string

  // Estado actual de la reserva.
  status: BookingStatus
}
