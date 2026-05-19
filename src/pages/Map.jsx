import { Link } from 'react-router-dom';
import MapComponent from '../components/MapComponent';

export const Map = () => {
return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header/Navbar */}
    <header style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '15px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
        <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <h1 style={{ margin: 0, fontSize: '24px' }}>
            🚍 EsfotGo - Mapa de Rutas
            </h1>
            <nav style={{ display: 'flex', gap: '15px' }}>
            <Link 
            to="/" 
            style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 15px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '5px'
            }}
            >
                Inicio
            </Link>
            <Link 
            to="/login" 
            style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 15px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '5px'
            }}
            >
                Login
            </Link>
            </nav>
        </div>
    </header>

      {/* Contenido principal */}
        <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px'
    }}>
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
        <MapComponent />
        </div>
    </main>
    </div>
);
};

export default Map;