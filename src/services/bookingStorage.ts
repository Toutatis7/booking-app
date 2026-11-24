
import type { Booking } from '../types/booking'

// Importamos el tipo Client para poder relacionar reservas y clientes.
import type { Client } from '../types/client'

// Importamos el tipo Service para relacionar reservas y servicios.
import type { Service } from '../types/service'

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

// Relaciona las reservas antiguas con los servicios registrados.
export function linkBookingsToServices(
  bookings: Booking[],
  services: Service[]
): Booking[] {

  // Recorremos todas las reservas.
  return bookings.map((booking) => {

    // Si ya tiene serviceId, conservamos la reserva.
    if (booking.serviceId !== undefined) {
      return booking
    }

    // Normalizamos el nombre del servicio de la reserva.
    const bookingServiceName = booking.service.trim().toLowerCase()

    // Buscamos servicios cuyo nombre coincida.
    const matchingServices = services.filter((service) => {
      return service.name.trim().toLowerCase() === bookingServiceName
    })

    // Solo asociamos el servicio si existe una coincidencia única.
    if (matchingServices.length === 1) {
      return {
        ...booking,
        serviceId: matchingServices[0].id,
      }
    }

    // Si no hay coincidencias o existen varias, conservamos la reserva.
    return booking
  })
}

// Carga las reservas y relaciona cada una con sus clientes y servicios.
export function getBookingsWithRelations(
  clients: Client[],
  services: Service[],
  initialBookings: Booking[]
): Booking[] {
  // Recuperamos las reservas guardadas o utilizamos las iniciales.
  const storedBookings = getStoredBookings()
  const bookingsToLoad = storedBookings ?? initialBookings

  // Relacionamos las reservas antiguas con los clientes registrados.
  const bookingsWithClients = linkBookingsToClients(
    bookingsToLoad,
    clients
  )

  // Relacionamos las reservas antiguas con los servicios registrados.
  const bookingsWithServices = linkBookingsToServices(
    bookingsWithClients,
    services
  )

  return bookingsWithServices
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
