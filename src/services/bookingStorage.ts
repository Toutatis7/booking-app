
import type { Booking } from '../types/booking'

// Importamos el tipo Client para poder relacionar reservas y clientes.
import type { Client } from '../types/client'

// Relaciona las reservas antiguas con los clientes registrados.
export function linkBookingsToClients(
  bookings: Booking[],
  clients: Client[]
): Booking[] {

  // Recorremos todas las reservas para comprobar si tienen cliente asociado.
  return bookings.map((booking) => {

    // Si la reserva ya tiene clientId, no necesitamos modificarla.
    if (booking.clientId !== undefined) {
      return booking
    }

    // Normalizamos el nombre de la reserva para comparar correctamente.
    const bookingClientName = booking.client.trim().toLowerCase()

    // Buscamos todos los clientes cuyo nombre coincide.
    const matchingClients = clients.filter((client) => {
      return client.name.trim().toLowerCase() === bookingClientName
    })

    // Solo asociamos el cliente cuando existe una única coincidencia.
    if (matchingClients.length === 1) {
      return {
        ...booking,
        clientId: matchingClients[0].id,
      }
    }

    // Si no hay coincidencias o hay varias, conservamos la reserva original.
    return booking
  })
}

// Clave con la que identificaremos nuestros datos.
const STORAGE_KEY = 'booking-app-reservations'

// Recupera las reservas almacenadas en el navegador.
export function getStoredBookings(): Booking[] | null {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY)

    // Si todavía no hay datos guardados, devolvemos null.
    if (storedData === null) {
      return null
    }

    // Convertimos el texto JSON en un array.
    const parsedData: unknown = JSON.parse(storedData)

    // Comprobamos que el contenido sea un array.
    if (!Array.isArray(parsedData)) {
      return null
    }

    return parsedData as Booking[]

  } catch (error) {
    console.error('Error al recuperar las reservas:', error)
    return null
  }
}

// Guarda las reservas en el navegador.
export function saveBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bookings)
    )
  } catch (error) {
    console.error('Error al guardar las reservas:', error)
  }
}
