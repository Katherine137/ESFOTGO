import { MdDeleteForever, MdInfo, MdPublishedWithChanges } from "react-icons/md"
import { useEffect, useState } from "react"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

const ListEvents = () => {
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = storeAuth()

    const listEventos = async () => {
    try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/eventos`
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        // ✅ El array puede estar en response.data.data o directo en response.data
        const data = response.data?.data || response.data
        setEventos(Array.isArray(data) ? data : [])
    } catch (error) {
        console.error('Error al cargar eventos:', error)
    } finally {
        setLoading(false)
    }
}

    useEffect(() => {
        listEventos()
    }, [])

    if (loading) {
        return <p>Cargando...</p>
    }

    if (eventos.length === 0) {
        return (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50
            dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium">No existen registros de eventos</span>
            </div>
        )
    }

    return (
        <table className="w-full mt-5 table-auto shadow-lg bg-white">
            
            <thead className="bg-gray-800 text-slate-400">
                <tr>
                    {["N°", "Nombre", "Organizador", "Ubicación", "Fecha", "Hora", "Información"].map((header) => (
                        <th key={header} className="p-2">{header}</th>
                    ))}
                </tr>
            </thead>
            
            <tbody>
                {
                    eventos.map((evento, index) => (
                        <tr className="hover:bg-gray-300 text-center" key={evento._id}>
                            <td>{index + 1}</td>
                            <td>{evento.nombre}</td>
                            <td>{evento.organizador}</td>
                            <td>{evento.ubicacion}</td>
                            <td>{evento.fecha}</td>
                            <td>{evento.hora}</td>
                            <td>{evento.informacion}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default ListEvents