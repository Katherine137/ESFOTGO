import { MdDeleteForever, MdPublishedWithChanges } from "react-icons/md"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

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
        <table className="w-full mt-5 table-auto shadow-lg bg-white">
            
            <thead className="bg-gray-800 text-slate-400">
                <tr>
                    {["N°", "Nombre", "Organizador", "Ubicación", "Fecha", "Hora", "Información", "Imagen", "Acciónes"].map((header) => (
                        <th key={header} className="p-2">{header}</th>
                    ))}
                </tr>
            </thead>
            
            <tbody>
                {
                    eventos.map((evento, index) => (
                        <tr className="hover:bg-gray-300 text-center" key={evento._id || index}>
                            <td>{index + 1}</td>
                            <td>{evento.nombre}</td>
                            <td>{evento.organizador}</td>
                            <td>{evento.ubicacion}</td>
                            <td>{evento.fecha}</td>
                            <td>{evento.hora}</td>
                            <td>{evento.informacion}</td>
                            <td>{evento.imagen}</td>
                            <td className="p-2 flex justify-center gap-3">
                                <button 
                                    onClick={() => navigate(`/dashboard/actualizarevento/${evento._id}`)}
                                    className="text-blue-600 hover:text-blue-800 text-2xl"
                                >
                                    <MdPublishedWithChanges />
                                </button>
                                <button 
                                    onClick={() => handleEliminar(evento._id)}
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

export default ListEvents