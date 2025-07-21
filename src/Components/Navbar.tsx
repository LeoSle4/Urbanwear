import React from 'react';
import '../Styles/Componentes/Navbar.css'; // Asegúrate de que esta ruta sea correcta
import logo from '../assets/logo.png'; // Ajusta esta ruta según tu estructura real

const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <img
        src={logo}
        alt="Logo de la tienda"
        className="logo"
      />
    </header>
  );
};

export default Navbar;

