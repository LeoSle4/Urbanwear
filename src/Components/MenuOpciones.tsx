import '../Styles/Componentes/MenuOpciones.css';

export default function MenuOpciones() {
  return (
    <div className="contenedor-menu-opciones">
      <div className="menu-opciones izquierda">
        <div className="menu-izquierda">
          <ul>
            <li><a href="/dashboard">Inicio</a></li>
            <li><a href="/productos">Productos</a></li>
            <li><a href="/pedidos">Pedidos</a></li>
            <li><a href="/detallepedidos">Detalles</a></li>
            <li><a href="/categorias">Categorias</a></li>
            <li><a href="/clientes">Clientes</a></li>
            <li><a href="/administrador">Administradores</a></li>
          </ul>
        </div>
      </div>

      <div className="menu-opciones derecha">
        <div className="menu-derecha">
          <p>Hola, Juan Pérez</p>
          <button aria-label="Cerrar sesión" title="Cerrar sesión">
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
