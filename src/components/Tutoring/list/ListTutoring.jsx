import { MdDeleteForever, MdPublishedWithChanges, MdToggleOn, MdToggleOff } from "react-icons/md"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import storeAuth from "../../../context/storeAuth";
import storeProfile from "../../../context/storeProfile";

const mostrarCreador = (creador) => {
    if (!creador) return 'N/A'
    if (typeof creador === 'string') return creador
    return creador.nombre 
        ? `${creador.nombre} ${creador.apellido || ''}`.trim()
        : creador.email || 'N/A'
}

const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha'
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    })
}

const ListTutoring = () => {
    const [tutorias, setTutorias] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = storeAuth()
    const { user } = storeProfile()
    const navigate = useNavigate()

    const listTutorias = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/tutorias`
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            setTutorias(response.data?.data || [])
        } catch (error) {
            console.error('Error al cargar tutorias:', error)
        } finally {
            setLoading(false)
        }
    }

    const misTutorias = tutorias.filter(tutoria => {
        const docenteId = tutoria.docente?._id || tutoria.docente
        return docenteId === user?._id
    })

    const handleEliminar = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar este evento?")) return
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/tutoria/${id}`
            await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTutorias(tutorias.filter(e => e._id !== id))
        } catch (error) {
            console.error('Error al eliminar:', error)
        }
    }

    const handleToggleEstado = async (tutoria) => {
        const nuevoEstado = tutoria.estado === 'activo' ? 'inactivo' : 'activo'
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/tutoria/${tutoria._id}`
            await axios.put(url, { estado: nuevoEstado }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            setTutorias(tutorias.map(t =>
                t._id === tutoria._id ? { ...t, estado: nuevoEstado } : t
            ))
        } catch (error) {
            console.error('Error al cambiar estado:', error)
        }
    }

    useEffect(() => {
        if (token) listTutorias()
    }, [token])

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <p>Cargando...</p>
        </div>
    )

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-700">Lista de Tutorias</h2>
            </div>

            {misTutorias.length === 0 ? (
                <div
                    className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                    role="alert"
                >
                    <span className="font-medium">No existen registros de tutorias</span>
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-800 text-slate-400">
                            <tr>
                                {[
                                    "N°", "Titulo", "Docente", "Oficina", "Informacion",
                                    "Horarios", "Fecha", "Duración", "Cupo máx.",
                                    "Estado", "Acciones"
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="px-4 py-3 text-xs font-semibold uppercase whitespace-nowrap text-left"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {misTutorias.map((tutoria, index) => (
                                <tr
                                    key={tutoria._id || index}
                                    className="hover:bg-gray-50 text-gray-700"
                                >
                                    <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{tutoria.titulo}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{mostrarCreador(tutoria.docente)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{tutoria.oficina}</td>
                                    <td className="px-4 py-3 max-w-xs wrap-break-word">{tutoria.informacion}</td>
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
                                                className={`text-3xl transition-colors ${
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

export default ListTutoring