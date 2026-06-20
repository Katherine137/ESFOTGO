import { MdDeleteForever, MdPublishedWithChanges } from "react-icons/md"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

const ListRouts = () => {
    const [rutas, setRutas] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = storeAuth()
    const navigate = useNavigate()

    const listRutas = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/bus/rutas`
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            const data = response.data?.data || response.data
            setRutas(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error al cargar rutas:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        listRutas()
    }, [])

    if (loading) return <p>Cargando...</p>
    if (rutas.length === 0) return <p>No hay rutas disponibles.</p>

    return (
        <div className="overflow-x-auto shadow-lg mt-5">
            <table className="w-full min-w-[800px] table-auto shadow-lg bg-white">
                
                <thead className="bg-gray-800 text-slate-400">
                    <tr>
                        {["N°", "Nombre", "Descripción", "Color", "Activo"].map((header) => (
                            <th key={header} className="p-3 text-sm font-semibold uppercase">{header}</th>
                        ))}
                    </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-200">
                    {
                        rutas.map((ruta, index) => (
                            <tr className="hover:bg-gray-100 text-center text-sm" key={ruta._id || index}>
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{ruta.nombre}</td>
                                <td className="p-3">{ruta.descripcion}</td>
                                <td className="p-3">
                                    <span className="flex items-center justify-center gap-2">
                                        <span
                                            className="inline-block w-4 h-4 rounded-full border"
                                            style={{ backgroundColor: ruta.color }}
                                        />
                                        {ruta.color}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${ruta.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                        {ruta.activo ? 'Sí' : 'No'}
                                    </span>
                                </td>
                            </tr>
                            
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ListRouts