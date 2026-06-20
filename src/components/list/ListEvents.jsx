import { MdDeleteForever, MdPublishedWithChanges } from "react-icons/md"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha'
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    })
}

const ListEvents = () => {
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = storeAuth()
    const navigate = useNavigate()

    const listEventos = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/eventos`
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            const data = response.data?.data || response.data
            setEventos(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error al cargar eventos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEliminar = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar este evento?")) return

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/eliminarevento/${id}`
            await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setEventos(eventos.filter(e => e._id !== id))
        } catch (error) {
            console.error('Error al eliminar:', error)
        }
    }

    useEffect(() => {
        listEventos()
    }, [])

    if (loading) return <p>Cargando...</p>

    return (
        <div className="overflow-x-auto shadow-lg mt-5">
            <table className="w-full min-w-[800px] table-auto shadow-lg bg-white">
                
                <thead className="bg-gray-800 text-slate-400">
                    <tr>
                        {["N°", "Nombre", "Organizador", "Ubicación", "Fecha", "Hora", "Información", "Imagen", "Acciónes"].map((header) => (
                            <th key={header} className="p-3 text-sm font-semibold uppercase">{header}</th>
                        ))}
                    </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-200">
                    {
                        eventos.map((evento, index) => (
                            <tr className="hover:bg-gray-100 text-center text-sm" key={evento._id || index}>
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{evento.nombre}</td>
                                <td className="p-3">{evento.organizador}</td>
                                <td className="p-3">{evento.ubicacion}</td>
                                <td className="p-3">{formatearFecha(evento.fecha)}</td>
                                <td className="p-3">{evento.hora}</td>
                                <td className="p-3 max-w-[150px] truncate">{evento.informacion}</td>
                                <td className="p-3">{evento.imagen ? "Sí" : "No"}</td>
                                <td className="p-3 flex justify-center gap-3">
                                    <button 
                                        onClick={() => navigate(`/dashboard/actualizarevento/${evento._id}`)}
                                        className="text-blue-600 hover:text-blue-800 text-xl"
                                    >
                                        <MdPublishedWithChanges />
                                    </button>
                                    <button 
                                        onClick={() => handleEliminar(evento._id)}
                                        className="text-red-600 hover:text-red-800 text-xl"
                                    >
                                        <MdDeleteForever />
                                    </button>
                                </td>
                            </tr>
                            
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ListEvents