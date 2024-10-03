// Componentes a Utilizar
import Header from '../Components/Header';
import AnalisisNegocios from '../Components/ComAnalisisNegocio';
// Estilos a Utilizar
import '../Styles/GeneralStyle.css';
// Imagenes a Utilizar
//import ImagenDefault from '../Images/FaltaImagen.png';

function Seguridad() {
  return (
    <main className='inicio'>
        <Header/>
        <AnalisisNegocios/>
    </main>
);
}

export default Seguridad;