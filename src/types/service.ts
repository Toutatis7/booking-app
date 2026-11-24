
// Estados posibles de un servicio.
export type ServiceStatus = 'Activo' | 'Inactivo'

// Estructura de datos que tendrá cada servicio.
export type Service = {
  // Identificador único del servicio.
  id: number

  // Nombre que identifica al servicio.
  name: string

  // Descripción de lo que incluye el servicio.
  description: string

  // Duración del servicio expresada en minutos.
  duration: number

  // Precio del servicio expresado en euros.
  price: number

  // Indica si el servicio está disponible.
  status: ServiceStatus
}
