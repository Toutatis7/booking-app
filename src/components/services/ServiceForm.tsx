
import { useState } from 'react'
import type { FormEvent } from 'react'

// Importamos los tipos de nuestros servicios.
import type { Service, ServiceStatus } from '../../types/service'

// Propiedades que recibirá el formulario.
type ServiceFormProps = {
  // Envía los datos del servicio al componente padre.
  onSave: (service: Omit<Service, 'id'>) => void

  // Permite cerrar el formulario sin guardar.
  onCancel: () => void

  // Servicio que queremos editar, si existe.
  initialService?: Service
}

// Formulario para crear o editar servicios.
function ServiceForm({
  onSave,
  onCancel,
  initialService,
}: ServiceFormProps) {

  // Guardamos el nombre del servicio.
  const [name, setName] = useState(initialService?.name ?? '')

  // Guardamos la descripción.
  const [description, setDescription] = useState(
    initialService?.description ?? ''
  )

  // Guardamos la duración en minutos.
  const [duration, setDuration] = useState(
    String(initialService?.duration ?? 30)
  )

  // Guardamos el precio.
  const [price, setPrice] = useState(
    String(initialService?.price ?? 0)
  )

  // Guardamos el estado del servicio.
  const [status, setStatus] = useState<ServiceStatus>(
    initialService?.status ?? 'Activo'
  )

  // Controlamos los mensajes de validación.
  const [formError, setFormError] = useState('')

  // Procesamos el envío del formulario.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {

    // Evitamos que el navegador recargue la página.
    event.preventDefault()

    // Eliminamos espacios innecesarios.
    const cleanName = name.trim()
    const cleanDescription = description.trim()

    // Convertimos los valores numéricos de texto a números.
    const numericDuration = Number(duration)
    const numericPrice = Number(price)

    // Comprobamos que el nombre no esté vacío.
    if (!cleanName) {
      setFormError('El nombre del servicio es obligatorio.')
      return
    }

    // Comprobamos que la descripción no esté vacía.
    if (!cleanDescription) {
      setFormError('La descripción del servicio es obligatoria.')
      return
    }

    // La duración debe ser un número entero mayor que cero.
    if (
      !Number.isInteger(numericDuration) ||
      numericDuration <= 0
    ) {
      setFormError('La duración debe ser un número entero mayor que cero.')
      return
    }

    // El precio debe ser un número válido y no negativo.
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setFormError('Introduce un precio válido igual o superior a cero.')
      return
    }

    // Enviamos los datos validados al componente padre.
    onSave({
      name: cleanName,
      description: cleanDescription,
      duration: numericDuration,
      price: numericPrice,
      status,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >

      {/* Encabezado del formulario. */}
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          {initialService ? 'Editar servicio' : 'Nuevo servicio'}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Introduce los datos del servicio.
        </p>
      </div>

      {/* Campo del nombre. */}
      <div>
        <label
          htmlFor="service-name"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Nombre del servicio
        </label>

        <input
          id="service-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ej. Consulta general"
          required
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* Campo de descripción. */}
      <div>
        <label
          htmlFor="service-description"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Descripción
        </label>

        <textarea
          id="service-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe en qué consiste el servicio"
          rows={3}
          required
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* Agrupamos duración y precio. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Campo de duración. */}
        <div>
          <label
            htmlFor="service-duration"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Duración (minutos)
          </label>

          <input
            id="service-duration"
            type="number"
            min="1"
            step="1"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Campo del precio. */}
        <div>
          <label
            htmlFor="service-price"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Precio (€)
          </label>

          <input
            id="service-price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

      </div>

      {/* Selector del estado. */}
      <div>
        <label
          htmlFor="service-status"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Estado del servicio
        </label>

        <select
          id="service-status"
          value={status}
          onChange={(event) => setStatus(event.target.value as ServiceStatus)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      {/* Mensaje de error, si existe. */}
      {formError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {formError}
        </p>
      )}

      {/* Botones de acción. */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {initialService ? 'Guardar cambios' : 'Crear servicio'}
        </button>

      </div>

    </form>
  )
}

export default ServiceForm
