
import { NavLink } from 'react-router'
import {
  Activity,
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Users,
  BriefcaseBusiness,
  Settings,
  LogOut,
} from 'lucide-react'

// Definimos la estructura de cada elemento del menú.
type MenuItem = {
  label: string
  path: string
  icon: typeof LayoutDashboard
}

// Elementos de navegación de nuestra aplicación.
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
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-950 text-slate-300">

      {/* Identidad de nuestra aplicación */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Activity size={23} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-wide text-white">
            BOOKING
          </h1>

          <p className="text-xs text-slate-400">
            Appointment Manager
          </p>
        </div>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 px-4 py-6">

        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Principal
        </p>

        <div className="space-y-2">

          
        {menuItems.map((item) => {
        const Icon = item.icon

        return (
            <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
            }
            >
            <Icon size={19} />
            <span>{item.label}</span>
            </NavLink>
        )
        })}


        </div>

        {/* Preferencias */}
        <p className="mb-4 mt-10 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Sistema
        </p>

        <NavLink
            to="/configuracion"
            className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
            }
        >
            <Settings size={19} />
            <span>Configuración</span>
        </NavLink>

      </nav>

      {/* Perfil del administrador */}
      <div className="border-t border-slate-800 p-4">

        <div className="flex items-center gap-3 rounded-xl p-2">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
            AD
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              Administrador
            </p>

            <p className="truncate text-xs text-slate-400">
              admin@booking.com
            </p>
          </div>

          <LogOut size={18} className="text-slate-400" />

        </div>

      </div>

    </aside>
  )
}

export default Sidebar
