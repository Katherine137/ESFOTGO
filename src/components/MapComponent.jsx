import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';

// Corregir icono por defecto
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Componente de Enrutamiento
function RoutingMachine({ start, end }) {
    const map = useMap();
    useEffect(() => {
        if (!map || !start || !end) return;
        const control = L.Routing.control({
            waypoints: [L.latLng(start), L.latLng(end)],
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            createMarker: () => null 
        }).addTo(map);
        return () => map.removeControl(control);
    }, [map, start, end]);
    return null;
}

const AdvancedMapComponent = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const startPoint = [-0.210014, -78.488604];

    const locations = [
        { id: 1, name: "EPN (Politécnica)", position: [-0.209970, -78.497184], description: "Destino 1" },
        { id: 2, name: "ESFOT", position: [-0.2102, -78.4897], description: "Destino 2" }
    ];

    return (
        <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
            <div style={{ width: '300px', overflowY: 'auto', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h3>Rutas Disponibles</h3>
                {locations.map((location) => (
                    <div 
                        key={location.id}
                        onClick={() => setSelectedLocation(location)}
                        style={{ 
                            padding: '10px', marginBottom: '10px', borderRadius: '5px', cursor: 'pointer', border: '1px solid #ddd',
                            backgroundColor: selectedLocation?.id === location.id ? '#007bff' : 'white',
                            color: selectedLocation?.id === location.id ? 'white' : 'black'
                        }}
                    >
                        <h4>{location.name}</h4>
                        <p style={{ margin: 0, fontSize: '12px' }}>{location.description}</p>
                    </div>
                ))}
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                <MapContainer center={startPoint} zoom={16} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    
                    <Marker position={startPoint} />

                    {selectedLocation && (
                        <RoutingMachine start={startPoint} end={selectedLocation.position} />
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default AdvancedMapComponent;