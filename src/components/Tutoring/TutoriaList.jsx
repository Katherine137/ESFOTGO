import { MdDeleteForever, MdPublishedWithChanges, MdToggleOn, MdToggleOff } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useTutorias } from '../../hooks/tutoring/useTutorias'
import { tutoriaService } from '../../services/tutoriaService'
import { formatearFecha, mostrarCreador } from '../../utils/tutoriaUtils'
import storeAuth from '../../context/storeAuth'
import storeProfile from '../../context/storeProfile'
import { useState } from 'react'

const HEADERS = ['N°', 'Título', 'Docente', 'Oficina', 'Información', 'Horarios', 'Fecha', 'Duración', 'Cupo máx.', 'Estado', 'Acciones']

const TutoriaList = () => {
    const { tutorias, loading, handleEliminar, fetchTutorias } = useTutorias()
    const { token } = storeAuth()
    const { user } = storeProfile()
    const navigate = useNavigate()
    const [actualizandoId, setActualizandoId] = useState(null)

    const misTutorias = tutorias.filter(t => {
        const docenteId = t.docente?._id || t.docente
        return docenteId === user?._id
    })

    const handleToggleEstado = async (tutoria) => {
        const nuevoEstado = tutoria.estado === 'activo' ? 'inactivo' : 'activo'
        try {
            setActualizandoId(tutoria._id)
            await tutoriaService.toggleEstado(tutoria._id, nuevoEstado, token)
            fetchTutorias()
        } catch (error) {
            console.error('Error al cambiar estado:', error)
        } finally {
            setActualizandoId(null)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <p>Cargando...</p>
        </div>
    )

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-700">Lista de Tutorías</h2>
            </div>

            {misTutorias.length === 0 ? (
                <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                    <span className="font-medium">No existen registros de tutorías</span>
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-800 text-slate-400">
                            <tr>
                                {HEADERS.map(h => (
                                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase whitespace-nowrap text-left">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {misTutorias.map((tutoria, index) => (
                                <tr key={tutoria._id || index} className="hover:bg-gray-50 text-gray-700">
                                    <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{tutoria.titulo}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{mostrarCreador(tutoria.docente)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{tutoria.oficina}</td>
                                    <td className="px-4 py-3 max-w-xs break-words">{tutoria.informacion}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {tutoria.horarios?.length > 0
                                            ? tutoria.horarios.map((h, i) => (
                                                <div key={i}>{h.dia}: {h.horaInicio} – {h.horaFin}</div>
                                            ))
                                            : 'Sin horarios'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">{formatearFecha(tutoria.fecha)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {tutoria.duracion ? `${tutoria.duracion} min` : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">{tutoria.cupo_maximo ?? 'Sin límite'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            tutoria.estado === 'activo'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {tutoria.estado}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleEstado(tutoria)}
                                                disabled={actualizandoId === tutoria._id}
                                                className={`text-3xl transition-colors disabled:opacity-50 ${
                                                    tutoria.estado === 'activo'
                                                        ? 'text-green-600 hover:text-green-800'
                                                        : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                                title={tutoria.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                            >
                                                {tutoria.estado === 'activo' ? <MdToggleOn /> : <MdToggleOff />}
                                            </button>
                                            <button
                                                onClick={() => navigate(`/dashboard/actualizartutoria/${tutoria._id}`)}
                                                className="text-blue-600 hover:text-blue-800 text-2xl"
                                                title="Editar"
                                            >
                                                <MdPublishedWithChanges />
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(tutoria._id)}
                                                className="text-red-600 hover:text-red-800 text-2xl"
                                                title="Eliminar"
                                            >
                                                <MdDeleteForever />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default TutoriaList