
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router'

import DashboardLayout from './components/layout/DashboardLayout'

// Importamos nuestras páginas.
import Dashboard from './pages/Dashboard'
import Calendario from './pages/Calendario'
import Reservas from './pages/Reservas'
import Clientes from './pages/Clientes'
import Servicios from './pages/Servicios'
import Configuracion from './pages/Configuracion'

function App() {
  
  return (
    <BrowserRouter>

      <Routes>

        {/* Estructura común de la aplicación */}
        <Route element={<DashboardLayout />}>

          {/* Página principal */}
          <Route path="/" element={<Dashboard />} />

          {/* Calendario */}
          <Route path="/calendario" element={<Calendario />} />

          {/* Gestión de reservas */}
          <Route path="/reservas" element={<Reservas />} />

          {/* Gestión de clientes */}
          <Route path="/clientes" element={<Clientes />} />

          {/* Gestión de servicios */}
          <Route path="/servicios" element={<Servicios />} />

          {/* Configuración */}
          <Route path="/configuracion" element={<Configuracion />} />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App
