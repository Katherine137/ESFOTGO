import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Mover la configuración del icono fuera del componente 
// o usar un useEffect para inicializarlo una sola vez
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapEventsHandler({ isAdding, onAddPoint }) {
    useMapEvents({
        click(e) {
            if (isAdding) onAddPoint(e.latlng);
        },
    });
    return null;
}

const MapCreate = () => {
    const [mapCenter] = useState([-0.26, -78.52]);
    const [isMobile] = useState(window.innerWidth < 768);
    const [isAdmin] = useState(true);
    const [isAddingRoute, setIsAddingRoute] = useState(false);
    const [newRoutePoints, setNewRoutePoints] = useState([]);
    const [newRouteName, setNewRouteName] = useState("");

    const handleAddPoint = (latlng) => {
        setNewRoutePoints((prev) => [...prev, [latlng.lat, latlng.lng]]);
    };

    const saveRoute = () => {
        if (!newRouteName.trim() || newRoutePoints.length < 2) {
            alert("Completa el nombre y selecciona al menos 2 puntos.");
            return;
        }
        console.log("Guardando:", { name: newRouteName, points: newRoutePoints });
        setIsAddingRoute(false);
        setNewRoutePoints([]);
        setNewRouteName("");
    };

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '15px', height: '600px', width: '100%' }}>
            <div style={{ width: isMobile ? '100%' : '280px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {isAdmin && (
                    <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h4 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>RUTAS</h4>
                        <button onClick={() => setIsAddingRoute(!isAddingRoute)} 
                            style={{ width: '60%', padding: '8px', borderRadius: '5px', cursor: 'pointer', backgroundColor: isAddingRoute ? '#f89999' : '#bad1f5' }}>
                            {isAddingRoute ? "Cancelar edición" : "Crear Nueva Ruta"}
                        </button>
                        {isAddingRoute && (
                            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                                <input 
                                    value={newRouteName} onChange={(e) => setNewRouteName(e.target.value)}
                                    placeholder="Nombre de la ruta..." style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
                                />
                                <button onClick={saveRoute} style={{ width: '60%', borderRadius: '5px', padding: '8px', backgroundColor: '#8bf3b1' }}>Guardar</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div style={{ flex: 1, height: '100%', minHeight: '400px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #ccc' }}>
                <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MapEventsHandler isAdding={isAddingRoute} onAddPoint={handleAddPoint} />
                    {newRoutePoints.map((pos, idx) => (
                        <CircleMarker key={idx} center={pos} radius={6} pathOptions={{ color: 'red' }} />
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapCreate;