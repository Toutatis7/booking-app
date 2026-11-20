
import { useEffect } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

// Tipos de notificaciones disponibles.
export type ToastType = 'success' | 'error'

// Propiedades del componente.
type ToastProps = {
  message: string
  type: ToastType
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {

  // Cerramos automáticamente la notificación después de 3 segundos.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose()
    }, 3000)

    // Limpiamos el temporizador cuando desaparece el componente.
    return () => window.clearTimeout(timer)
  }, [onClose])

  const isSuccess = type === 'success'

  return (
    <div
      role="status"
      className={`fixed right-5 top-5 z-50 flex items-center gap-3 rounded-xl border p-4 shadow-lg ${
        isSuccess
          ? 'border-green-200 bg-green-50 text-green-800'
          : 'border-red-200 bg-red-50 text-red-800'
      }`}
    >
      {isSuccess ? (
        <CheckCircle size={22} />
      ) : (
        <AlertCircle size={22} />
      )}

      <p className="text-sm font-medium">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar notificación"
        className="ml-2 rounded-lg p-1 transition-colors hover:bg-black/5"
      >
        <X size={18} />
      </button>
    </div>
  )
}

export default Toast
