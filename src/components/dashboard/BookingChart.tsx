
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// Datos de ejemplo: reservas registradas durante la semana.
const bookingData = [
  { day: 'Lun', bookings: 18 },
  { day: 'Mar', bookings: 24 },
  { day: 'Mié', bookings: 21 },
  { day: 'Jue', bookings: 32 },
  { day: 'Vie', bookings: 28 },
  { day: 'Sáb', bookings: 35 },
  { day: 'Dom', bookings: 19 },
]

// Componente que representa la actividad de las reservas.
function BookingChart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Cabecera del gráfico */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800">
          Actividad de reservas
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Reservas registradas durante esta semana
        </p>
      </div>

      {/* Contenedor adaptable del gráfico */}
      <div className="h-72 w-full">

        <ResponsiveContainer width="100%" height="100%">

          <AreaChart data={bookingData}>

            {/* Cuadrícula de referencia */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />

            {/* Eje horizontal */}
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />

            {/* Eje vertical */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />

            {/* Información al pasar el ratón */}
            <Tooltip />

            {/* Área que representa las reservas */}
            <Area
              type="monotone"
              dataKey="bookings"
              name="Reservas"
              stroke="#2563eb"
              strokeWidth={3}
              fill="#2563eb"
              fillOpacity={0.12}
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}

export default BookingChart
