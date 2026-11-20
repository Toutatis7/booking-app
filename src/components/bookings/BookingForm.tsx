
import { useState } from 'react'
import type { SyntheticEvent } from 'react'

import type { Booking, BookingStatus } from '../../types/booking'

// Propiedades que recibirá nuestro formulario.
type BookingFormProps = {
  onSave: (booking: Omit<Booking, 'id'>) => void
  onCancel: () => void
  initialBooking?: Booking
  existingBookings: Booking[]
}

function BookingForm({
    onSave,
    onCancel,
    initialBooking,
    existingBookings,
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
    const [client, setClient] = useState(initialBooking?.client ?? '')
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

      // Eliminamos los espacios innecesarios.
      const cleanClient = client.trim()
      const cleanService = service.trim()

      // Comprobamos que los campos de texto no estén vacíos.
      if (!cleanClient || !cleanService) {
        setFormError('El nombre del cliente y el servicio son obligatorios.')
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

      // Guardamos los datos validados.
      onSave({
        client: cleanClient,
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
            Nombre del cliente
          </label>

          <input
            id="client"
            type="text"
            value={client}
            onChange={(event) => setClient(event.target.value)}
            placeholder="Ej. Laura Martínez"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
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
