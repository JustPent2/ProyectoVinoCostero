// Componentes a Utilizar
import Header from '../Components/Header';
import GesLogistica from '../Components/ComGestionLogistica';
// Estilos a Utilizar
import '../Styles/GeneralStyle.css';
// Imagenes a Utilizar
//import ImagenDefault from '../Images/FaltaImagen.png';

function Seguridad() {
  return (
    <main className='inicio'>
        <Header/>
        <GesLogistica/>
    </main>
);
}

export default Seguridad;