
import { useEffect, useState } from 'react'

// Importamos los iconos que utilizamos en la pagina.
import { Search, Plus, Users, Pencil, Trash2 } from 'lucide-react'

import type { Client } from '../types/client'
import ClientForm from '../components/clients/ClientForm'

import {
  getStoredClients,
  saveClients,
} from '../services/clientStorage'

// Datos temporales para comenzar.
const initialClients: Client[] = [
  {
    id: 1,
    name: 'Laura Martínez',
    email: 'laura@email.com',
    phone: '612345678',
    createdAt: '2026-11-15',
  },
  {
    id: 2,
    name: 'Carlos García',
    email: 'carlos@email.com',
    phone: '623456789',
    createdAt: '2026-11-16',
  },
  {
    id: 3,
    name: 'María López',
    email: 'maria@email.com',
    phone: '634567890',
    createdAt: '2026-11-17',
  },
]

function Clientes() {
  // Estado de los clientes.
  const [clients, setClients] = useState<Client[]>(() => {
    return getStoredClients() ?? initialClients
  })
  // Guardamos los clientes cada vez que cambia el listado.
  useEffect(() => {
    saveClients(clients)
  }, [clients])
  // Controla la visibilidad del formulario.
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Guardamos el cliente que estamos editando.
  // null significa que no hay ningun cliente seleccionado.
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  // Estado del buscador.
  const [searchTerm, setSearchTerm] = useState('')

  // Registra un nuevo cliente.
  function handleSaveClient(
    clientData: Omit<Client, 'id' | 'createdAt'>
  ) {
    const newClient: Client = {
      id:
        clients.length > 0
          ? Math.max(...clients.map((client) => client.id)) + 1
          : 1,
      ...clientData,
      createdAt: new Date().toISOString().split('T')[0],
    }

    setClients((currentClients) => [
      ...currentClients,
      newClient,
    ])

    setIsFormOpen(false)
  }

  // Actualiza los datos de un cliente existente.
  function handleUpdateClient(
    updatedData: Omit<Client, 'id' | 'createdAt'>
  ) {
    // Comprobamos que existe un cliente seleccionado para editar.
    if (!editingClient) {
      return
    }

    // Recorremos el listado y buscamos el cliente que queremos modificar.
    const updatedClients = clients.map((client) => {

      // Si encontramos el cliente seleccionado, creamos un objeto actualizado.
      if (client.id === editingClient.id) {
        return {
          ...client, // Conservamos el id y la fecha de registro.
          ...updatedData, // Sustituimos nombre, correo y teléfono.
        }
      }

      // Los demás clientes permanecen exactamente igual.
      return client
    })

    // Actualizamos el estado con el nuevo listado.
    setClients(updatedClients)

    // Cerramos el formulario.
    setIsFormOpen(false)

    // Limpiamos el cliente seleccionado.
    setEditingClient(null)
  }

  // Prepara el formulario para editar el cliente seleccionado.
  function handleEditClient(client: Client) {
    // Guardamos el cliente completo que queremos modificar.
    setEditingClient(client)

    // Mostramos el formulario.
    setIsFormOpen(true)
  }

  // Elimina un cliente utilizando su identificador.
  function handleDeleteClient(id: number) {

    // Buscamos el cliente que coincide con el identificador recibido.
    const clientToDelete = clients.find((client) => client.id === id)

    // Si no encontramos el cliente, no continuamos.
    if (!clientToDelete) {
      return
    }

    // Solicitamos confirmación antes de eliminar el registro.
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar a ${clientToDelete.name}?`
    )

    // Si el usuario cancela, detenemos la operación.
    if (!confirmed) {
      return
    }

    // Creamos un nuevo array excluyendo al cliente seleccionado.
    const updatedClients = clients.filter((client) => {
      return client.id !== id
    })

    // Actualizamos el estado de React.
    // El useEffect que ya tenemos guardará los cambios en localStorage.
    setClients(updatedClients)
  }

  // Filtramos los clientes según la búsqueda.
  const filteredClients = clients.filter((client) => {
    const search = searchTerm.toLowerCase()

    return (
      client.name.toLowerCase().includes(search) ||
      client.email.toLowerCase().includes(search) ||
      client.phone.includes(search)
    )
  })

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestión de clientes
          </h1>

          <p className="mt-2 text-slate-500">
            Consulta y administra la información de tus clientes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Nuevo cliente
        </button>
      </div>

      {/* Mostramos el formulario cuando queremos crear o editar. */}
      {isFormOpen && (
        <ClientForm
          // Si existe editingClient, rellenamos el formulario.
          initialClient={editingClient ?? undefined}

          // Enviamos todos los clientes para comprobar correos duplicados.
          existingClients={clients}

          // Elegimos la función según el modo de trabajo.
          onSave={
            editingClient
              ? handleUpdateClient
              : handleSaveClient
          }

          // Al cancelar, cerramos el formulario y limpiamos la selección.
          onCancel={() => {
            setIsFormOpen(false)
            setEditingClient(null)
          }}
        />
      )}

      {/* Indicador de clientes */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <Users size={24} />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total de clientes
            </p>

            <p className="text-2xl font-bold text-slate-800">
              {clients.length}
            </p>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nombre, correo o teléfono..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Cliente
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Correo electrónico
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Teléfono
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Fecha de registro
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">
                      {client.name}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {client.email}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {client.phone}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(
                      `${client.createdAt}T00:00:00`
                    ).toLocaleDateString('es-ES')}
                  </td>
                  
                  {/* Columna con las acciones disponibles para cada cliente. */}
                  <td className="px-6 py-4">

                    {/* Agrupamos los botones para mantenerlos alineados. */}
                    <div className="flex items-center gap-2">

                      {/* Botón para abrir el formulario de edición. */}
                      <button
                        type="button"
                        onClick={() => handleEditClient(client)}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                        aria-label={`Editar cliente ${client.name}`}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>

                      {/* Botón para eliminar el cliente seleccionado. */}
                      <button
                        type="button"
                        onClick={() => handleDeleteClient(client.id)}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        aria-label={`Eliminar cliente ${client.name}`}
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {filteredClients.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Clientes
