import { useEffect, useState } from 'react'

import { CalendarDays, Clock, Users, Search, Plus, Trash2, } from 'lucide-react'

import type { Booking, BookingStatus } from '../types/booking'

import { initialBookings } from '../data/bookings'

import {
  getBookingsWithRelations,
  saveBookings,

} from '../services/bookingStorage'

import BookingForm from '../components/bookings/BookingForm'

import Toast from '../components/ui/Toast'

import type { ToastType } from '../components/ui/Toast'

// Importamos el tipo Client.
import type { Client } from '../types/client'

// Importamos el tipo Service.
import type { Service } from '../types/service'

// Importamos los servicios iniciales.
import { initialServices } from '../data/services'

// Importamos la función para recuperar los servicios guardados.
import { getStoredServices } from '../services/serviceStorage'

// Importamos las funciones para recuperar los clientes guardados.
import { getStoredClients } from '../services/clientStorage'

// Devuelve los estilos visuales según el estado.
function getStatusStyles(status: BookingStatus) {
  switch (status) {
    case 'Confirmada':
      return 'bg-green-50 text-green-700'

    case 'Pendiente':
      return 'bg-orange-50 text-orange-700'

    case 'Cancelada':
      return 'bg-red-50 text-red-700'
  }
}

function Reservas() {
  // Recuperamos primero los clientes registrados.
  // Necesitamos tenerlos disponibles antes de cargar las reservas.
  const [clients] = useState<Client[]>(() => {
    return getStoredClients() ?? []
  })

  // Recuperamos los servicios registrados en la aplicación.
  const [services] = useState<Service[]>(() => {
    // Si existen servicios guardados, los recuperamos.
    // Si todavía no hay datos guardados, utilizamos los iniciales.
    return getStoredServices() ?? initialServices
  })

  // Cargamos las reservas y relacionamos sus clientes y servicios.
  const [bookings, setBookings] = useState<Booking[]>(() =>
    getBookingsWithRelations(clients, services, initialBookings)
  )

  // Guardamos las reservas cuando cambian sus datos.
  useEffect(() => {

    // Persistimos las reservas en localStorage.
    saveBookings(bookings)

  }, [bookings])


  // Controla si mostramos el formulario.
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Guarda la reserva que estamos editando.
  // Si es null, estamos creando una reserva nueva.
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)

  // Texto introducido en el buscador.
  const [searchTerm, setSearchTerm] = useState('')

  // Estado seleccionado en el filtro.
  const [statusFilter, setStatusFilter] = useState('Todas')

  // Controla la notificación que se muestra.
  const [toast, setToast] = useState<{
    message: string
    type: ToastType
  } | null>(null)

  // Filtramos las reservas según la búsqueda y el estado.
  const filteredBookings = bookings.filter((booking) => {

    const matchesSearch =
      booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'Todas' || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })
  
  // Añade una nueva reserva a la lista.
  function handleSaveBooking(newBooking: Omit<Booking, 'id'>) {

    setBookings((currentBookings) => {

      // Calculamos el siguiente identificador disponible.
      const nextId =
        Math.max(0, ...currentBookings.map((booking) => booking.id)) + 1

      // Añadimos la nueva reserva.
      return [
        ...currentBookings,
        {
          ...newBooking,
          id: nextId,
        },
      ]
    })

    // Cerramos el formulario después de guardar.
    setIsFormOpen(false)

    setToast({
      message: 'Reserva creada correctamente',
      type: 'success',
    })
  }

  // Actualiza los datos de una reserva existente.
  function handleUpdateBooking(updatedData: Omit<Booking, 'id'>) {

    if (!editingBooking) return

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === editingBooking.id
          ? {
              ...updatedData,
              id: editingBooking.id,
            }
          : booking
      )
    )

    // Cerramos el formulario y limpiamos la edición.
    setIsFormOpen(false)
    setEditingBooking(null)

    setToast({
      message: 'Reserva actualizada correctamente',
      type: 'success',
    })
  }

  // Abre el formulario con los datos de la reserva seleccionada.
  function handleEditBooking(booking: Booking) {
    setEditingBooking(booking)
    setIsFormOpen(true)
  }

  // Elimina una reserva de la lista.
  function handleDeleteBooking(id: number) {

    // Pedimos confirmación antes de eliminar.
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar esta reserva?'
    )

    if (!confirmed) return

    // Conservamos todas las reservas excepto la seleccionada.
    setBookings((currentBookings) =>
      currentBookings.filter((booking) => booking.id !== id)
    )
    setToast({
      message: 'Reserva eliminada correctamente',
      type: 'success',
    })
  }

  return (
    <section>

      {/* Cabecera de la página */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Gestión de reservas
        </h1>

        <p className="mt-2 text-slate-500">
          Consulta y administra todas las reservas de tus clientes.
        </p>
      </div>

      {/* Indicadores rápidos */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-blue-600" size={22} />

            <span className="text-sm text-slate-500">
              Total de reservas
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-800">
            {bookings.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Clock className="text-orange-600" size={22} />

            <span className="text-sm text-slate-500">
              Pendientes
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-800">
            {bookings.filter(
              (booking) => booking.status === 'Pendiente'
            ).length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Users className="text-green-600" size={22} />

            <span className="text-sm text-slate-500">
              Confirmadas
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-slate-800">
            {bookings.filter(
              (booking) => booking.status === 'Confirmada'
            ).length}
          </p>
        </div>

      </div>

      {/* Botón para crear una reserva */}
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <Plus size={18} />
          Nueva reserva
        </button>
      </div>

      {/* Formulario de nueva reserva */}
        {isFormOpen && (
        <div className="mb-6">
          <BookingForm
            // Reserva que estamos editando, si existe.
            initialBooking={editingBooking ?? undefined}
            // Reservas existentes para controlar los conflictos horarios.
            existingBookings={bookings}
            // Clientes registrados que podremos seleccionar.
            existingClients={clients}
            existingServices={services}
            onSave={
              editingBooking
                ? handleUpdateBooking
                : handleSaveBooking
            }
            onCancel={() => {
              setIsFormOpen(false)
              setEditingBooking(null)
            }}
          />
        </div>
      )}

      {/* Buscador y filtros */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">

        {/* Buscador */}
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">

          <Search size={19} className="text-slate-400" />

          <input
            type="text"
            placeholder="Buscar por cliente o servicio..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />

        </div>

        {/* Filtro por estado */}
        <div className="flex items-center gap-3">

          <label
            htmlFor="statusFilter"
            className="whitespace-nowrap text-sm font-medium text-slate-600"
          >
            Estado:
          </label>

          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 sm:w-48"
          >
            <option value="Todas">Todas</option>
            <option value="Confirmada">Confirmadas</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Cancelada">Canceladas</option>
          </select>

        </div>

      </div>

      {/* Tabla de reservas */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-800">
            Todas las reservas
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Listado completo de citas registradas
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Cliente
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Servicio
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Fecha
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Hora
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                  Estado
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>

            
            <tbody className="divide-y divide-slate-100">

              {filteredBookings.length > 0 ? (

                filteredBookings.map((booking: Booking) => (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-slate-50"
                  >

                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">
                      {booking.client}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {booking.service}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {booking.date}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {booking.time}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => handleEditBooking(booking)}
                          className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>

                      </div>
                    </td>

                  </tr>
                ))

              ) : (

                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No se encontraron reservas.
                  </td>
                </tr>

              )}

            </tbody>


          </table>

        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

      </div>

    </section>
  )
}

export default Reservas
