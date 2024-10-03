import React from 'react';
// Estilos a Utilizar
import '../Styles/Header.css';
// Imagenes a Utilizar
import Logo from '../Images/FaltaImagen.png';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={Logo} alt="Vino Costero"/>
        <h1>Vino Costero</h1>
      </div>
      <nav className="nav-menu">
        <a href="/produccion-vinos">Producción de Vinos</a>
        <a href="/lotes-producidos">Lotes Producidos</a>
        <a href="/registro-compradores">Compradores</a>
        <a href="/analisis-negocios">Análisis de Negocios</a>
        <a href="/seguridad">Seguridad</a>
      </nav>
      <a href="/iniciosesion" className="login-button">Cerrar Sesión</a>
    </header>
  );
}

export default Header;