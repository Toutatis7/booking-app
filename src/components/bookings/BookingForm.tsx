
import { useState } from 'react'
import type { SyntheticEvent } from 'react'

import type { Booking, BookingStatus } from '../../types/booking'

// Importamos el tipo Client para trabajar con los clientes registrados.
import type { Client } from '../../types/client'


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

  // Listado de clientes registrados en la aplicación.
  existingClients: Client[]
}

function BookingForm({
    onSave,
    onCancel,
    initialBooking,
    existingBookings,
    existingClients,
}: BookingFormProps) {

    // Obtenemos la fecha actual en formato YYYY-MM-DD.
    function getTodayDate(): string {
      const today = new Date()

      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    }
    // Estados de los campos del formulario.
    // Inicializamos los campos con los datos de la reserva,
    // si estamos editando. Si es nueva, empezarán vacíos.
    // Buscamos el cliente asociado a la reserva que estamos editando.
    // Primero intentamos localizarlo mediante clientId.
    // Si es una reserva antigua, intentamos encontrarlo por su nombre.
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

    // Guardamos el identificador del cliente seleccionado.
    // Los elementos select trabajan con valores de tipo string.
    const [clientId, setClientId] = useState(
      initialClient ? String(initialClient.id) : ''
    )
    const [service, setService] = useState(initialBooking?.service ?? '')
    const [date, setDate] = useState(initialBooking?.date ?? '')
    const [time, setTime] = useState(initialBooking?.time ?? '')
    const [status, setStatus] = useState<BookingStatus>(
    initialBooking?.status ?? 'Pendiente'
    )

    // Almacena los posibles errores de validacion.
    const [formError, setFormError ] = useState('')

    // Procesamos el envío del formulario.
    function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
      event.preventDefault()

      // Limpiamos los espacios innecesarios del servicio.
      const cleanService = service.trim()

      // Buscamos el cliente seleccionado utilizando su identificador.
      const selectedClient = existingClients.find(
        (client) => client.id === Number(clientId)
      )

      // Comprobamos que se haya seleccionado un cliente registrado.
      if (!selectedClient) {
        setFormError('Debes seleccionar un cliente registrado.')
        return
      }

      // Comprobamos que el servicio no esté vacío.
      if (!cleanService) {
        setFormError('El servicio es obligatorio.')
        return
      }

      // Comprobamos que la fecha no esté vacía.
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
      const hasConflict = existingBookings.some((booking) => {
        return (
          booking.date === date &&
          booking.time === time &&
          booking.id !== initialBooking?.id
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

        // También guardamos su nombre para mostrarlo en los listados.
        client: selectedClient.name,

        service: cleanService,
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
        <div>
          <label
            htmlFor="service"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Servicio
          </label>

          <input
            id="service"
            type="text"
            value={service}
            onChange={(event) => setService(event.target.value)}
            placeholder="Ej. Consulta general"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
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
