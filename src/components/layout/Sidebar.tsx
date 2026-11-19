
import { useState } from 'react'

import {
  Activity,
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Users,
  BriefcaseBusiness,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

import { NavLink } from 'react-router'

// Estructura de cada elemento del menú.
type MenuItem = {
  label: string
  path: string
  icon: typeof LayoutDashboard
}

// Opciones de navegación.
const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Calendario',
    path: '/calendario',
    icon: CalendarDays,
  },
  {
    label: 'Reservas',
    path: '/reservas',
    icon: CalendarCheck,
  },
  {
    label: 'Clientes',
    path: '/clientes',
    icon: Users,
  },
  {
    label: 'Servicios',
    path: '/servicios',
    icon: BriefcaseBusiness,
  },
]

function Sidebar() {

  // Controla si el menú móvil está abierto.
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botón de apertura del menú móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-slate-900 p-2 text-white shadow-lg md:hidden"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Fondo oscuro cuando se abre el menú móvil */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* Barra lateral */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-64 flex-col
          bg-slate-900 text-white
          transition-transform duration-300
          md:static md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >

        {/* Identidad de la aplicación */}
        <div className="flex h-20 items-center gap-3 border-b border-slate-700 px-6">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Activity size={23} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide">
              BOOKING
            </h1>

            <p className="text-xs text-slate-400">
              Appointment Manager
            </p>
          </div>

        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-2 px-4 py-6">

          {menuItems.map((item) => {

            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >

                <Icon size={20} />

                {item.label}

              </NavLink>
            )
          })}

          {/* Configuración */}
          <NavLink
            to="/configuracion"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Settings size={20} />
            Configuración
          </NavLink>

        </nav>

        {/* Perfil del administrador */}
        <div className="border-t border-slate-700 p-4">

          <div className="flex items-center gap-3 rounded-xl p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-bold">
              A
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold">
                Administrador
              </p>

              <p className="text-xs text-slate-400">
                admin@booking.com
              </p>
            </div>

            <LogOut size={19} className="text-slate-400" />

          </div>

        </div>

      </aside>
    </>
  )
}

export default Sidebar
