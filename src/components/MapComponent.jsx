import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userLocationIcon = L.divIcon({
    className: '',
    html: `
        <div style="position:relative;width:24px;height:24px">
            <div style="position:absolute;inset:0;background:#2563eb;border-radius:50%;box-shadow:0 0 0 4px rgba(37,99,235,.3);animation:pulse 2s ease-in-out infinite;"></div>
            <div style="position:absolute;inset:4px;background:#fff;border-radius:50%;"></div>
            <div style="position:absolute;inset:7px;background:#2563eb;border-radius:50%;"></div>
        </div>
        <style>@keyframes pulse{0%,100%{box-shadow:0 0 0 4px rgba(37,99,235,.3)}50%{box-shadow:0 0 0 10px rgba(37,99,235,.1)}}</style>`,
    iconSize: [24, 24], iconAnchor: [12, 12], popupAnchor: [0, -12],
});

const destinationIcon = L.divIcon({
    className: '',
    html: `<div style="width:32px;height:40px;position:relative;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4));">
        <svg viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 10.627 14.234 22.75 15.265 23.648a1 1 0 001.47 0C17.766 38.75 32 26.627 32 16 32 7.163 24.837 0 16 0z" fill="#ef4444"/>
            <circle cx="16" cy="16" r="7" fill="#fff"/>
            <circle cx="16" cy="16" r="4" fill="#ef4444"/>
        </svg>
    </div>`,
    iconSize: [32, 40], iconAnchor: [16, 40], popupAnchor: [0, -42],
});

function MapUpdater({ center, zoom }) {
    const map = useMap();
    useEffect(() => { if (center) map.flyTo(center, zoom, { duration: 1.2 }); }, [center, zoom, map]);
    return null;
}

function MapClickHandler({ onMapClick, isSettingDestination }) {
    const map = useMap();
    useEffect(() => {
        if (!isSettingDestination) return;
        const handler = (e) => onMapClick([e.latlng.lat, e.latlng.lng]);
        map.on('click', handler);
        map.getContainer().style.cursor = 'crosshair';
        return () => { map.off('click', handler); map.getContainer().style.cursor = ''; };
    }, [map, onMapClick, isSettingDestination]);
    return null;
}

function UserToDestinationRoute({ origin, destination, onRouteFound }) {
    const map = useMap();
    const controlRef = useRef(null);
    useEffect(() => {
        if (!origin || !destination) return;
        if (controlRef.current) { map.removeControl(controlRef.current); controlRef.current = null; }
        const ctrl = L.Routing.control({
            waypoints: [L.latLng(origin[0], origin[1]), L.latLng(destination[0], destination[1])],
            routeWhileDragging: false, addWaypoints: false, draggableWaypoints: false,
            createMarker: () => null, show: false,
            lineOptions: { styles: [{ color: '#2563eb', weight: 5, opacity: 0.85 }] },
            router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1', language: 'es' }),
        }).addTo(map);
        ctrl.on('routesfound', (e) => {
            const s = e.routes[0].summary;
            onRouteFound({ distanceKm: (s.totalDistance / 1000).toFixed(2), durationMin: Math.ceil(s.totalTime / 60) });
        });
        ctrl.on('routingerror', () => onRouteFound(null));
        controlRef.current = ctrl;
        return () => { if (controlRef.current) { map.removeControl(controlRef.current); controlRef.current = null; } };
    }, [map, origin, destination, onRouteFound]);
    return null;
}

function RoutingMachine({ waypoints, color }) {
    const map = useMap();
    const controlRef = useRef(null);
    useEffect(() => {
        if (!map || !waypoints || waypoints.length < 2) return;
        if (controlRef.current) { map.removeControl(controlRef.current); controlRef.current = null; }
        const ctrl = L.Routing.control({
            waypoints: waypoints.map(p => L.latLng(p[0], p[1])),
            routeWhileDragging: false, addWaypoints: false, draggableWaypoints: false,
            createMarker: () => null, show: false,
            lineOptions: { styles: [{ color: color || '#3b82f6', weight: 4, opacity: 0.75 }] },
            router: L.Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1', language: 'es' }),
        }).addTo(map);
        controlRef.current = ctrl;
        return () => { if (controlRef.current) { map.removeControl(controlRef.current); controlRef.current = null; } };
    }, [map, waypoints, color]);
    return null;
}

// ── Geocoder: busca coordenadas a partir de texto ──────────────────────────
async function geocodeAddress(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ec`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
    return res.json();
}

const rutasData = {
    ruta1: {
        name: "Ruta 1: La Ecuatoriana", color: "#3b82f6",
        stops: [
            { id: 1,  name: "Iglesia Santo Hermano Miguel",             position: [-0.30936, -78.56289] },
            { id: 2,  name: "Av. La Ecuatoriana / Rumichaca Ñan",       position: [-0.30180, -78.55370] },
            { id: 3,  name: "Av. Rumichaca Ñan / Av. Amaru Ñan",       position: [-0.29420, -78.54610] },
            { id: 4,  name: "Av. Amaru Ñan / Pedro Vicente Maldonado", position: [-0.28710, -78.54120] },
            { id: 5,  name: "Av. Pedro Vicente Maldonado / Jaime del Castillo", position: [-0.27640, -78.52950] },
            { id: 6,  name: "Av. Jaime del Castillo / Av. Sena",       position: [-0.26380, -78.52100] },
            { id: 7,  name: "Av. Sena / Av. Pichincha",                position: [-0.24420, -78.51240] },
            { id: 8,  name: "Av. Pichincha / Av. 10 de Agosto",        position: [-0.22050, -78.50520] },
            { id: 9,  name: "Av. 10 de Agosto / Av. Patria",           position: [-0.20980, -78.49940] },
            { id: 10, name: "Av. Patria / Av. Ladrón de Guevara",      position: [-0.21070, -78.49190] },
            { id: 11, name: "EPN - Escuela Politécnica Nacional",       position: [-0.21073, -78.48884] },
        ],
    },
    ruta2: {
        name: "Ruta 2: Chillogallo", color: "#3b82f6",
        stops: [
            { id: 1, name: "La Independencia / Luis Francisco López (Chillogallo)", position: [-0.2809, -78.5647] },
            { id: 2, name: "Parque Central de Chillogallo",                          position: [-0.2828, -78.5665] },
            { id: 3, name: "Av. Mariscal Sucre (sector Chillogallo)",               position: [-0.2775, -78.5580] },
            { id: 4, name: "Av. Universitaria (sector Universidad Central)",         position: [-0.1997, -78.5038] },
            { id: 5, name: "Av. Patria / Av. Ladrón de Guevara",                   position: [-0.2107, -78.4919] },
            { id: 6, name: "EPN - Escuela Politécnica Nacional",                    position: [-0.2107, -78.4888] },
        ],
    },
    ruta3: {
        name: "Ruta 3: Machachi", color: "#3b82f6",
        stops: [
            { id: 1,  name: "Parque Central de Machachi",   position: [-0.5102, -78.5685] },
            { id: 2,  name: "Panamericana",                 position: [-0.5000, -78.5700] },
            { id: 3,  name: "Colectora Quito",              position: [-0.4500, -78.5500] },
            { id: 4,  name: "Tambillo",                     position: [-0.3950, -78.5505] },
            { id: 5,  name: "Vía Santa Rosa",               position: [-0.3550, -78.5400] },
            { id: 6,  name: "Entrada Ciudad Jardín",        position: [-0.3300, -78.5250] },
            { id: 7,  name: "Entrada al Troje",             position: [-0.3150, -78.5150] },
            { id: 8,  name: "Puente San Martín de Porres",  position: [-0.3020, -78.5080] },
            { id: 9,  name: "Los Pinos",                    position: [-0.2920, -78.5030] },
            { id: 10, name: "Lucha de los Pobres Alta",     position: [-0.2820, -78.4980] },
            { id: 11, name: "Argelia Alta",                 position: [-0.2720, -78.4940] },
            { id: 12, name: "La Forestal Alta",             position: [-0.2620, -78.4890] },
            { id: 13, name: "Loma de Puengasí",             position: [-0.2480, -78.4840] },
            { id: 14, name: "Av. Simón Bolívar",            position: [-0.2350, -78.4790] },
            { id: 15, name: "Autopista Gral. Rumiñahui",   position: [-0.2250, -78.4740] },
            { id: 16, name: "Av. Velasco Ibarra",           position: [-0.2170, -78.4840] },
            { id: 17, name: "Queseras del Medio",           position: [-0.2140, -78.4890] },
            { id: 18, name: "Ladrón de Guevara",            position: [-0.2107, -78.4919] },
            { id: 19, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] },
        ],
    },
    ruta4: {
        name: "Ruta 4: Cutuglagua", color: "#3b82f6",
        stops: [
            { id: 1,  name: "Av. Atacazo",                    position: [-0.32300, -78.55200] },
            { id: 2,  name: "Escuela Riobamba",               position: [-0.31300, -78.54500] },
            { id: 3,  name: "Av. Pedro Vicente Maldonado",    position: [-0.30300, -78.53800] },
            { id: 4,  name: "Adriano Coello Br.",             position: [-0.29300, -78.53200] },
            { id: 5,  name: "José Peralta",                   position: [-0.28200, -78.52600] },
            { id: 6,  name: "Av. Andrés Pérez",               position: [-0.27000, -78.51900] },
            { id: 7,  name: "Av. Guido Pérez",                position: [-0.25800, -78.51200] },
            { id: 8,  name: "Av. Napo",                       position: [-0.24500, -78.50500] },
            { id: 9,  name: "Pedro Pinto",                    position: [-0.22550, -78.49050] },
            { id: 10, name: "Av. Velasco Ibarra",             position: [-0.21700, -78.48400] },
            { id: 11, name: "Queseras del Medio",             position: [-0.21400, -78.48900] },
            { id: 12, name: "Ladrón de Guevara",              position: [-0.21070, -78.49190] },
            { id: 13, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] },
        ],
    },
    ruta5: {
        name: "Ruta 5: Quitumbe", color: "#3b82f6",
        stops: [
            { id: 1, name: "Esq. Av. Guayanay Ñan / Av. Pedro V. Maldonado", position: [-0.30250, -78.54100] },
            { id: 2, name: "Av. Guayanay Ñan",           position: [-0.29500, -78.53500] },
            { id: 3, name: "Av. Teniente Hugo Ortiz",     position: [-0.28200, -78.52700] },
            { id: 4, name: "Redondel del Cíclado",        position: [-0.27000, -78.52000] },
            { id: 5, name: "Av. Alonso de Angulo",        position: [-0.25700, -78.51400] },
            { id: 6, name: "Av. Sena",                    position: [-0.24400, -78.51200] },
            { id: 7, name: "Av. Velasco Ibarra",          position: [-0.21700, -78.48400] },
            { id: 8, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] },
        ],
    },
    ruta6: {
        name: "Ruta 6: Estadio del Aucas", color: "#3b82f6",
        stops: [
            { id: 1,  name: "Estadio del Aucas",              position: [-0.27850, -78.54550] },
            { id: 2,  name: "Av. Rumichaca Ñan",              position: [-0.27100, -78.54100] },
            { id: 3,  name: "Av. Solanda",                    position: [-0.26300, -78.53300] },
            { id: 4,  name: "Av. Cardenal de la Torre",       position: [-0.25500, -78.52600] },
            { id: 5,  name: "Av. Teniente Hugo Ortiz",        position: [-0.24600, -78.51900] },
            { id: 6,  name: "Calle General Quisquis",         position: [-0.23800, -78.51300] },
            { id: 7,  name: "Calle Cañaris",                  position: [-0.23300, -78.50900] },
            { id: 8,  name: "Calle General Epiclachima",      position: [-0.22800, -78.50500] },
            { id: 9,  name: "Av. 5 Junio",                    position: [-0.22300, -78.50100] },
            { id: 10, name: "Av. General Miller",             position: [-0.21800, -78.49800] },
            { id: 11, name: "Av. Mariscal Sucre",             position: [-0.21200, -78.50000] },
            { id: 12, name: "Av. Universitaria",              position: [-0.19970, -78.50380] },
            { id: 13, name: "Av. Patria",                     position: [-0.21000, -78.49500] },
            { id: 14, name: "Ladrón de Guevara",              position: [-0.21070, -78.49190] },
            { id: 15, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] },
        ],
    },
    ruta7: {
        name: "Ruta 7: Mitad del Mundo", color: "#3b82f6",
        stops: [
            { id: 1, name: "Super Akí San Antonio",          position: [0.00550,  -78.44850] },
            { id: 2, name: "Av. Equinoccial",                position: [-0.03200, -78.46000] },
            { id: 3, name: "Av. Manuel Córdova Galarza",     position: [-0.08000, -78.47000] },
            { id: 4, name: "Av. Mariscal Sucre",             position: [-0.15500, -78.50000] },
            { id: 5, name: "Av. Universitaria",              position: [-0.19970, -78.50380] },
            { id: 6, name: "Av. Patria",                     position: [-0.21000, -78.49500] },
            { id: 7, name: "Av. Ladrón de Guevara",          position: [-0.21070, -78.49190] },
            { id: 8, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] },
        ],
    },
    ruta8: {
        name: "Ruta 8: Mitad del Mundo (Alt.)", color: "#3b82f6",
        stops: [
            { id: 1, name: "Super Akí San Antonio",          position: [0.00550,  -78.44850] },
            { id: 2, name: "Av. Equinoccial",                position: [-0.03200, -78.46000] },
            { id: 3, name: "Av. Manuel Córdova Galarza",     position: [-0.08000, -78.47000] },
            { id: 4, name: "Av. Mariscal Sucre",             position: [-0.15500, -78.50000] },
            { id: 5, name: "Av. Universitaria",              position: [-0.19970, -78.50380] },
            { id: 6, name: "Av. Patria",                     position: [-0.21000, -78.49500] },
            { id: 7, name: "Av. Ladrón de Guevara",          position: [-0.21070, -78.49190] },
            { id: 8, name: "EPN - Escuela Politécnica Nacional", position: [-0.21073, -78.48884] },
        ],
    },
};

const puntosEstrategicos = [
    { id: 'p1', name: "Biblioteca Central",  position: [-0.2105, -78.4885], imagenPano: null },
    { id: 'p2', name: "Auditorio Principal", position: [-0.2100, -78.4890], imagenPano: null },
];

// ── ETA Banner — ahora en la parte SUPERIOR ────────────────────────────────
function ETABanner({ routeInfo, onClose, destination, destName }) {
    if (!routeInfo) return null;
    const h = Math.floor(routeInfo.durationMin / 60);
    const m = routeInfo.durationMin % 60;
    const eta = new Date(Date.now() + routeInfo.durationMin * 60000);
    const etaStr = eta.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });

    return (
        <div style={{
            position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
            zIndex: 1000, background: '#fff', borderRadius: 14,
            boxShadow: '0 4px 24px rgba(0,0,0,.18)',
            padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 14,
            minWidth: 300, maxWidth: '90%', border: '1.5px solid #e5e7eb',
        }}>
            <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    📍 {destName || (destination ? `${destination[0].toFixed(4)}, ${destination[1].toFixed(4)}` : '—')}
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                    {h > 0 ? `${h}h ` : ''}{m} min · {routeInfo.distanceKm} km
                </div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>
                    Llegada estimada: <strong style={{ color: '#2563eb' }}>{etaStr}</strong>
                </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 18, lineHeight: 1, padding: 4 }}>✕</button>
        </div>
    );
}

// ── Buscador de dirección con sugerencias ─────────────────────────────────
function AddressSearchBox({ onSelect, disabled }) {
    const [query, setQuery]       = useState('');
    const [results, setResults]   = useState([]);
    const [loading, setLoading]   = useState(false);
    const [focused, setFocused]   = useState(false);
    const debounceRef = useRef(null);

    const search = (val) => {
        setQuery(val);
        clearTimeout(debounceRef.current);
        if (val.trim().length < 3) { setResults([]); return; }
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await geocodeAddress(val);
                setResults(data.slice(0, 5));
            } catch { setResults([]); }
            setLoading(false);
        }, 500);
    };

    const pick = (item) => {
        setQuery(item.display_name.split(',').slice(0, 2).join(','));
        setResults([]);
        onSelect([parseFloat(item.lat), parseFloat(item.lon)], item.display_name.split(',').slice(0, 2).join(','));
    };

    return (
        <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: 6 }}>
                <input
                    type="text"
                    value={query}
                    onChange={e => search(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 200)}
                    placeholder="Buscar dirección o lugar…"
                    disabled={disabled}
                    style={{
                        flex: 1, padding: '8px 10px', borderRadius: 8,
                        border: '1.5px solid #d1d5db', fontSize: 13,
                        outline: 'none', background: disabled ? '#f9fafb' : '#fff',
                        color: '#111827',
                    }}
                />
                {loading && (
                    <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#9ca3af' }}>⟳</div>
                )}
            </div>
            {focused && results.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 2000,
                    background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb',
                    boxShadow: '0 8px 24px rgba(0,0,0,.12)', marginTop: 4, overflow: 'hidden',
                }}>
                    {results.map((r, i) => (
                        <div key={i} onMouseDown={() => pick(r)} style={{
                            padding: '8px 12px', fontSize: 12, color: '#374151', cursor: 'pointer',
                            borderBottom: i < results.length - 1 ? '1px solid #f3f4f6' : 'none',
                            lineHeight: 1.4,
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >
                            📍 {r.display_name.split(',').slice(0, 3).join(', ')}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const AdvancedMapComponent = () => {
    const [selectedRoute,        setSelectedRoute]        = useState('ruta6');
    const [selectedPoint,        setSelectedPoint]        = useState(null);
    const [mapCenter,            setMapCenter]            = useState([-0.26, -78.52]);
    const [isMobile,             setIsMobile]             = useState(window.innerWidth < 768);
    const [isRutaMenuOpen,       setIsRutaMenuOpen]       = useState(true);
    const [isPuntosMenuOpen,     setIsPuntosMenuOpen]     = useState(false);

    const [userLocation,         setUserLocation]         = useState(null);
    const [destination,          setDestination]          = useState(null);
    const [destName,             setDestName]             = useState('');
    const [isSettingDestination, setIsSettingDestination] = useState(false);
    const [routeInfo,            setRouteInfo]            = useState(null);
    const [locationError,        setLocationError]        = useState(null);
    const [locating,             setLocating]             = useState(false);
    const watchIdRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const startTracking = () => {
        if (!navigator.geolocation) { setLocationError('Tu navegador no soporta geolocalización.'); return; }
        setLocating(true); setLocationError(null);
        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => { const c = [pos.coords.latitude, pos.coords.longitude]; setUserLocation(c); setMapCenter(c); setLocating(false); },
            () => { setLocationError('No se pudo obtener tu ubicación.'); setLocating(false); },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
        );
    };

    const stopTracking = () => {
        if (watchIdRef.current !== null) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
        setUserLocation(null); setDestination(null); setDestName(''); setRouteInfo(null); setIsSettingDestination(false);
    };

    useEffect(() => () => { if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current); }, []);

    const handleSelectRoute = (key) => { setSelectedPoint(null); setSelectedRoute(key); };
    const handleSelectPoint = (punto) => { setSelectedRoute(null); setSelectedPoint(punto.id); setMapCenter(punto.position); };

    const handleMapClick = useCallback((coords) => {
        setDestination(coords); setDestName(''); setRouteInfo(null); setIsSettingDestination(false);
    }, []);

    const handleAddressSelect = (coords, name) => {
        setDestination(coords); setDestName(name); setRouteInfo(null);
        setMapCenter(coords);
    };

    const handleRouteFound = useCallback((info) => setRouteInfo(info), []);
    const clearDestination = () => { setDestination(null); setDestName(''); setRouteInfo(null); setIsSettingDestination(false); };

    const sidebarW   = isMobile ? '100%' : '285px';
    const btnBase    = { border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 6, transition: 'all .15s' };
    const primaryBtn = { ...btnBase, background: '#2563eb', color: '#fff' };
    const dangerBtn  = { ...btnBase, background: '#fee2e2', color: '#dc2626' };
    const warningBtn = { ...btnBase, background: isSettingDestination ? '#fef3c7' : '#f3f4f6', color: isSettingDestination ? '#92400e' : '#374151', border: isSettingDestination ? '2px solid #f59e0b' : '2px solid transparent' };
    const successBtn = { ...btnBase, background: '#dcfce7', color: '#16a34a' };

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 15, height: isMobile ? 'auto' : 620, fontFamily: 'system-ui,sans-serif' }}>

            {/* ── Sidebar ── */}
            <div style={{ width: sidebarW, order: isMobile ? 2 : 1, display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* Mi ubicación */}
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #ddd', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 15px', background: '#f8faff', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: '#1e40af' }}>📍 Mi Ubicación en Tiempo Real</span>
                    </div>
                    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {!userLocation ? (
                            <button style={primaryBtn} onClick={startTracking} disabled={locating}>
                                {locating ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Localizando…</> : <><span>🎯</span> Activar mi ubicación</>}
                            </button>
                        ) : (
                            <>
                                <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#166534', border: '1px solid #bbf7d0' }}>
                                    ✅ <strong>Ubicación activa</strong><br />
                                    <span style={{ color: '#15803d' }}>{userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)}</span>
                                </div>
                                <button style={dangerBtn} onClick={stopTracking}><span>⛔</span> Detener seguimiento</button>
                            </>
                        )}
                        {locationError && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#dc2626' }}>⚠️ {locationError}</div>
                        )}
                    </div>
                </div>

                {/* Destino — buscar + mapa */}
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #ddd', overflow: 'hidden' }}>
                    <div style={{ padding: '12px 15px', background: '#fff8f8', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: '#b91c1c' }}>🏁 Destino</span>
                    </div>
                    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {/* ── Buscador de dirección ── */}
                        <AddressSearchBox onSelect={handleAddressSelect} disabled={!userLocation} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: 11 }}>
                            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                            o
                            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                        </div>
                        {/* ── Selección en el mapa ── */}
                        <button style={warningBtn} onClick={() => setIsSettingDestination(s => !s)} disabled={!userLocation} title={!userLocation ? 'Activa tu ubicación primero' : ''}>
                            <span>{isSettingDestination ? '✋' : '🗺️'}</span>
                            {isSettingDestination ? 'Toca el mapa para fijar destino…' : 'Seleccionar destino en el mapa'}
                        </button>

                        {destination && (
                            <>
                                <div style={{ background: '#fff1f2', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#9f1239', border: '1px solid #fecdd3' }}>
                                    📌 <strong>Destino:</strong><br />
                                    {destName || `${destination[0].toFixed(5)}, ${destination[1].toFixed(5)}`}
                                </div>
                                <button style={successBtn} onClick={() => setMapCenter(destination)}><span>🔍</span> Centrar en destino</button>
                                <button style={dangerBtn}  onClick={clearDestination}><span>🗑️</span> Borrar destino</button>
                            </>
                        )}
                        {!userLocation && (
                            <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>Activa tu ubicación para calcular rutas.</p>
                        )}
                    </div>
                </div>

                {/* Rutas */}
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #ddd', overflow: 'hidden' }}>
                    <div onClick={() => setIsRutaMenuOpen(s => !s)} style={{ padding: '12px 15px', cursor: 'pointer', background: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>🚌 Seleccionar Ruta</span>
                        <span style={{ fontSize: 10 }}>{isRutaMenuOpen ? '▲' : '▼'}</span>
                    </div>
                    {isRutaMenuOpen && (
                        <div style={{ padding: 10, maxHeight: 200, overflowY: 'auto' }}>
                            {Object.keys(rutasData).map(key => (
                                <div key={key} onClick={() => handleSelectRoute(key)} style={{
                                    padding: '9px 12px', cursor: 'pointer', borderRadius: 7, marginBottom: 4,
                                    background: selectedRoute === key ? '#eff6ff' : '#fff',
                                    border: selectedRoute === key ? '1.5px solid #bfdbfe' : '1px solid #eee',
                                    fontSize: 13, color: selectedRoute === key ? '#1d4ed8' : '#374151',
                                    fontWeight: selectedRoute === key ? 600 : 400,
                                }}>
                                    {rutasData[key].name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Puntos estratégicos */}
                <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #ddd', overflow: 'hidden' }}>
                    <div onClick={() => setIsPuntosMenuOpen(s => !s)} style={{ padding: '12px 15px', cursor: 'pointer', background: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>🏛️ Puntos Estratégicos</span>
                        <span style={{ fontSize: 10 }}>{isPuntosMenuOpen ? '▲' : '▼'}</span>
                    </div>
                    {isPuntosMenuOpen && (
                        <div style={{ padding: 10 }}>
                            {puntosEstrategicos.map(punto => (
                                <div key={punto.id} onClick={() => handleSelectPoint(punto)} style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: 13 }}>
                                    {punto.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>

            {/* ── Mapa ── */}
            <div style={{ flex: 1, position: 'relative', height: isMobile ? 500 : '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>

                {/* Banner ETA — PARTE SUPERIOR */}
                {routeInfo && (
                    <ETABanner routeInfo={routeInfo} destination={destination} destName={destName} onClose={clearDestination} />
                )}

                {/* Indicador de modo crosshair */}
                {isSettingDestination && !routeInfo && (
                    <div style={{
                        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
                        zIndex: 1000, background: '#fef3c7', borderRadius: 8, padding: '8px 18px',
                        fontSize: 13, fontWeight: 600, color: '#92400e',
                        boxShadow: '0 4px 12px rgba(0,0,0,.15)', border: '1.5px solid #f59e0b',
                        pointerEvents: 'none',
                    }}>
                        🗺️ Toca el mapa para fijar tu destino
                    </div>
                )}

                <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <MapUpdater center={mapCenter} zoom={userLocation ? 15 : 12} />
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />

                    <MapClickHandler onMapClick={handleMapClick} isSettingDestination={isSettingDestination} />

                    {userLocation && (
                        <Marker position={userLocation} icon={userLocationIcon}>
                            <Popup>
                                <div style={{ fontSize: 13 }}>
                                    <strong>📍 Tu ubicación actual</strong><br />
                                    <span style={{ color: '#6b7280', fontSize: 11 }}>{userLocation[0].toFixed(6)}, {userLocation[1].toFixed(6)}</span>
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {destination && (
                        <Marker position={destination} icon={destinationIcon}>
                            <Popup>
                                <div style={{ fontSize: 13 }}>
                                    <strong>🏁 {destName || 'Destino'}</strong><br />
                                    <span style={{ color: '#6b7280', fontSize: 11 }}>{destination[0].toFixed(6)}, {destination[1].toFixed(6)}</span>
                                    {routeInfo && (
                                        <div style={{ marginTop: 6, color: '#2563eb', fontWeight: 600 }}>
                                            ⏱ {routeInfo.durationMin} min · {routeInfo.distanceKm} km
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Ruta en tiempo real: origen → destino */}
                    {userLocation && destination && (
                        <UserToDestinationRoute origin={userLocation} destination={destination} onRouteFound={handleRouteFound} />
                    )}

                    {/* Ruta de bus seleccionada (solo si no hay destino activo) */}
                    {selectedRoute && !destination && (
                        <>
                            {rutasData[selectedRoute].stops.map(stop => (
                                <CircleMarker key={stop.id} center={stop.position} radius={8}
                                    pathOptions={{ color: rutasData[selectedRoute].color, fillColor: '#fff', fillOpacity: 1, weight: 2.5 }}>
                                    <Popup><strong>{stop.name}</strong></Popup>
                                </CircleMarker>
                            ))}
                            <RoutingMachine waypoints={rutasData[selectedRoute].stops.map(s => s.position)} color={rutasData[selectedRoute].color} />
                        </>
                    )}

                    {puntosEstrategicos.map(punto => (
                        <CircleMarker key={punto.id} center={punto.position} radius={10}
                            pathOptions={{ color: selectedPoint === punto.id ? 'orange' : 'red', fillColor: selectedPoint === punto.id ? '#fde68a' : '#fca5a5', fillOpacity: 0.9, weight: 2 }}>
                            <Popup>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                                    <strong>{punto.name}</strong>
                                    {punto.imagenPano && (
                                        <button onClick={() => window.open(punto.imagenPano, '_blank')}
                                            style={{ padding: '5px 10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 12 }}>
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