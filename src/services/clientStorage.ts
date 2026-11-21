
import type { Client } from '../types/client'

// Clave que utilizaremos para identificar los clientes
// dentro del almacenamiento local del navegador.
const STORAGE_KEY = 'booking-app-clients'

// Recupera los clientes guardados en localStorage.
export function getStoredClients(): Client[] | null {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY)

    // Si todavía no existen clientes guardados,
    // devolvemos null.
    if (storedData === null) {
      return null
    }

    // Convertimos el texto JSON en un valor JavaScript.
    const parsedData: unknown = JSON.parse(storedData)

    // Comprobamos que los datos recuperados sean un array.
    if (!Array.isArray(parsedData)) {
      return null
    }

    return parsedData as Client[]
  } catch (error) {
    console.error('Error al recuperar los clientes:', error)
    return null
  }
}

// Guarda el listado completo de clientes en localStorage.
export function saveClients(clients: Client[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(clients)
    )
  } catch (error) {
    console.error('Error al guardar los clientes:', error)
  }
}
