import { MdPublishedWithChanges } from 'react-icons/md'
import useEventos from '../../hooks/events/useEventos'
import { formatearFecha } from '../../utils/eventoUtils'

const HEADERS = ['N°', 'Nombre', 'Organizador', 'Ubicación', 'Fecha', 'Hora', 'Información', 'Imagen', 'Acciones']

const EventoRow = ({ index, evento, onEditar }) => (
    <tr className="hover:bg-gray-50 text-gray-700">
        <td className="px-3 py-3 whitespace-nowrap">{index + 1}</td>
        <td className="px-3 py-3 whitespace-nowrap">{evento.nombre}</td>
        <td className="px-3 py-3 whitespace-nowrap">{evento.organizador}</td>
        <td className="px-3 py-3 whitespace-nowrap">{evento.ubicacion}</td>
        <td className="px-3 py-3 whitespace-nowrap">{formatearFecha(evento.fecha)}</td>
        <td className="px-3 py-3 whitespace-nowrap">{evento.hora}</td>
        <td className="px-3 py-3 max-w-40">
            <p className="truncate" title={evento.informacion}>{evento.informacion}</p>
        </td>
        <td className="px-3 py-3 whitespace-nowrap">{evento.imagen ? 'Sí' : 'No'}</td>
        <td className="px-3 py-3">
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => onEditar(evento._id)}
                    className="text-blue-600 hover:text-blue-800 text-xl"
                    title="Editar evento"
                >
                    <MdPublishedWithChanges />
                </button>
            </div>
        </td>
    </tr>
)

const EventoList = () => {
    const { eventos, loading, handleEditar } = useEventos({ mode: 'private' })

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <p>Cargando...</p>
        </div>
    )

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-700">Lista de Eventos</h2>
            </div>

            {eventos.length === 0 ? (
                <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                    <span className="font-medium">No existen registros de eventos</span>
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-800 text-slate-400">
                            <tr>
                                {HEADERS.map(h => (
                                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {eventos.map((evento, index) => (
                                <EventoRow
                                    key={evento._id || index}
                                    index={index}
                                    evento={evento}
                                    onEditar={handleEditar}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default EventoList