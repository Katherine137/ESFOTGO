import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Componente para centrar el mapa
function ChangeMapView({ coords }) {
    const map = useMap();
    map.setView(coords, 15);
    return null;
}

const AdvancedMapComponent = () => {
const [selectedLocation, setSelectedLocation] = useState(null);

  // Ubicaciones de ejemplo
const locations = [
    {
        id: 1,
        name: "ESFOT - Campus Principal",
        position: [-0.2102, -78.4897],
        description: "Escuela de Formación de Tecnólogos",
        type: "campus"
    },
    {
        id: 2,
        name: "Parada de Bus Norte",
        position: [-0.2090, -78.4900],
        description: "Punto de encuentro norte",
        type: "bus_stop"
    },

];

  // Ruta de ejemplo (línea entre puntos)
const routePath = [
    [-0.2090, -78.4900],
    [-0.2102, -78.4897],
    [-0.2115, -78.4890]
];

const handleLocationSelect = (location) => {
    setSelectedLocation(location);
};

return (
    <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
      {/* Panel lateral con lista de ubicaciones */}
    <div style={{ 
        width: '300px', 
        overflowY: 'auto',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
    }}>
        <h3 style={{ marginTop: 0 }}>Ubicaciones</h3>
        {locations.map((location) => (
        <div 
            key={location.id}
            onClick={() => handleLocationSelect(location)}
            style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: selectedLocation?.id === location.id ? '#007bff' : 'white',
                color: selectedLocation?.id === location.id ? 'white' : 'black',
                borderRadius: '5px',
                cursor: 'pointer',
                border: '1px solid #ddd'
            }}
        >
            <h4 style={{ margin: '0 0 5px 0' }}>{location.name}</h4>
            <p style={{ margin: 0, fontSize: '14px' }}>{location.description}</p>
        </div>
        ))}
    </div>

      {/* Mapa */}
    <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer 
            center={[-0.2102, -78.4897]} 
            zoom={15} 
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        >
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

          {/* Marcadores */}
            {locations.map((location) => (
            <Marker 
            key={location.id} 
            position={location.position}
            eventHandlers={{
                click: () => handleLocationSelect(location),
            }}
            >
            <Popup>
                <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{location.name}</h3>
                    <p style={{ margin: 0 }}>{location.description}</p>
                </div>
            </Popup>
            </Marker>
        ))}

          {/* Línea de ruta */}
        <Polyline 
            positions={routePath} 
            color="blue" 
            weight={3}
            opacity={0.7}
        />

          {/* Centrar mapa cuando se selecciona una ubicación */}
            {selectedLocation && (
            <ChangeMapView coords={selectedLocation.position} />
            )}
        </MapContainer>
        </div>
    </div>
);
};

export default AdvancedMapComponent;