
import type { LucideIcon } from 'lucide-react'

// Definimos las propiedades de nuestra tarjeta.
type StatCardProps = {
  title: string
  value: string
  description: string
  icon: LucideIcon
  color: string
  bgColor: string
}

// Componente reutilizable para mostrar indicadores.
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  bgColor,
}: StatCardProps) {

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Icono y título */}
      <div className="flex items-center justify-between">

        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bgColor}`}>
          <Icon size={23} className={color} />
        </div>

      </div>

      {/* Valor principal */}
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <h3 className="mt-1 text-3xl font-bold text-slate-800">
          {value}
        </h3>
      </div>

      {/* Descripción */}
      <p className="mt-3 text-sm text-slate-500">
        {description}
      </p>

    </div>
  )
}

export default StatCard
