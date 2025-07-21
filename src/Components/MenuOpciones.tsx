import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Componentes/MenuOpciones.css';

export default function MenuOpciones() {
  const navigate = useNavigate();
  const [nombreAdmin, setNombreAdmin] = useState('');

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (admin) {
      const datos = JSON.parse(admin);
      setNombreAdmin(datos.nombre);
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("admin");
    navigate('/login');
  };

  return (
    <div className="contenedor-menu-opciones">
      <div className="menu-opciones izquierda">
        <div className="menu-izquierda">
          <ul>
            <li><a href="/productos">Productos</a></li>
            <li><a href="/pedidos">Pedidos</a></li>
            <li><a href="/detallepedido">Detalles</a></li>
            <li><a href="/categorias">Categorias</a></li>
            <li><a href="/clientes">Clientes</a></li>
            <li><a href="/administrador">Administradores</a></li>
          </ul>
        </div>
      </div>

      <div className="menu-opciones derecha">
        <div className="menu-derecha">
          <p>Hola, {nombreAdmin || 'Administrador'}</p>
          <button
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            onClick={cerrarSesion}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
