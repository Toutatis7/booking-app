
import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { X } from 'lucide-react'

import type { Client } from '../../types/client'

// Definimos las propiedades que recibirá el formulario.
type ClientFormProps = {
  // onSave envía los datos del cliente al componente padre.
  // Omit elimina el id y createdAt porque los genera el padre.
  onSave: (client: Omit<Client, 'id' | 'createdAt'>) => void

  // onCancel permite cerrar el formulario sin guardar.
  onCancel: () => void

  // initialClient contiene los datos del cliente que queremos editar.
  // Es opcional porque al crear un cliente todavía no existe.
  initialClient?: Client

  // Recibe el listado de clientes registrados.
  // Lo necesitamos para comprobar si un correo ya esta utilizado.
  existingClients: Client[]
}

// Componente reutilizable para crear y editar clientes.
function ClientForm({
  onSave,
  onCancel,
  initialClient,
  existingClients,
}: ClientFormProps) {

  // Inicializamos el nombre con los datos existentes si estamos editando.
  // Si estamos creando un cliente, el campo comienza vacío.
  const [name, setName] = useState(initialClient?.name ?? '')

  // Inicializamos el correo electrónico.
  const [email, setEmail] = useState(initialClient?.email ?? '')

  // Inicializamos el teléfono.
  const [phone, setPhone] = useState(initialClient?.phone ?? '')

  // Guardamos aquí los posibles mensajes de validación.
  const [formError, setFormError] = useState('')

  // Esta función se ejecuta cuando enviamos el formulario.
  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {

    // Evitamos que el navegador recargue la página al enviar el formulario.
    event.preventDefault()

    // Eliminamos espacios al principio y al final de los datos.
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanPhone = phone.trim()

    // Comprobamos que todos los campos tengan contenido.
    if (!cleanName || !cleanEmail || !cleanPhone) {
      setFormError('Todos los campos son obligatorios.')
      return
    }

    // Expresión regular para comprobar el formato básico del correo.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Si el correo no cumple el formato, mostramos un error.
    if (!emailRegex.test(cleanEmail)) {
      setFormError('Introduce un correo electrónico válido.')
      return
    }
    // Comprobamos si otro cliente ya utiliza este correo electronico.
    // Convertimos los correos a minusculas para evitar duplicados
    // aunque uno este con mayusculas.
    const emailAlreadyExists = existingClients.some((client) => {
      return (
        client.email.toLowerCase() === cleanEmail &&
        client.id !== initialClient?.id // Permitimos que el cliente actual mantenga su correo.
      )
    })

    // Si encontramos otro cliente con el mismo correo,
    // mostramos un mensaje y detenemos el envio del formulario.
    if (emailAlreadyExists) {
      setFormError('Ya existe un cliente con este correo electrónico.')
      return
    }


    // Expresión regular que admite entre 9 y 15 dígitos.
    const phoneRegex = /^\d{9,15}$/

    // Comprobamos que el teléfono tenga una longitud válida.
    if (!phoneRegex.test(cleanPhone)) {
      setFormError('El teléfono debe contener entre 9 y 15 dígitos.')
      return
    }

    // Si todas las comprobaciones son correctas, limpiamos el error.
    setFormError('')

    // Enviamos los datos al componente padre.
    // El padre decidirá si crea un cliente o actualiza uno existente.
    onSave({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
    })
  }

  // Comprobamos si el formulario está trabajando en modo edición.
  const isEditing = Boolean(initialClient)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Encabezado dinámico según el modo del formulario. */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? 'Editar cliente' : 'Nuevo cliente'}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {isEditing
              ? 'Modifica los datos del cliente.'
              : 'Introduce los datos del nuevo cliente.'}
          </p>
        </div>

        {/* Cerramos el formulario sin guardar cambios. */}
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Cerrar formulario"
        >
          <X size={20} />
        </button>
      </div>

      {/* Formulario principal. */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Mostramos este bloque solamente cuando existe un error. */}
        {formError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {formError}
          </div>
        )}

        {/* Organizamos los campos en dos columnas en pantallas grandes. */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Campo del nombre. */}
          <div className="space-y-2">
            <label
              htmlFor="client-name"
              className="text-sm font-medium text-slate-700"
            >
              Nombre completo
            </label>

            <input
              id="client-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Laura Martínez"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Campo del correo electrónico. */}
          <div className="space-y-2">
            <label
              htmlFor="client-email"
              className="text-sm font-medium text-slate-700"
            >
              Correo electrónico
            </label>

            <input
              id="client-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="cliente@email.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Campo del teléfono. */}
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="client-phone"
              className="text-sm font-medium text-slate-700"
            >
              Teléfono
            </label>

            <input
              id="client-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="612345678"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Botones para cancelar o guardar. */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          {/* Cancelamos la operación y cerramos el formulario. */}
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancelar
          </button>

          {/* El texto cambia según estemos creando o editando. */}
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {isEditing ? 'Guardar cambios' : 'Guardar cliente'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClientForm
