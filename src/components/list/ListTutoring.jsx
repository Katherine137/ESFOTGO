import { MdDeleteForever, MdPublishedWithChanges } from "react-icons/md"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

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
            console.log('Respuesta completa:', response.data)
            console.log('creado_por de la primera tutoria:', response.data?.data?.[0]?.creado_por)
            setTutorias(response.data?.data || [])
        } catch (error) {
            console.error('Error al cargar tutorias:', error)
        } finally {
            setLoading(false)
        }
    }

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

    useEffect(() => {
        if (token) {
            listTutorias()
        }
    }, [token])

    if (loading) return <p>Cargando...</p>

    return(
        <table className="w-full mt-5 table-auto shadow-lg bg-white">
            <thead className="bg-gray-800 text-slate-400">
                <tr>
                    {["N°", "Titulo", "Docente", "Oficina", "Informacion", "Horarios", "Fecha", "Duracion", "Cupo_maximo", "Creado_por", "Estado", "Acciónes"].map((header) => (
                        <th key={header} className="p-2">{header}</th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {
                    tutorias.map((tutoria, index) => (
                        <tr className="hover:bg-gray-300 text-center" key={tutoria._id || index}>
                            <td>{index + 1}</td>
                            <td>{tutoria.titulo}</td>
                            <td>{tutoria.docente}</td>
                            <td>{tutoria.oficina}</td>
                            <td>{tutoria.informacion}</td>
                            <td>
                                {tutoria.horarios?.length > 0
                                    ? tutoria.horarios.map((h, i) => (
                                        <div key={i}>{h.dia}: {h.horaInicio} – {h.horaFin}</div>
                                    ))
                                    : 'Sin horarios'}
                            </td>
                            <td>{formatearFecha(tutoria.fecha)}</td>
                            <td>{tutoria.duracion ? `${tutoria.duracion} min` : 'N/A'}</td>
                            <td>{tutoria.cupo_maximo ?? 'Sin límite'}</td>
                            <td>{mostrarCreador(tutoria.creado_por)}</td>
                            <td>{tutoria.estado}</td>
                            <td className="p-2 flex justify-center gap-3">
                                <button 
                                    onClick={() => navigate(`/dashboard/actualizartutoria/${tutoria._id}`)}
                                    className="text-blue-600 hover:text-blue-800 text-2xl"
                                >
                                    <MdPublishedWithChanges />
                                </button>
                                <button 
                                    onClick={() => handleEliminar(tutoria._id)}
                                    className="text-red-600 hover:text-red-800 text-2xl"
                                >
                                    <MdDeleteForever />
                                </button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default ListTutoring