
import { Outlet, useLocation } from 'react-router'

import Sidebar from './Sidebar'
import Header from './Header'

// Relacionamos cada ruta con el título que debe mostrar.
const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/calendario': 'Calendario',
  '/reservas': 'Reservas',
  '/clientes': 'Clientes',
  '/servicios': 'Servicios',
  '/configuracion': 'Configuración',
}

function DashboardLayout() {

  // Obtenemos la ruta actual.
  const location = useLocation()

  // Buscamos el título correspondiente a esa ruta.
  const pageTitle = pageTitles[location.pathname] ?? 'Booking App'

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Barra lateral de navegación */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="min-w-0 flex-1">

        {/* Cabecera con título dinámico */}
        <Header title={pageTitle} />

        {/* Aquí se mostrará la página seleccionada */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default DashboardLayout
