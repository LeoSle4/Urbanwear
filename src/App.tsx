import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Productos from './Pages/Productos';
import Clientes from './Pages/Clientes';
import Administrador from './Pages/Administrador';


function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          {/* Redirección desde / a /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas principales */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/administrador" element={<Administrador/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

