
import {
  CalendarCheck,
  Clock,
  Users,
  BriefcaseBusiness,
} from 'lucide-react'

import StatCard from '../components/dashboard/StatCard'
import BookingTable from '../components/dashboard/BookingTable'
import BookingChart from '../components/dashboard/BookingChart'

function Dashboard() {
  return (
    <section>

      {/* Cabecera del Dashboard */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Resumen general
        </h1>

        <p className="mt-2 text-slate-500">
          Consulta el estado de tus reservas y la actividad de tu negocio.
        </p>
      </div>

      {/* Indicadores principales */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Reservas totales"
          value="248"
          description="Reservas registradas en el sistema"
          icon={CalendarCheck}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />

        <StatCard
          title="Reservas pendientes"
          value="18"
          description="Esperando confirmación"
          icon={Clock}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />

        <StatCard
          title="Clientes registrados"
          value="156"
          description="Clientes en nuestra base de datos"
          icon={Users}
          color="text-green-600"
          bgColor="bg-green-50"
        />

        <StatCard
          title="Servicios disponibles"
          value="12"
          description="Servicios activos actualmente"
          icon={BriefcaseBusiness}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />

      </div>

      {/* Grafico de actividad de reservas */}
      <div className="mt-8">
        <BookingChart />
      </div>
      {/* Tabla de proximas reservas */}
        <div className="mt-8">
            <BookingTable />
        </div>

    </section>
  )
}

export default Dashboard
