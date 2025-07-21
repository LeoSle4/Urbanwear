import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Productos from './Pages/Productos';
import Clientes from './Pages/Clientes';
import Administrador from './Pages/Administrador';
import Pedidos from './Pages/Pedidos';
import Categorias from './Pages/Categoria';
import DetallePedido from './Pages/DetallePedido';


function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          {/* Redirección desde / a /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas principales */}
          <Route path="/login" element={<Login />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/administrador" element={<Administrador/>} />
          <Route path="/pedidos" element={<Pedidos/>} />
          <Route path="/categorias" element={<Categorias/>} />
          <Route path="/detallepedido" element={<DetallePedido/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

