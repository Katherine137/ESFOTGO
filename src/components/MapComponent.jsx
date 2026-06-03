import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';

function MapUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, zoom);
    }, [center, zoom, map]);
    return null;
}

function RoutingMachine({ waypoints }) {
    const map = useMap();
    useEffect(() => {
        if (!map || !waypoints || waypoints.length < 2) return;
        const control = L.Routing.control({
            waypoints: waypoints.map(p => L.latLng(p[0], p[1])),
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            createMarker: () => null,
            show: false,
            router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                language: 'es'
            })
        }).addTo(map);
        return () => map.removeControl(control);
    }, [map, waypoints]);
    return null;
}
const rutasData = {
    ruta1: {
        name: "Ruta 1: La Ecuatoriana",
        color: "#3b82f6",
        stops: [
            { id: 1, name: "Iglesia Santo Hermano Miguel", position: [-0.30936, -78.56289] },
            { id: 2, name: "Av. La Ecuatoriana / Rumichaca Ñan", position: [-0.30180, -78.55370] },
            { id: 3, name: "Av. Rumichaca Ñan / Av. Amaru Ñan", position: [-0.29420, -78.54610] },
            { id: 4, name: "Av. Amaru Ñan / Pedro Vicente Maldonado", position: [-0.28710, -78.54120] },
            { id: 5, name: "Av. Pedro Vicente Maldonado / Jaime del Castillo", position: [-0.27640, -78.52950] },
            { id: 6, name: "Av. Jaime del Castillo / Av. Sena", position: [-0.26380, -78.52100] },
            { id: 7, name: "Av. Sena / Av. Pichincha", position: [-0.24420, -78.51240] },
            { id: 8, name: "Av. Pichincha / Av. 10 de Agosto", position: [-0.22050, -78.50520] },
            { id: 9, name: "Av. 10 de Agosto / Av. Patria", position: [-0.20980, -78.49940] },
            { id: 10, name: "Av. Patria / Av. Ladrón de Guevara", position: [-0.21070, -78.49190] },
            { id: 11, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] }
        ]
    },
    ruta2: {
        name: "Ruta 2: Chillogallo",
        color: "#3b82f6",
        stops: [
            { id: 1, name: "La Independencia / Luis Francisco López (Chillogallo)", position: [-0.2809, -78.5647] },
            { id: 2, name: "Parque Central de Chillogallo", position: [-0.2828, -78.5665] },
            { id: 3, name: "Av. Mariscal Sucre (sector Chillogallo)", position: [-0.2775, -78.5580] },
            { id: 4, name: "Av. Universitaria (sector Universidad Central)", position: [-0.1997, -78.5038] },
            { id: 5, name: "Av. Patria / Av. Ladrón de Guevara", position: [-0.2107, -78.4919] },
            { id: 6, name: "EPN - Escuela Politécnica Nacional", position: [-0.2107, -78.4888] }
        ]
    },
    ruta3: {
        name: "Ruta 3: La Ecuatoriana",
        color: "#3b82f6",
        stops: [
            { id: 1, name: "Parque Central de Machachi", position: [-0.5102, -78.5685] },
            { id: 2, name: "Panamericana", position: [-0.5000, -78.5700] },
            { id: 3, name: "Colectora Quito", position: [-0.4500, -78.5500] },
            { id: 4, name: "Tambillo", position: [-0.3950, -78.5505] },
            { id: 5, name: "Vía Santa Rosa", position: [-0.3550, -78.5400] },
            { id: 6, name: "Entrada Ciudad Jardín", position: [-0.3300, -78.5250] },
            { id: 7, name: "Entrada al Troje", position: [-0.3150, -78.5150] },
            { id: 8, name: "Puente de Cemento San Martín de Porres", position: [-0.3020, -78.5080] },
            { id: 9, name: "Los Pinos", position: [-0.2920, -78.5030] },
            { id: 10, name: "Lucha de los Pobres Alta", position: [-0.2820, -78.4980] },
            { id: 11, name: "Argelia Alta", position: [-0.2720, -78.4940] },
            { id: 12, name: "La Forestal Alta", position: [-0.2620, -78.4890] },
            { id: 13, name: "Loma de Puengasí", position: [-0.2480, -78.4840] },
            { id: 14, name: "Av. Simón Bolívar", position: [-0.2350, -78.4790] },
            { id: 15, name: "Autopista General Rumiñahui", position: [-0.2250, -78.4740] },
            { id: 16, name: "Av. Velasco Ibarra", position: [-0.2170, -78.4840] },
            { id: 17, name: "Queseras del Medio", position: [-0.2140, -78.4890] },
            { id: 18, name: "Ladrón de Guevara", position: [-0.2107, -78.4919] },
            { id: 19, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] }
        ]
    },
    ruta4: {
        name: "Ruta 4: Cutuglagua",
        color: "#3b82f6",
        stops: [
            { id: 1, name: "Av. Atacazo", position: [-0.32300, -78.55200] },
            { id: 2, name: "Escuela Riobamba", position: [-0.31300, -78.54500] },
            { id: 3, name: "Av. Pedro Vicente Maldonado", position: [-0.30300, -78.53800] },
            { id: 4, name: "Adriano Coello Br.", position: [-0.29300, -78.53200] },
            { id: 5, name: "José Peralta", position: [-0.28200, -78.52600] },
            { id: 6, name: "Av. Andrés Pérez", position: [-0.27000, -78.51900] },
            { id: 7, name: "Av. Guido Pérez", position: [-0.25800, -78.51200] },
            { id: 8, name: "Av. Napo", position: [-0.24500, -78.50500] },
            { id: 9, name: "Pedro Pinto", position: [-0.22550, -78.49050] },
            { id: 10, name: "Av. Velasco Ibarra", position: [-0.21700, -78.48400] },
            { id: 11, name: "Queseras del Medio", position: [-0.21400, -78.48900] },
            { id: 12, name: "Ladrón de Guevara", position: [-0.21070, -78.49190] },
            { id: 13, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] }
        ]
    },
    ruta5: {
        name: "Ruta 5: Quitumbe",
        color: "#3b82f6",
        stops: [
            { id: 1, name: "Esquina Av. Guayanay Ñan y Av. Pedro Vicente Maldonado", position: [-0.30250, -78.54100] },
            { id: 2, name: "Av. Guayanay Ñan", position: [-0.29500, -78.53500] },
            { id: 3, name: "Av. Teniente Hugo Ortiz", position: [-0.28200, -78.52700] },
            { id: 4, name: "Redondel del Cíclado", position: [-0.27000, -78.52000] },
            { id: 5, name: "Av. Alonso de Angulo", position: [-0.25700, -78.51400] },
            { id: 6, name: "Av. Sena", position: [-0.24400, -78.51200] },
            { id: 7, name: "Av. Velasco Ibarra", position: [-0.21700, -78.48400] },
            { id: 8, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] }
        ]
    },
    ruta6: {
        name: "Ruta 6: Estadio del Aucas",
        color: "#3b82f6",
        stops: [
            { id: 1, name: "Estadio del Aucas", position: [-0.27850, -78.54550] },
            { id: 2, name: "Av. Rumichaca Ñan", position: [-0.27100, -78.54100] },
            { id: 3, name: "Av. Solanda", position: [-0.26300, -78.53300] },
            { id: 4, name: "Av. Cardenal de la Torre", position: [-0.25500, -78.52600] },
            { id: 5, name: "Av. Teniente Hugo Ortiz", position: [-0.24600, -78.51900] },
            { id: 6, name: "Calle General Quisquis", position: [-0.23800, -78.51300] },
            { id: 7, name: "Calle Cañaris", position: [-0.23300, -78.50900] },
            { id: 8, name: "Calle General Epiclachima", position: [-0.22800, -78.50500] },
            { id: 9, name: "Av. 5 Junio", position: [-0.22300, -78.50100] },
            { id: 10, name: "Av. General Miller", position: [-0.21800, -78.49800] },
            { id: 11, name: "Av. Mariscal Sucre", position: [-0.21200, -78.50000] },
            { id: 12, name: "Av. Universitaria", position: [-0.19970, -78.50380] },
            { id: 13, name: "Av. Patria", position: [-0.21000, -78.49500] },
            { id: 14, name: "Ladrón de Guevara", position: [-0.21070, -78.49190] },
            { id: 15, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] }
        ]
    },
    ruta7: {
        name: "Ruta 7: Mitad del Mundo",
        color: "#3b82f6",
        stops: [
            { id: 1, name: "Super Akí San Antonio", position: [0.00550, -78.44850] },
            { id: 2, name: "Av. Equinoccial", position: [-0.03200, -78.46000] },
            { id: 3, name: "Av. Manuel Córdova Galarza", position: [-0.08000, -78.47000] },
            { id: 4, name: "Av. Mariscal Sucre", position: [-0.15500, -78.50000] },
            { id: 5, name: "Av. Universitaria", position: [-0.19970, -78.50380] },
            { id: 6, name: "Av. Patria", position: [-0.21000, -78.49500] },
            { id: 7, name: "Av. Ladrón de Guevara", position: [-0.21070, -78.49190] },
            { id: 8, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] }
        ]
    },
    ruta8: {
        name: "Ruta 8: Mitad del Mundo",
        color: "#3b82f6",
        stops: [
            { id: 1, name: "Super Akí San Antonio", position: [0.00550, -78.44850] },
            { id: 2, name: "Av. Equinoccial", position: [-0.03200, -78.46000] },
            { id: 3, name: "Av. Manuel Córdova Galarza", position: [-0.08000, -78.47000] },
            { id: 4, name: "Av. Mariscal Sucre", position: [-0.15500, -78.50000] },
            { id: 5, name: "Av. Universitaria", position: [-0.19970, -78.50380] },
            { id: 6, name: "Av. Patria", position: [-0.21000, -78.49500] },
            { id: 7, name: "Av. Ladrón de Guevara", position: [-0.21070, -78.49190] },
            { id: 8, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] }
        ]
    },
};

const puntosEstrategicos = [
    { id: 'p1', name: "Biblioteca Central", position: [-0.2105, -78.4885] , imagenPano: "url1" },
    { id: 'p2', name: "Auditorio Principal", position: [-0.2100, -78.4890] }
];

const AdvancedMapComponent = () => {
    const [selectedRoute, setSelectedRoute] = useState('ruta6');
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [mapCenter, setMapCenter] = useState([-0.26, -78.52]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isRutaMenuOpen, setIsRutaMenuOpen] = useState(true);
    const [isPuntosMenuOpen, setIsPuntosMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSelectRoute = (key) => {
        setSelectedPoint(null);
        setSelectedRoute(key);
    };

    const handleSelectPoint = (punto) => {
        setSelectedRoute(null);
        setSelectedPoint(punto.id);
        setMapCenter(punto.position);
    };

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '15px', height: isMobile ? 'auto' : '600px' }}>
            <div style={{ width: isMobile ? '100%' : '280px', order: isMobile ? 2 : 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #ddd', overflow: 'hidden' }}>
                    <div onClick={() => setIsRutaMenuOpen(!isRutaMenuOpen)} style={{ padding: '15px', cursor: 'pointer', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700 }}>Seleccionar Ruta</span>
                        <span>{isRutaMenuOpen ? '▲' : '▼'}</span>
                    </div>
                    {isRutaMenuOpen && (
                        <div style={{ padding: '10px' }}>
                            {Object.keys(rutasData).map((routeKey) => (
                                <div key={routeKey} onClick={() => handleSelectRoute(routeKey)} style={{ padding: '10px', cursor: 'pointer', backgroundColor: selectedRoute === routeKey ? '#eff6ff' : '#fff', marginBottom: '5px', border: '1px solid #eee' }}>
                                    {rutasData[routeKey].name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #ddd', overflow: 'hidden' }}>
                    <div onClick={() => setIsPuntosMenuOpen(!isPuntosMenuOpen)} style={{ padding: '15px', cursor: 'pointer', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700 }}>Puntos Estratégicos</span>
                        <span>{isPuntosMenuOpen ? '▲' : '▼'}</span>
                    </div>
                    {isPuntosMenuOpen && (
                        <div style={{ padding: '10px' }}>
                            {puntosEstrategicos.map((punto) => (
                                <div key={punto.id} onClick={() => handleSelectPoint(punto)} style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                                    {punto.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div style={{ flex: 1, position: 'relative', height: isMobile ? '500px' : '100%' }}>
                <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <MapUpdater center={mapCenter} zoom={16} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {selectedRoute && (
                        <>
                            {rutasData[selectedRoute].stops.map((stop) => (
                                <CircleMarker key={stop.id} center={stop.position} radius={8} pathOptions={{ color: rutasData[selectedRoute].color }}>
                                    <Popup><strong>{stop.name}</strong></Popup>
                                </CircleMarker>
                            ))}
                            <RoutingMachine waypoints={rutasData[selectedRoute].stops.map(s => s.position)} />
                        </>
                    )}
                    {puntosEstrategicos.map((punto) => (
                        <CircleMarker 
                            key={punto.id} 
                            center={punto.position} 
                            radius={10} 
                            pathOptions={{ color: selectedPoint === punto.id ? 'orange' : 'red' }}
                        >
                            <Popup>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <strong>{punto.name}</strong>
                                    {punto.imagenPano && (
                                        <button 
                                            onClick={() => window.open(punto.imagenPano, '_blank')}
                                            style={{
                                                padding: '5px 10px',
                                                backgroundColor: '#2563eb',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Ver Imagen 360
                                        </button>
                                    )}
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default AdvancedMapComponent;