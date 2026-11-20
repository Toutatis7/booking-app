
import type { Booking } from '../types/booking'

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
