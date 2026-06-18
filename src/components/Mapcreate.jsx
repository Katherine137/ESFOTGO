import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    MapContainer, TileLayer, CircleMarker, Polygon,
    Polyline, useMapEvents, Popup, Marker, useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import storeAuth from '../context/storeAuth';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORY_CONFIG = {
    academico:       { color: '#1B6BB0', label: 'Académico' },
    biblioteca:      { color: '#7C3AED', label: 'Biblioteca' },
    servicios:       { color: '#059669', label: 'Servicios' },
    deportes:        { color: '#DC2626', label: 'Deportes' },
    eventos:         { color: '#F59E0B', label: 'Eventos' },
    estacionamiento: { color: '#6B7280', label: 'Estacionamiento' },
    entrada:         { color: '#0EA5E9', label: 'Entrada' },
    otro:            { color: '#9CA3AF', label: 'Otro' },
};

function createPoiIcon(category) {
    const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.otro;
    return L.divIcon({
        className: '',
        html: `<div style="background:${config.color};color:#fff;padding:5px 9px;border-radius:8px;border:2.5px solid #fff;font-weight:800;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,.35);white-space:nowrap;">${config.label.charAt(0)}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
}

const newPoiIcon = L.divIcon({
    className: '',
    html: `<div style="width:32px;height:40px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4));"><svg viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg"><path d="M16 0C7.163 0 0 7.163 0 16c0 10.627 14.234 22.75 15.265 23.648a1 1 0 001.47 0C17.766 38.75 32 26.627 32 16 32 7.163 24.837 0 16 0z" fill="#FFB81C"/><circle cx="16" cy="16" r="7" fill="#fff"/><circle cx="16" cy="16" r="4" fill="#FFB81C"/></svg></div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
});

function haversineDistance(a, b) {
    const R = 6371000;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLon = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

const CLUSTER_RADIUS_M = 80;

function clusterPois(pois, zoomLevel) {
    if (zoomLevel >= 16 || pois.length < 8) return pois.map(p => ({ ...p, _isCluster: false }));

    const clusters = [];
    const assigned = new Set();

    pois.forEach((poi, i) => {
        if (assigned.has(i)) return;
        const group = [poi];
        assigned.add(i);

        pois.forEach((other, j) => {
        if (assigned.has(j)) return;
        const dist = haversineDistance(
            { lat: poi.latitud, lng: poi.longitud },
            { lat: other.latitud, lng: other.longitud }
        );
        if (dist <= CLUSTER_RADIUS_M) {
            group.push(other);
            assigned.add(j);
        }
        });

        if (group.length === 1) {
        clusters.push({ ...poi, _isCluster: false });
        } else {
        const centerLat = group.reduce((s, p) => s + p.latitud, 0) / group.length;
        const centerLng = group.reduce((s, p) => s + p.longitud, 0) / group.length;
        clusters.push({
            _isCluster: true,
            _count: group.length,
            _topCategory: group[0].categoria,
            latitud: centerLat,
            longitud: centerLng,
            nombre: `${group.length} lugares`,
            _items: group,
        });
        }
    });

    return clusters;
}

async function geocodeAddress(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ec`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'es' } });
    return res.json();
}

async function getOsrmRoute(origin, destination) {
    const url = `https://router.project-osrm.org/route/v1/walking/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM ${res.status}`);
    const json = await res.json();
    const route = json.routes?.[0];
    if (!route) throw new Error('Sin ruta');
    return {
        waypoints: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
        distance: Math.round(route.distance),
        duration: Math.round(route.duration),
    };
}

function MapClickHandler({ mode, onAddStop, onSetDestination, onAddPoiCoord }) {
    useMapEvents({
        click(e) {
        const { lat, lng } = e.latlng;
        if (mode === 'addStop')      onAddStop([lat, lng]);
        else if (mode === 'setDest') onSetDestination([lat, lng]);
        else if (mode === 'addPoi')  onAddPoiCoord({ lat, lng });
        },
    });
    return null;
}

function FlyTo({ center, zoom = 15 }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo(center, zoom, { duration: 1 });
    }, [center, zoom, map]);
    return null;
}

function PoiForm({ coord, editingPoi, isLoading, onSubmit, onCancel }) {
    const [name, setName]         = useState(editingPoi?.nombre || '');
    const [description, setDesc]  = useState(editingPoi?.descripcion || '');
    const [category, setCategory] = useState(editingPoi?.categoria || 'academico');

    useEffect(() => {
        if (editingPoi) {
        setName(editingPoi.nombre || '');
        setDesc(editingPoi.descripcion || '');
        setCategory(editingPoi.categoria || 'academico');
        }
    }, [editingPoi]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit({
        nombre:      name.trim(),
        descripcion: description.trim() || undefined,
        categoria:   category,
        latitud:     editingPoi ? editingPoi.latitud : coord?.lat,
        longitud:    editingPoi ? editingPoi.longitud : coord?.lng,
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{ margin: 0, color: '#1e40af', fontWeight: 700 }}>
            {editingPoi ? '✏️ Editar Ubicación' : '📍 Nueva Ubicación'}
        </h3>

        {coord && !editingPoi && (
            <small style={{ color: '#6b7280' }}>
            Coord: {coord.lat.toFixed(5)}, {coord.lng.toFixed(5)}
            </small>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Nombre *</label>
            <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej: Laboratorio de Cómputo"
            required
            style={inputStyle}
            />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Descripción</label>
            <textarea
            value={description}
            onChange={e => setDesc(e.target.value)}
            placeholder="Descripción del lugar..."
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
            />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Categoría</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                style={{
                    padding: '5px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    border: `1.5px solid ${category === key ? cfg.color : '#e5e7eb'}`,
                    background: category === key ? cfg.color : '#fff',
                    color: category === key ? '#fff' : '#374151',
                    cursor: 'pointer',
                }}
                >
                {cfg.label}
                </button>
            ))}
            </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={isLoading || !name.trim()}
            style={{ ...btnStyle, background: '#1d4ed8', flex: 1 }}>
            {isLoading ? '⟳ Guardando…' : editingPoi ? 'Actualizar' : 'Guardar'}
            </button>
            <button type="button" onClick={onCancel}
            style={{ ...btnStyle, background: '#6b7280', flex: 1 }}>
            Cancelar
            </button>
        </div>
        </form>
    );
}

function ZoneForm({ onSave, onCancel, isLoading }) {
    const [name, setName]     = useState('');
    const [color, setColor]   = useState('#ef4444');
    const [coords, setCoords] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
        const parsed = JSON.parse(coords);
        if (!Array.isArray(parsed) || parsed.length < 3)
            return alert('Mínimo 3 puntos para un polígono');
        const coordinates = parsed.map(c => ({
            latitude:  c.lat  ?? c.latitude,
            longitude: c.lng  ?? c.longitude,
        }));
        onSave({
            nombre:      name,
            fill_color:  color + '33',
            stroke_color: color,
            coordinates,
        });
        } catch {
        alert('JSON inválido en coordenadas');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{ margin: 0, color: '#b91c1c', fontWeight: 700 }}>🗺️ Nueva Zona</h3>

        <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Nombre de la zona" required style={inputStyle} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600 }}>Color:</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)}
            style={{ width: 40, height: 30, border: 'none', cursor: 'pointer' }} />
        </div>

        <textarea
            value={coords}
            onChange={e => setCoords(e.target.value)}
            placeholder={'[{"lat":-0.21,"lng":-78.49},{"lat":-0.211,"lng":-78.491},{"lat":-0.212,"lng":-78.489}]'}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', fontSize: 11 }}
        />

        <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={isLoading}
            style={{ ...btnStyle, background: '#dc2626', flex: 1 }}>
            {isLoading ? '⟳ Guardando…' : 'Crear Zona'}
            </button>
            <button type="button" onClick={onCancel}
            style={{ ...btnStyle, background: '#6b7280', flex: 1 }}>
            Cancelar
            </button>
        </div>
        </form>
    );
}

function SearchBar({ onSelectLocation, disabled }) {
    const [query, setQuery]     = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
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
        onSelectLocation([parseFloat(item.lat), parseFloat(item.lon)], item.display_name);
    };

    return (
        <div style={{ position: 'relative' }}>
        <input
            value={query}
            onChange={e => search(e.target.value)}
            placeholder="🔍 Buscar aula, edificio, lugar…"
            disabled={disabled}
            style={{ ...inputStyle, paddingLeft: 10 }}
        />
        {loading && <span style={{ position: 'absolute', right: 8, top: 8, fontSize: 12 }}>⟳</span>}
        {results.length > 0 && (
            <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 3000,
            background: '#fff', borderRadius: 8, border: '1px solid #e5e7eb',
            boxShadow: '0 8px 24px rgba(0,0,0,.12)', marginTop: 4,
            }}>
            {results.map((r, i) => (
                <div
                key={i}
                onMouseDown={() => pick(r)}
                style={{
                    padding: '8px 12px', fontSize: 12, cursor: 'pointer',
                    borderBottom: i < results.length - 1 ? '1px solid #f3f4f6' : 'none',
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

const inputStyle = {
    width: '100%', padding: '8px 10px', borderRadius: 8,
    border: '1.5px solid #d1d5db', fontSize: 13, outline: 'none',
    boxSizing: 'border-box',
};

const btnStyle = {
    padding: '9px 14px', borderRadius: 8, border: 'none',
    cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff',
};

const RUTAS_PREDEFINIDAS = {
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

const MapCreate = () => {
    const { token } = storeAuth();
    const [importando, setImportando] = useState(false);
    const [importProgress, setImportProgress] = useState({ actual: 0, total: 0, nombre: '' });

    const handleImportarRutas = async () => {
        if (!window.confirm('¿Importar las 8 rutas predefinidas a la base de datos? Esta acción no se puede deshacer si ya existen.')) return;
        setImportando(true);
        const rutas = Object.values(RUTAS_PREDEFINIDAS);
        setImportProgress({ actual: 0, total: rutas.length, nombre: '' });
        let exitosas = 0;
        let fallidas = 0;

        for (let i = 0; i < rutas.length; i++) {
            const ruta = rutas[i];
            setImportProgress({ actual: i + 1, total: rutas.length, nombre: ruta.name });
            try {
                const resRuta = await axiosAuth.post('/admin/bus/rutas', {
                    nombre: ruta.name,
                    color:  ruta.color,
                    activo: true,
                });
                const rutaId = resRuta.data.data?._id || resRuta.data._id;

                for (let j = 0; j < ruta.stops.length; j++) {
                    const stop = ruta.stops[j];
                    await axiosAuth.post('/admin/bus/paradas', {
                        ruta_id:  rutaId,
                        nombre:   stop.name,
                        latitud:  stop.position[0],
                        longitud: stop.position[1],
                        orden:    j,
                    });
                }
                exitosas++;
            } catch (err) {
                console.error(`Error importando ${ruta.name}:`, err.response?.data || err.message);
                fallidas++;
            }
        }

        setImportando(false);
        setImportProgress({ actual: 0, total: 0, nombre: '' });
        showMsg(
            fallidas === 0 ? 'success' : 'error',
            fallidas === 0
                ? `✅ ${exitosas} rutas importadas correctamente`
                : `⚠️ ${exitosas} exitosas, ${fallidas} fallidas`
        );
        fetchRoutes();
    };

    const BASE_URL = useMemo(() => {
        const url = import.meta.env.VITE_BACKEND_URL || '';
        return url.endsWith('/api') ? url : `${url}/api`;
    }, []);

    const axiosAuth = useMemo(() => {
        const instance = axios.create({ baseURL: BASE_URL });
        instance.interceptors.request.use((config) => {
        const t = token || localStorage.getItem('token');
        if (t) config.headers.Authorization = `Bearer ${t}`;
        return config;
        });
        instance.interceptors.response.use(
        (r) => r,
        (err) => {
            if (err.response?.status === 401) {
            console.warn('Token expirado o inválido. Redirige al login si es necesario.');
            }
            return Promise.reject(err);
        }
        );
        return instance;
    }, [BASE_URL, token]);

    const [activeTab,   setActiveTab]   = useState('pois');
    const [mapCenter,   setMapCenter]   = useState([-0.21073, -78.48884]);
    const [zoomLevel,   setZoomLevel]   = useState(15);
    const [mapMode,     setMapMode]     = useState('view');

    const [selCategory, setSelCategory] = useState(null);

    const [pois,         setPois]        = useState([]);
    const [loadingPois,  setLoadingPois] = useState(false);
    const [newPoiCoord,  setNewPoiCoord] = useState(null);
    const [editingPoi,   setEditingPoi]  = useState(null);
    const [showPoiForm,  setShowPoiForm] = useState(false);
    const [savingPoi,    setSavingPoi]   = useState(false);

    const [routeName,    setRouteName]   = useState('');
    const [routeColor,   setRouteColor]  = useState('#3b82f6');
    const [routePoints,  setRoutePoints] = useState([]);
    const [osrmLine,     setOsrmLine]    = useState([]);
    const [routeInfo,    setRouteInfo]   = useState(null);
    const [savingRoute,  setSavingRoute] = useState(false);
    const [savedRoutes,  setSavedRoutes] = useState([]);
    const [selRoute,     setSelRoute]    = useState(null);

    const [zones,        setZones]       = useState([]);
    const [showZoneForm, setShowZoneForm] = useState(false);
    const [savingZone,   setSavingZone]  = useState(false);

    const [destination,  setDestination] = useState(null);
    const [destName,     setDestName]    = useState('');

    const [message, setMessage] = useState({ type: '', text: '' });

    const showMsg = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const fetchPois = useCallback(async () => {
        setLoadingPois(true);
        try {
        const url = selCategory
            ? `/mapa/categoria/${selCategory}`
            : `/mapa/ubicaciones`;
        const res = await axiosAuth.get(url);
        const raw = Array.isArray(res.data) ? res.data : res.data.data || [];
        setPois(raw.map(d => ({
            _id:         d._id || d.id,
            nombre:      d.nombre || d.name || '',
            descripcion: d.descripcion || d.description || '',
            categoria:   d.categoria || d.category || 'otro',
            latitud:     d.latitud ?? d.latitude ?? 0,
            longitud:    d.longitud ?? d.longitude ?? 0,
        })));
        } catch {
        showMsg('error', 'Error al cargar ubicaciones');
        } finally {
        setLoadingPois(false);
        }
    }, [axiosAuth, selCategory]);

    useEffect(() => { fetchPois(); }, [fetchPois]);

    const fetchRoutes = useCallback(async () => {
        try {
        const res = await axiosAuth.get('/bus/rutas');
        setSavedRoutes(Array.isArray(res.data) ? res.data : res.data.data || []);
        } catch { }
    }, [axiosAuth]);

    useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

    const fetchZones = useCallback(async () => {
        try {
        const res = await axiosAuth.get('/admin/mapa/zonas');
        const raw = Array.isArray(res.data) ? res.data : res.data.data || [];
        setZones(raw.map(z => ({
            _id:         z._id || z.id,
            nombre:      z.nombre || z.name || '',
            coordinates: z.coordenadas || z.coordinates || [],
            fillColor:   z.fill_color   || z.fillColor   || 'rgba(239,68,68,0.2)',
            strokeColor: z.stroke_color || z.strokeColor || '#ef4444',
            isActive:    z.activo ?? z.isActive ?? true,
        })));
        } catch { }
    }, [axiosAuth]);

    useEffect(() => { fetchZones(); }, [fetchZones]);

    const clusteredPois = clusterPois(pois, zoomLevel);

    const handleAddStop = useCallback((coords) => {
        setRoutePoints(prev => [...prev, coords]);
    }, []);

    const handleSetDestination = useCallback((coords) => {
        setDestination(coords);
        setDestName('');
        setMapMode('view');
    }, []);

    const handleAddPoiCoord = useCallback((coord) => {
        setNewPoiCoord(coord);
        setEditingPoi(null);
        setShowPoiForm(true);
        setMapMode('view');
    }, []);

    useEffect(() => {
        if (routePoints.length < 2) { setOsrmLine([]); setRouteInfo(null); return; }
        const last = routePoints[routePoints.length - 1];
        const prev = routePoints[routePoints.length - 2];

        getOsrmRoute(
        { lat: prev[0], lng: prev[1] },
        { lat: last[0], lng: last[1] }
        ).then(r => {
        setOsrmLine(old => [...old, ...r.waypoints]);
        setRouteInfo(r);
        }).catch(() => {
        setOsrmLine(old => [...old, prev, last]);
        });
    }, [routePoints]);

    const handleSavePoi = async (poiData) => {
        setSavingPoi(true);
        try {
        if (editingPoi) {
            await axiosAuth.put(
            `/admin/mapa/ubicaciones/${editingPoi._id}`,
            { nombre: poiData.nombre, descripcion: poiData.descripcion, categoria: poiData.categoria }
            );
            showMsg('success', 'Ubicación actualizada');
        } else {
            await axiosAuth.post(
            '/admin/mapa/ubicaciones',
            { nombre: poiData.nombre, descripcion: poiData.descripcion,
                categoria: poiData.categoria, latitud: poiData.latitud, longitud: poiData.longitud }
            );
            showMsg('success', 'Ubicación creada');
        }
        setShowPoiForm(false);
        setNewPoiCoord(null);
        setEditingPoi(null);
        fetchPois();
        } catch (err) {
        const msg = err.response?.status === 401
            ? 'Sesión expirada, vuelve a iniciar sesión'
            : err.response?.data?.message || err.response?.data?.msg || 'Error al guardar';
        showMsg('error', msg);
        } finally {
        setSavingPoi(false);
        }
    };

    const handleDeletePoi = async (poi) => {
        if (!window.confirm(`¿Eliminar "${poi.nombre}"?`)) return;
        try {
        await axiosAuth.delete(`/admin/mapa/ubicaciones/${poi._id}`);
        showMsg('success', 'Ubicación eliminada');
        fetchPois();
        } catch (err) {
        const msg = err.response?.status === 401
            ? 'Sesión expirada, vuelve a iniciar sesión'
            : 'Error al eliminar';
        showMsg('error', msg);
        }
    };

    const handleSaveRoute = async () => {
        if (!routeName.trim() || routePoints.length < 2)
        return showMsg('error', 'Completa el nombre y al menos 2 paradas');
        setSavingRoute(true);
        try {
        const resRuta = await axiosAuth.post('/admin/bus/rutas', {
            nombre: routeName, color: routeColor, activo: true,
        });
        const rutaId = resRuta.data.data?._id || resRuta.data._id;

        for (let i = 0; i < routePoints.length; i++) {
            await axiosAuth.post('/admin/bus/paradas', {
            ruta_id:  rutaId,
            nombre:   `Parada ${i + 1}`,
            latitud:  routePoints[i][0],
            longitud: routePoints[i][1],
            orden:    i,
            });
        }

        showMsg('success', 'Ruta guardada');
        setRouteName('');
        setRoutePoints([]);
        setOsrmLine([]);
        setRouteInfo(null);
        fetchRoutes();
        } catch (err) {
        const msg = err.response?.status === 401
            ? 'Sesión expirada, vuelve a iniciar sesión'
            : err.response?.data?.message || err.response?.data?.msg || 'Error al guardar ruta';
        showMsg('error', msg);
        } finally {
        setSavingRoute(false);
        }
    };

    const handleSaveZone = async (zoneData) => {
        setSavingZone(true);
        try {
        await axiosAuth.post('/admin/mapa/zonas', {
            nombre:       zoneData.nombre,
            coordenadas:  zoneData.coordinates,
            fill_color:   zoneData.fill_color,
            stroke_color: zoneData.stroke_color,
            activo:       true,
        });
        showMsg('success', 'Zona creada');
        setShowZoneForm(false);
        fetchZones();
        } catch (err) {
        const msg = err.response?.status === 401
            ? 'Sesión expirada, vuelve a iniciar sesión'
            : err.response?.data?.message || err.response?.data?.msg || 'Error al guardar zona';
        showMsg('error', msg);
        } finally {
        setSavingZone(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: 700, fontFamily: 'system-ui,sans-serif' }}>

        <div style={{
            display: 'flex', gap: 6, padding: '10px 12px',
            background: '#f8faff', borderBottom: '1px solid #e5e7eb',
        }}>
            {[
            { key: 'pois',  label: '📍 Ubicaciones' },
            { key: 'rutas', label: '🚌 Rutas' },
            { key: 'zonas', label: '⚠️ Zonas' },
            ].map(tab => (
            <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setMapMode('view'); }}
                style={{
                padding: '8px 16px', borderRadius: 8, border: 'none',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                background: activeTab === tab.key ? '#1d4ed8' : '#fff',
                color:      activeTab === tab.key ? '#fff'    : '#374151',
                boxShadow: '0 1px 3px rgba(0,0,0,.1)',
                }}
            >
                {tab.label}
            </button>
            ))}
        </div>

        {message.text && (
            <div style={{
            padding: '8px 14px', fontSize: 13, fontWeight: 600,
            background: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
            color:      message.type === 'error' ? '#dc2626' : '#16a34a',
            borderBottom: `2px solid ${message.type === 'error' ? '#fca5a5' : '#86efac'}`,
            }}>
            {message.type === 'error' ? '❌' : '✅'} {message.text}
            </div>
        )}

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

            <div style={{
            width: 280, overflowY: 'auto', padding: 12,
            background: '#fff', borderRight: '1px solid #e5e7eb',
            display: 'flex', flexDirection: 'column', gap: 12,
            }}>

            <SearchBar
                onSelectLocation={(coords, name) => {
                setMapCenter(coords);
                setDestination(coords);
                setDestName(name);
                }}
                disabled={false}
            />

            {activeTab === 'pois' && (
                <>
                <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280',
                    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                    Categoría
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    <button
                        onClick={() => setSelCategory(null)}
                        style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        border: '1.5px solid ' + (!selCategory ? '#1d4ed8' : '#e5e7eb'),
                        background: !selCategory ? '#1d4ed8' : '#fff',
                        color: !selCategory ? '#fff' : '#374151',
                        cursor: 'pointer',
                        }}
                    >
                        Todos
                    </button>
                    {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                        <button
                        key={key}
                        onClick={() => setSelCategory(selCategory === key ? null : key)}
                        style={{
                            padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                            border: `1.5px solid ${selCategory === key ? cfg.color : '#e5e7eb'}`,
                            background: selCategory === key ? cfg.color : '#fff',
                            color: selCategory === key ? '#fff' : '#374151',
                            cursor: 'pointer',
                        }}
                        >
                        {cfg.label}
                        </button>
                    ))}
                    </div>
                </div>

                <button
                    onClick={() => setMapMode(mapMode === 'addPoi' ? 'view' : 'addPoi')}
                    style={{
                    ...btnStyle,
                    background: mapMode === 'addPoi' ? '#fef3c7' : '#1d4ed8',
                    color:      mapMode === 'addPoi' ? '#92400e' : '#fff',
                    border: mapMode === 'addPoi' ? '2px solid #f59e0b' : 'none',
                    }}
                >
                    {mapMode === 'addPoi' ? '👆 Toca el mapa para añadir…' : '+ Nueva Ubicación'}
                </button>

                {showPoiForm && (
                    <div style={{
                    background: '#f8faff', borderRadius: 8,
                    padding: 12, border: '1.5px solid #bfdbfe',
                    }}>
                    <PoiForm
                        coord={newPoiCoord}
                        editingPoi={editingPoi}
                        isLoading={savingPoi}
                        onSubmit={handleSavePoi}
                        onCancel={() => {
                        setShowPoiForm(false);
                        setNewPoiCoord(null);
                        setEditingPoi(null);
                        }}
                    />
                    </div>
                )}

                <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280',
                    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                    Ubicaciones ({pois.length}){loadingPois && ' ⟳'}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {pois.map(poi => {
                        const cfg = CATEGORY_CONFIG[poi.categoria] || CATEGORY_CONFIG.otro;
                        return (
                        <div
                            key={poi._id}
                            style={{
                            padding: '8px 10px', borderRadius: 8,
                            border: '1px solid #e5e7eb', background: '#fff',
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', cursor: 'pointer',
                            }}
                            onClick={() => setMapCenter([poi.latitud, poi.longitud])}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {poi.nombre}
                            </div>
                            <span style={{
                                fontSize: 10, fontWeight: 700,
                                background: cfg.color + '20', color: cfg.color,
                                padding: '1px 6px', borderRadius: 6,
                            }}>
                                {cfg.label}
                            </span>
                            </div>
                            <div style={{ display: 'flex', gap: 4, marginLeft: 6 }}>
                            <button
                                onClick={e => {
                                e.stopPropagation();
                                setEditingPoi(poi);
                                setNewPoiCoord(null);
                                setShowPoiForm(true);
                                }}
                                style={{ ...btnStyle, padding: '3px 7px', background: '#3b82f6', fontSize: 11 }}
                            >
                                ✏️
                            </button>
                            <button
                                onClick={e => { e.stopPropagation(); handleDeletePoi(poi); }}
                                style={{ ...btnStyle, padding: '3px 7px', background: '#ef4444', fontSize: 11 }}
                            >
                                🗑️
                            </button>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                </div>
                </>
            )}

            {activeTab === 'rutas' && (
                <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input value={routeName} onChange={e => setRouteName(e.target.value)}
                    placeholder="Nombre de la ruta" style={inputStyle} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ fontSize: 12, fontWeight: 600 }}>Color:</label>
                    <input type="color" value={routeColor}
                        onChange={e => setRouteColor(e.target.value)}
                        style={{ width: 40, height: 30, border: 'none', cursor: 'pointer' }} />
                    </div>
                </div>

                <button
                    onClick={() => setMapMode(mapMode === 'addStop' ? 'view' : 'addStop')}
                    style={{
                    ...btnStyle,
                    background: mapMode === 'addStop' ? '#fef3c7' : '#059669',
                    color:      mapMode === 'addStop' ? '#92400e' : '#fff',
                    border: mapMode === 'addStop' ? '2px solid #f59e0b' : 'none',
                    }}
                >
                    {mapMode === 'addStop' ? '👆 Toca el mapa para añadir parada…' : '+ Agregar Parada'}
                </button>

                {routePoints.length > 0 && (
                    <div style={{ background: '#f0fdf4', borderRadius: 8,
                    padding: 10, border: '1px solid #86efac' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', margin: '0 0 6px' }}>
                        {routePoints.length} parada(s) agregada(s)
                    </p>
                    {routeInfo && (
                        <p style={{ fontSize: 12, color: '#15803d', margin: '0 0 6px' }}>
                        📏 {(routeInfo.distance / 1000).toFixed(2)} km ·
                        ⏱ {Math.ceil(routeInfo.duration / 60)} min
                        </p>
                    )}
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={handleSaveRoute} disabled={savingRoute}
                        style={{ ...btnStyle, background: '#16a34a', flex: 1 }}>
                        {savingRoute ? '⟳ Guardando…' : '💾 Guardar Ruta'}
                        </button>
                        <button onClick={() => {
                        setRoutePoints([]); setOsrmLine([]); setRouteInfo(null);
                        }} style={{ ...btnStyle, background: '#ef4444' }}>
                        🗑️
                        </button>
                    </div>
                    </div>
                )}

                <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280',
                    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                    Rutas ({savedRoutes.length})
                    </p>
                    {savedRoutes.map(r => {
                    const isActive = selRoute?._id === (r._id || r.id);
                    return (
                        <div key={r._id || r.id}
                        onClick={() => setSelRoute(isActive ? null : r)}
                        style={{
                            padding: '8px 10px', borderRadius: 8, marginBottom: 4, cursor: 'pointer',
                            border: `1.5px solid ${isActive ? r.color : '#e5e7eb'}`,
                            background: isActive ? r.color + '18' : '#fff',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}
                        >
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: r.color }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                            {r.nombre || r.name}
                        </span>
                        </div>
                    );
                    })}
                </div>
                </>
            )}

            {activeTab === 'zonas' && (
                <>
                <button
                    onClick={() => setShowZoneForm(!showZoneForm)}
                    style={{ ...btnStyle, background: '#dc2626' }}
                >
                    {showZoneForm ? 'Cancelar' : '+ Nueva Zona'}
                </button>

                {showZoneForm && (
                    <div style={{ background: '#fff5f5', borderRadius: 8,
                    padding: 12, border: '1.5px solid #fca5a5' }}>
                    <ZoneForm
                        isLoading={savingZone}
                        onSave={handleSaveZone}
                        onCancel={() => setShowZoneForm(false)}
                    />
                    </div>
                )}

                <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280',
                    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                    Zonas ({zones.length})
                    </p>
                    {zones.map(z => (
                    <div key={z._id} style={{
                        padding: '8px 10px', borderRadius: 8, marginBottom: 4,
                        border: '1px solid #e5e7eb', background: '#fff',
                        display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: z.strokeColor }} />
                        <span style={{ fontSize: 13, color: '#111827' }}>{z.nombre}</span>
                    </div>
                    ))}
                </div>
                </>
            )}
            </div>

            <div style={{ flex: 1, position: 'relative' }}>

            <div style={{
                background: '#eff6ff', borderRadius: 8,
                padding: 12, border: '1px solid #bfdbfe',
            }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#1e40af',
                    textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>
                    Importar rutas predefinidas
                </p>
                {importando && importProgress.total > 0 && (
                    <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 12, color: '#374151', marginBottom: 4 }}>
                            Importando {importProgress.actual}/{importProgress.total}: {importProgress.nombre}
                        </div>
                        <div style={{ background: '#e5e7eb', borderRadius: 99, height: 6 }}>
                            <div style={{
                                background: '#3b82f6', borderRadius: 99, height: 6,
                                width: `${(importProgress.actual / importProgress.total) * 100}%`,
                                transition: 'width 0.3s',
                            }} />
                        </div>
                    </div>
                )}
                <button
                    onClick={handleImportarRutas}
                    disabled={importando}
                    style={{ ...btnStyle, background: importando ? '#93c5fd' : '#2563eb', width: '100%' }}
                >
                    {importando
                        ? `⟳ Importando ${importProgress.actual}/${importProgress.total}…`
                        : '📥 Importar 8 Rutas Predefinidas'}
                </button>
            </div>

            {mapMode !== 'view' && (
                <div style={{
                position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                zIndex: 1000, background: '#fef3c7', borderRadius: 8, padding: '7px 16px',
                fontSize: 13, fontWeight: 600, color: '#92400e',
                boxShadow: '0 4px 12px rgba(0,0,0,.15)',
                border: '1.5px solid #f59e0b', pointerEvents: 'none',
                }}>
                {mapMode === 'addPoi'  && '📍 Toca el mapa para colocar la nueva ubicación'}
                {mapMode === 'addStop' && '🚌 Toca el mapa para agregar una parada'}
                {mapMode === 'setDest' && '🏁 Toca el mapa para fijar el destino'}
                </div>
            )}

            <MapContainer
                center={mapCenter}
                zoom={zoomLevel}
                style={{ height: '100%', width: '100%' }}
                whenReady={({ target: map }) => {
                map.on('zoomend', () => setZoomLevel(map.getZoom()));
                }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap' />

                <FlyTo center={mapCenter} zoom={15} />

                <MapClickHandler
                mode={mapMode}
                onAddStop={handleAddStop}
                onSetDestination={handleSetDestination}
                onAddPoiCoord={handleAddPoiCoord}
                />

                {newPoiCoord && (
                <Marker position={[newPoiCoord.lat, newPoiCoord.lng]} icon={newPoiIcon}>
                    <Popup>Nueva ubicación</Popup>
                </Marker>
                )}

                {clusteredPois.map((item, idx) =>
                item._isCluster ? (
                    <CircleMarker
                    key={`cluster-${idx}`}
                    center={[item.latitud, item.longitud]}
                    radius={Math.min(22, 12 + item._count * 1.5)}
                    pathOptions={{
                        color: CATEGORY_CONFIG[item._topCategory]?.color || '#6b7280',
                        fillColor: CATEGORY_CONFIG[item._topCategory]?.color || '#6b7280',
                        fillOpacity: 0.85, weight: 2.5,
                    }}
                    >
                    <Popup>
                        <strong>{item._count} lugares</strong><br />
                        {item._items.map(p => <div key={p._id} style={{ fontSize: 12 }}>{p.nombre}</div>)}
                    </Popup>
                    </CircleMarker>
                ) : (
                    <Marker
                    key={item._id}
                    position={[item.latitud, item.longitud]}
                    icon={createPoiIcon(item.categoria)}
                    >
                    <Popup>
                        <div style={{ minWidth: 160 }}>
                        <strong style={{ fontSize: 14 }}>{item.nombre}</strong>
                        {item.descripcion && (
                            <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0' }}>
                            {item.descripcion}
                            </p>
                        )}
                        <span style={{
                            fontSize: 10, fontWeight: 700,
                            background: (CATEGORY_CONFIG[item.categoria]?.color || '#9ca3af') + '20',
                            color: CATEGORY_CONFIG[item.categoria]?.color || '#9ca3af',
                            padding: '2px 8px', borderRadius: 6,
                        }}>
                            {CATEGORY_CONFIG[item.categoria]?.label || 'Otro'}
                        </span>
                        </div>
                    </Popup>
                    </Marker>
                )
                )}

                {routePoints.map((p, i) => (
                <CircleMarker key={`stop-${i}`} center={p} radius={9}
                    pathOptions={{
                    color: i === 0 ? '#16a34a' : i === routePoints.length - 1 ? '#dc2626' : routeColor,
                    fillColor: '#fff', fillOpacity: 1, weight: 2.5,
                    }}>
                    <Popup>{i === 0 ? '🟢 Inicio' : i === routePoints.length - 1 ? '🔴 Fin' : `Parada ${i + 1}`}</Popup>
                </CircleMarker>
                ))}

                {osrmLine.length > 1 && (
                <Polyline
                    positions={osrmLine}
                    pathOptions={{ color: routeColor, weight: 5, opacity: 0.85 }}
                />
                )}

                {zones.filter(z => z.isActive).map(zone => (
                <Polygon
                    key={zone._id}
                    positions={zone.coordinates.map(c => [
                    c.lat ?? c.latitude,
                    c.lng ?? c.longitude,
                    ])}
                    pathOptions={{
                    fillColor: zone.fillColor,
                    color:     zone.strokeColor,
                    weight: 2, fillOpacity: 0.4,
                    }}
                >
                    <Popup><strong>{zone.nombre}</strong></Popup>
                </Polygon>
                ))}

                {destination && (
                <CircleMarker center={destination} radius={10}
                    pathOptions={{ color: '#dc2626', fillColor: '#fca5a5',
                    fillOpacity: 0.9, weight: 2.5 }}>
                    <Popup>🏁 {destName || 'Destino'}</Popup>
                </CircleMarker>
                )}
            </MapContainer>
            </div>
        </div>
        </div>
    );
};

export default MapCreate;