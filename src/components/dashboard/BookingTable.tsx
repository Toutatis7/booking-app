
import { CalendarDays, Clock } from 'lucide-react'

// Definimos la estructura de una reserva.
type Booking = {
  id: number
  client: string
  service: string
  date: string
  time: string
  status: 'Confirmada' | 'Pendiente' | 'Cancelada'
}

// Datos ficticios para nuestra primera tabla.
const bookings: Booking[] = [
  {
    id: 1,
    client: 'Laura Martínez',
    service: 'Consulta general',
    date: '19 Nov 2026',
    time: '09:00',
    status: 'Confirmada',
  },
  {
    id: 2,
    client: 'Carlos García',
    service: 'Revisión',
    date: '19 Nov 2026',
    time: '10:30',
    status: 'Pendiente',
  },
  {
    id: 3,
    client: 'María López',
    service: 'Sesión individual',
    date: '19 Nov 2026',
    time: '12:00',
    status: 'Confirmada',
  },
  {
    id: 4,
    client: 'Javier Sánchez',
    service: 'Consulta inicial',
    date: '20 Nov 2026',
    time: '09:30',
    status: 'Cancelada',
  },
  {
    id: 5,
    client: 'Ana Fernández',
    service: 'Revisión',
    date: '20 Nov 2026',
    time: '11:00',
    status: 'Confirmada',
  },
]

// Devuelve los colores correspondientes a cada estado.
function getStatusStyles(status: Booking['status']) {
  switch (status) {
    case 'Confirmada':
      return 'bg-green-50 text-green-700'

    case 'Pendiente':
      return 'bg-orange-50 text-orange-700'

    case 'Cancelada':
      return 'bg-red-50 text-red-700'
  }
}

function BookingTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Cabecera de la tabla */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Próximas reservas
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Últimas citas programadas
          </p>
        </div>

        <CalendarDays size={22} className="text-slate-400" />

      </div>

      {/* Tabla */}
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
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">

            {bookings.map((booking) => (
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
                  <div className="flex items-center gap-2">
                    <Clock size={15} />
                    {booking.time}
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default BookingTable
