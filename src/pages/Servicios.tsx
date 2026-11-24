
import { useState } from 'react'

// Importamos el tipo Service.
import type { Service } from '../types/service'

// Importamos las reservas iniciales.
import { initialBookings } from '../data/bookings'

// Importamos la función que recupera las reservas guardadas.
import { getStoredBookings } from '../services/bookingStorage'

// Importamos los servicios iniciales.
import { initialServices } from '../data/services'

// Importamos las funciones de almacenamiento.
import {
  getStoredServices,
  saveServices,
} from '../services/serviceStorage'

// Iconos para las acciones.
import { Plus, Pencil, Trash2 } from 'lucide-react'

// Formulario para crear o editar servicios.
import ServiceForm from '../components/services/ServiceForm'

// Página principal de gestión de servicios.
function Servicios() {

  // Controla si el formulario está visible.
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Guarda el servicio que estamos editando.
  // Si vale null, significa que estamos creando uno nuevo.
  const [editingService, setEditingService] = useState<Service | null>(null)

  // Cargamos los servicios guardados en el navegador.
  // Si todavía no existen, utilizamos los servicios iniciales.
  const [services, setServices] = useState<Service[]>(() => {
    return getStoredServices() ?? initialServices
  })

  // Actualiza el estado y guarda los servicios en localStorage.
  function handleSaveServices(updatedServices: Service[]) {

    // Actualizamos el estado de React.
    setServices(updatedServices)

    // Persistimos los cambios.
    saveServices(updatedServices)
  }

  // Prepara el formulario para crear un servicio.
  function handleOpenCreateForm() {

    // Indicamos que no estamos editando ningún servicio.
    setEditingService(null)

    // Mostramos el formulario.
    setIsFormOpen(true)
  }

  // Prepara el formulario para editar un servicio existente.
  function handleOpenEditForm(service: Service) {

    // Guardamos el servicio seleccionado.
    setEditingService(service)

    // Mostramos el formulario.
    setIsFormOpen(true)
  }

  // Procesa el guardado, tanto al crear como al editar.
  function handleSubmitService(serviceData: Omit<Service, 'id'>) {

    // Comprobamos si existe un servicio que estamos editando.
    if (editingService) {

      // Recorremos los servicios y sustituimos el que estamos editando.
      const updatedServices = services.map((service) =>
        service.id === editingService.id
          ? { ...service, ...serviceData }
          : service
      )

      // Guardamos la lista actualizada.
      handleSaveServices(updatedServices)

    } else {

      // Calculamos un identificador superior a los existentes.
      const newId = Math.max(0, ...services.map((service) => service.id)) + 1

      // Construimos el nuevo servicio.
      const newService: Service = {
        id: newId,
        ...serviceData,
      }

      // Añadimos el nuevo servicio al listado.
      handleSaveServices([...services, newService])
    }

    // Cerramos el formulario después de guardar.
    setIsFormOpen(false)

    // Limpiamos el servicio seleccionado.
    setEditingService(null)
  }

  // Cancela el formulario sin guardar los cambios.
  function handleCancelForm() {

    // Cerramos el formulario.
    setIsFormOpen(false)

    // Limpiamos el servicio seleccionado.
    setEditingService(null)
  }

  // Elimina un servicio solamente si no tiene reservas asociadas.
  function handleDeleteService(service: Service) {

    // Recuperamos las reservas guardadas.
    // Si todavía no existen, utilizamos las reservas iniciales.
    const bookings = getStoredBookings() ?? initialBookings
    // Comprobamos si alguna reserva utiliza este servicio.
    const hasBookings = bookings.some((booking) => {

      // Primero comprobamos la relación mediante el identificador.
      if (booking.serviceId === service.id) {
        return true
      }

      // Si es una reserva antigua sin serviceId,
      // comprobamos la relación mediante el nombre.
      if (
        !booking.serviceId &&
        booking.service === service.name
      ) {
        return true
      }

      // Si no existe ninguna coincidencia, permitimos continuar.
      return false
    })

    // Si existen reservas asociadas, impedimos la eliminación.
    if (hasBookings) {

      // Informamos al usuario del motivo.
      window.alert(
        `No puedes eliminar "${service.name}" porque tiene reservas asociadas.`
      )

      // Detenemos la operación.
      return
    }

    // Solicitamos confirmación antes de eliminar.
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar el servicio "${service.name}"?`
    )

    // Si el usuario cancela, detenemos la operación.
    if (!confirmed) {
      return
    }

    // Creamos una lista sin el servicio seleccionado.
    const updatedServices = services.filter(
      (item) => item.id !== service.id
    )

    // Actualizamos React y guardamos los cambios.
    handleSaveServices(updatedServices)
  }

  return (
    <section className="space-y-6">

      {/* Encabezado de la página. */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Título y descripción. */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Servicios
          </h1>

          <p className="mt-2 text-slate-500">
            Configura los servicios, sus duraciones y disponibilidad.
          </p>
        </div>

        {/* Botón para abrir el formulario de creación. */}
        <button
          type="button"
          onClick={handleOpenCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Nuevo servicio
        </button>

      </div>

      {/* Formulario para crear o editar servicios. */}
      {isFormOpen && (
        <ServiceForm
          key={editingService?.id ?? 'new'}
          initialService={editingService ?? undefined}
          onSave={handleSubmitService}
          onCancel={handleCancelForm}
        />
      )}

      {/* Resumen de servicios registrados. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Total de servicios. */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total de servicios
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {services.length}
          </p>
        </div>

        {/* Servicios activos. */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Servicios activos
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {services.filter((service) => service.status === 'Activo').length}
          </p>
        </div>

        {/* Servicios inactivos. */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Servicios inactivos
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-500">
            {services.filter((service) => service.status === 'Inactivo').length}
          </p>
        </div>

      </div>

      {/* Tabla de servicios. */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Cabecera de la tabla. */}
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-800">
            Listado de servicios
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Servicios disponibles en la aplicación.
          </p>
        </div>

        {/* Contenedor con desplazamiento horizontal para móviles. */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px] text-left">

            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Servicio
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Duración
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Precio
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Estado
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Acciones
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {services.map((service) => (

                <tr key={service.id} className="hover:bg-slate-50">

                  {/* Nombre y descripción. */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">
                      {service.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {service.description}
                    </p>
                  </td>

                  {/* Duración del servicio. */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {service.duration} min
                  </td>

                  {/* Precio del servicio. */}
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">
                    {service.price.toFixed(2)} €
                  </td>

                  {/* Estado del servicio. */}
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        service.status === 'Activo'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {service.status}
                    </span>
                  </td>

                  {/* Acción para editar el servicio. */}
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleOpenEditForm(service)}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    {/* Boton para eliminar el servicio. */}
                    <button
                      type="button"
                      onClick={() => handleDeleteService(service)}
                      className="inline-flex items-center gap-2 rounded-lg px-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Eliminar
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </div>

    </section>
  )
}

export default Servicios
