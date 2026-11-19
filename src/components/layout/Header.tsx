
import { Search, Bell, ChevronDown } from 'lucide-react'

// Propiedades que recibe el componente.
type HeaderProps = {
  title: string
}

function Header({ title }: HeaderProps) {
  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 md:px-8">

      {/* Título de la página */}
      <div className="min-w-0 pl-12 md:pl-0">
        <h2 className="truncate text-lg font-bold text-slate-800 md:text-xl">
          {title}
        </h2>

        <p className="hidden text-sm text-slate-500 sm:block">
          Gestiona tus reservas y citas
        </p>
      </div>

      {/* Acciones del encabezado */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">

        {/* Buscador */}
        <div className="hidden items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 lg:flex">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Buscar..."
            aria-label="Buscar"
            className="w-40 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Notificaciones */}
        <button
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
          aria-label="Notificaciones"
        >
          <Bell size={21} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Perfil */}
        <button className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-slate-100">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            A
          </div>

          <span className="hidden text-sm font-medium text-slate-700 sm:block">
            Admin
          </span>

          <ChevronDown
            size={16}
            className="hidden text-slate-400 sm:block"
          />

        </button>

      </div>

    </header>
  )
}

export default Header
