
import MenuOpciones from '../Components/MenuOpciones';
import Navbar from '../Components/Navbar';
import '../Styles/Dashboard.css'; // Crea este archivo para los estilos

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <MenuOpciones />
      <main className="dashboard-contenedor">
        <h1>Bienvenido al Dashboard</h1>
        <div className="tarjetas">
          <div className="tarjeta">Usuarios</div>
          <div className="tarjeta">Productos</div>
          <div className="tarjeta">Ventas</div>
        </div>
      </main>
    </>
  );
}
