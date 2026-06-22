import { useEffect, useState } from "react"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

const ListRouts = () => {
    const [rutas, setRutas] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = storeAuth()

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

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <p>Cargando...</p>
        </div>
    )

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-700">Lista de Rutas</h2>
            </div>

            {rutas.length === 0 ? (
                <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <span className="font-medium">No existen registros de rutas</span>
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-800 text-slate-400">
                            <tr>
                                {["N°", "Nombre", "Descripción", "Color", "Activo"].map((header) => (
                                    <th key={header} className="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {rutas.map((ruta, index) => (
                                <tr className="hover:bg-gray-50 text-gray-700" key={ruta._id || index}>
                                    <td className="px-3 py-3 whitespace-nowrap">{index + 1}</td>
                                    <td className="px-3 py-3 whitespace-nowrap">{ruta.nombre}</td>
                                    <td className="px-3 py-3">{ruta.descripcion}</td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <span className="flex items-center gap-2">
                                            <span
                                                className="inline-block w-4 h-4 rounded-full border shrink-0"
                                                style={{ backgroundColor: ruta.color }}
                                            />
                                            {ruta.color}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            ruta.activo
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {ruta.activo ? 'Sí' : 'No'}
                                        </span>
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

export default ListRouts