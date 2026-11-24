
import type { Service } from '../types/service'

// Clave que utilizaremos para identificar los servicios
// almacenados en localStorage.
const STORAGE_KEY = 'booking-app-services'

// Recupera los servicios guardados en el navegador.
export function getStoredServices(): Service[] | null {

  // Comprobamos si existen datos guardados.
  const storedServices = localStorage.getItem(STORAGE_KEY)

  // Si no hay datos, devolvemos null.
  if (!storedServices) {
    return null
  }

  try {
    // Convertimos el texto JSON en un array de servicios.
    return JSON.parse(storedServices) as Service[]

  } catch (error) {

    // Mostramos el error si los datos no se pueden interpretar.
    console.error('Error al recuperar los servicios:', error)

    // Devolvemos null para indicar que no pudimos recuperar los datos.
    return null
  }
}

// Guarda el array de servicios en localStorage.
export function saveServices(services: Service[]): void {

  try {
    // Convertimos el array de servicios en texto JSON.
    const servicesJSON = JSON.stringify(services)

    // Guardamos los datos utilizando nuestra clave.
    localStorage.setItem(STORAGE_KEY, servicesJSON)

  } catch (error) {

    // Mostramos el error si no podemos guardar los datos.
    console.error('Error al guardar los servicios:', error)
  }
}
