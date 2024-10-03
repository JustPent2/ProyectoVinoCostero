// Componentes a Utilizar
import Header from '../Components/Header';
import ProdVinos from '../Components/ComGestionProdVinos';
// Estilos a Utilizar
import '../Styles/GeneralStyle.css';
// Imagenes a Utilizar
//import ImagenDefault from '../Images/FaltaImagen.png';

function Seguridad() {
  return (
    <main className='inicio'>
        <Header/>
        <ProdVinos/>
    </main>
);
}

export default Seguridad;