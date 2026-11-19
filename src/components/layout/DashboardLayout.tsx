
import { Outlet } from 'react-router'

import Sidebar from './Sidebar'
import Header from './Header'

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Barra lateral de navegación */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="min-w-0 flex-1">

        {/* Cabecera común */}
        <Header title="Booking App" />

        {/* Aquí se mostrará la página seleccionada */}
        <main className="p-8">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default DashboardLayout
