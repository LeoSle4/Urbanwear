
import Navbar from '../Components/Navbar'; // Asegúrate de que la ruta sea correcta
import '../Styles/Login.css'; // Estilos específicos del login
import '../Styles/General.css'; // Estilos generales

export default function Login() {
  return (
    <>
      <Navbar />
      <main className="login-contenedor">
        <div className="login-formulario">
          <h2>Iniciar Sesión</h2>
          <form>
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Ingresa tu usuario"
            />

            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
            />

            <button type="submit">Entrar</button>
          </form>
        </div>
      </main>
    </>
  );
}
