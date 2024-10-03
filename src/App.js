import React from 'react';
// Estilos a Utilizar
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Páginas para el Control de Producción de Vinos
import ProduccionVinos from './Pages/ProduccionVinos';
import LotesProducidos from './Pages/LotesProducidos';
import RegistroCompradores from './Pages/RegistroCompradores';
import AnalisisNegocios from './Pages/AnalisisNegocios';
import LogisticaRequerimientos from './Pages/LogisticaRequerimientos';
import Seguridad from './Pages/Seguridad';
import InicioSesion from './Pages/InicioSesion';
import InicioGeneral from './Pages/InicioGeneral';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta predeterminada que redirige a /produccion-vinos */}
        <Route path="/" element={<Navigate to="/iniciosesion" />} />
        
        {/* Rutas principales simplificadas */}
        <Route path="/iniciogeneral" element={<InicioGeneral />} />
        <Route path="/iniciosesion" element={<InicioSesion />} />
        <Route path="/produccion-vinos" element={<ProduccionVinos />} />
        <Route path="/lotes-producidos" element={<LotesProducidos />} />
        <Route path="/registro-compradores" element={<RegistroCompradores />} />
        <Route path="/analisis-negocios" element={<AnalisisNegocios />} />
        <Route path="/logistica-requerimientos" element={<LogisticaRequerimientos />} />
        <Route path="/seguridad" element={<Seguridad />} />
        
      </Routes>
    </Router>
  );
}

export default App;