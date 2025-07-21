import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import '../Styles/Login.css';
import '../Styles/General.css';

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const admin = JSON.parse(localStorage.getItem("admin") || "null");


  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const respuesta = await fetch('http://localhost:3001/administradores');
      const administradores = await respuesta.json();

      const adminValido = administradores.find(
        (admin: any) => admin.correo === correo && admin.password === password
      );

      if (adminValido) {
        localStorage.setItem("admin", JSON.stringify(adminValido));
        navigate('/productos');
      } else {
        setError('Correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Ocurrió un error al validar. Inténtalo nuevamente.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="login-contenedor">
        <div className="login-formulario">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={manejarLogin}>
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="error-mensaje">{error}</p>}

            <button type="submit">Entrar</button>
          </form>
        </div>
      </main>
    </>
  );
}
