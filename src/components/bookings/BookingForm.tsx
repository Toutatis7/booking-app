
import { useState } from 'react'


import type { SyntheticEvent } from 'react'

// Importamos los tipos necesarios para las reservas.
import type { Booking, BookingStatus } from '../../types/booking'

// Importamos el tipo Client.
import type { Client } from '../../types/client'

// Importamos el tipo Service.
import type { Service } from '../../types/service'

// Importamos los servicios iniciales.
import { initialServices } from '../../data/services'

// Importamos la función que recupera los servicios guardados.
import { getStoredServices } from '../../services/serviceStorage'

// Propiedades que recibirá nuestro formulario.
type BookingFormProps = {
  // Envía los datos de la reserva al componente padre.
  onSave: (booking: Omit<Booking, 'id'>) => void

  // Permite cerrar el formulario sin guardar.
  onCancel: () => void

  // Contiene la reserva que estamos editando, si existe.
  initialBooking?: Booking

  // Reservas existentes para comprobar conflictos de horario.
  existingBookings: Booking[]

  // Listado de clientes registrados.
  existingClients: Client[]

  // Listado de servicios registrados.
  existingServices: Service[]
}

// Convierte una hora HH:MM en minutos desde medianoche.
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

function BookingForm({
  onSave,
  onCancel,
  initialBooking,
  existingBookings,
  existingClients,
  existingServices,
}: BookingFormProps) {

  // Obtenemos la fecha actual en formato YYYY-MM-DD.
  function getTodayDate(): string {
    const today = new Date()

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // Buscamos el cliente asociado a la reserva que estamos editando.
  // Primero intentamos localizarlo mediante clientId.
  // Si es una reserva antigua, buscamos por su nombre.
  const initialClient = initialBooking
    ? existingClients.find(
        (client) => client.id === initialBooking.clientId
      ) ??
      existingClients.find(
        (client) =>
          client.name.trim().toLowerCase() ===
          initialBooking.client.trim().toLowerCase()
      )
    : undefined

  // Recuperamos los servicios guardados en localStorage.
  const storedServices = getStoredServices()

  // Utilizamos los servicios recibidos desde el componente padre.
  // Si no hay ninguno, recurrimos a localStorage o a los iniciales.
  const servicesToUse = existingServices.length > 0
    ? existingServices
    : storedServices ?? initialServices

  // Buscamos el servicio de la reserva que estamos editando.
  // Primero utilizamos serviceId y, si es una reserva antigua,
  // intentamos localizarlo mediante su nombre.
  const initialService = initialBooking
    ? servicesToUse.find(
        (item) => item.id === initialBooking.serviceId
      ) ??
      servicesToUse.find(
        (item) => item.name === initialBooking.service
      )
    : undefined

  // Mostramos los servicios activos.
  // Si editamos una reserva antigua con un servicio inactivo,
  // también lo mantenemos disponible para no perder su selección.
  const availableServices = servicesToUse.filter(
    (item) =>
      item.status === 'Activo' ||
      item.id === initialService?.id
  )

  // Guardamos el identificador del cliente seleccionado.
  // Los elementos select trabajan con valores de tipo string.
  const [clientId, setClientId] = useState(
    initialClient ? String(initialClient.id) : ''
  )

  // Guardamos el identificador del servicio seleccionado.
  const [serviceId, setServiceId] = useState(
    initialService ? String(initialService.id) : ''
  )

  // Estados de fecha, hora y estado de la reserva.
  const [date, setDate] = useState(initialBooking?.date ?? '')
  const [time, setTime] = useState(initialBooking?.time ?? '')

  const [status, setStatus] = useState<BookingStatus>(
    initialBooking?.status ?? 'Pendiente'
  )

  // Almacenamos los posibles errores de validación.
  const [formError, setFormError] = useState('')

  // Procesamos el envío del formulario.
  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    // Buscamos el cliente seleccionado mediante su identificador.
    const selectedClient = existingClients.find(
      (client) => client.id === Number(clientId)
    )

    // Comprobamos que se haya seleccionado un cliente registrado.
    if (!selectedClient) {
      setFormError('Debes seleccionar un cliente registrado.')
      return
    }

    // Buscamos el servicio seleccionado mediante su identificador.
    const selectedService = servicesToUse.find(
      (item) => item.id === Number(serviceId)
    )

    // Comprobamos que se haya seleccionado un servicio válido.
    if (!selectedService) {
      setFormError('Debes seleccionar un servicio.')
      return
    }

    // Comprobamos que el servicio esté activo.
    // Permitimos conservar el servicio inactivo de una reserva
    // que ya existía antes de editarla.
    if (
      selectedService.status !== 'Activo' &&
      selectedService.id !== initialService?.id
    ) {
      setFormError('El servicio seleccionado no está activo.')
      return
    }

    // Comprobamos que se haya seleccionado una fecha.
    if (!date) {
      setFormError('Debes seleccionar una fecha.')
      return
    }

    // Comprobamos que la fecha no sea anterior a hoy.
    if (date < getTodayDate()) {
      setFormError('No puedes crear una reserva en una fecha pasada.')
      return
    }

    // Comprobamos que se haya seleccionado una hora.
    if (!time) {
      setFormError('Debes seleccionar una hora.')
      return
    }

    // Comprobamos si ya existe otra reserva en esa fecha y hora.
    // Comprobamos si la nueva reserva se solapa con otra existente.
    const newBookingStart = timeToMinutes(time)

    // Calculamos cuándo termina la nueva reserva.
    const newBookingEnd = newBookingStart + selectedService.duration

    // Comprobamos que la reserva no termine despues de medianoche.
    if (newBookingEnd > 24 * 60) {
      setFormError(
        'La reserva no puede terminar después de medianoche.'
      )
      return
    }

    const hasConflict = existingBookings.some((booking) => {

      // Ignoramos las reservas de otras fechas.
      if (booking.date !== date) {
        return false
      }

      // Ignoramos la propia reserva cuando estamos editándola.
      if (booking.id === initialBooking?.id) {
        return false
      }

      // Las reservas canceladas no bloquean horarios.
      if (booking.status === 'Cancelada') {
        return false
      }

      // Buscamos el servicio asociado a la reserva existente.
      const existingService = servicesToUse.find(
        (item) => item.id === booking.serviceId
      ) ?? servicesToUse.find(
        (item) => item.name === booking.service
      )

      // Si no conocemos la duración, no podemos calcular el solapamiento.
      if (!existingService) {
        return false
      }

      // Calculamos el intervalo horario de la reserva existente.
      const existingBookingStart = timeToMinutes(booking.time)
      const existingBookingEnd =
        existingBookingStart + existingService.duration

      // Comprobamos si ambos intervalos horarios se solapan.
      return (
        newBookingStart < existingBookingEnd &&
        newBookingEnd > existingBookingStart
      )
    })

    // Si existe otra reserva, detenemos el envío.
    if (hasConflict) {
      setFormError('Ya existe una reserva para esa fecha y hora.')
      return
    }

    // Limpiamos posibles errores anteriores.
    setFormError('')

    // Enviamos los datos de la reserva al componente padre.
    onSave({
      // Guardamos el identificador único del cliente.
      clientId: selectedClient.id,

      // Guardamos también su nombre para mostrarlo en los listados.
      client: selectedClient.name,

      // Guardamos el identificador único del servicio.
      serviceId: selectedService.id,

      // Guardamos su nombre para mostrarlo en los listados.
      service: selectedService.name,

      date,
      time,
      status,
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Cabecera */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">
          Nueva reserva
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Introduce los datos de la nueva cita.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {formError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {formError}
          </div>
        )}

        {/* Cliente */}
        <div>
          <label
            htmlFor="client"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Seleccionar cliente
          </label>

          <select
            id="client"
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            required
            disabled={existingClients.length === 0}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            {/* Opción inicial que obliga a seleccionar un cliente. */}
            <option value="">
              {existingClients.length === 0
                ? 'No hay clientes registrados'
                : 'Selecciona un cliente'}
            </option>

            {/* Generamos una opción por cada cliente registrado. */}
            {existingClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} — {client.email}
              </option>
            ))}
          </select>

          {/* Explicamos qué hacer si todavía no hay clientes. */}
          {existingClients.length === 0 && (
            <p className="mt-2 text-sm text-orange-600">
              Primero debes registrar un cliente en el apartado Clientes.
            </p>
          )}
        </div>

        {/* Servicio */}
        {/** Servicio **/}
        <div>
          <label
            htmlFor="service"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Servicio
          </label>

          <select
            id="service"
            value={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
            required
            disabled={availableServices.length === 0}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            {/** Opción inicial del selector. **/}
            <option value="">
              {availableServices.length === 0
                ? 'No hay servicios disponibles'
                : 'Selecciona un servicio'}
            </option>

            {/** Generamos una opción por cada servicio disponible. **/}
            {availableServices.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {item.duration} min — {item.price} €
              </option>
            ))}
          </select>

          {/** Avisamos si no existen servicios activos. **/}
          {availableServices.length === 0 && (
            <p className="mt-2 text-sm text-orange-600">
              Primero debes registrar un servicio activo en el apartado Servicios.
            </p>
          )}
        </div>

        {/* Fecha y hora */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Fecha
            </label>

            <input
              id="date"
              type="date"
              min={getTodayDate()}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="time"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Hora
            </label>

            <input
              id="time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

        </div>

        {/* Estado */}
        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Estado de la reserva
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as BookingStatus)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Guardar reserva
          </button>

        </div>

      </form>

    </div>
  )
}

export default BookingForm
