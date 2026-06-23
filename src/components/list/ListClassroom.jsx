import { MdDeleteForever, MdInfo, MdPublishedWithChanges } from "react-icons/md"
import { useEffect, useState } from "react"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

const ListClassroom = () => {
    const [aulas, setAulas] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = storeAuth()

    const listAulas = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/aulas`
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            if (response.data && Array.isArray(response.data.data)) {
                setAulas(response.data.data) 
            } else {
                console.error("La estructura interna de la API cambió:", response.data)
                setAulas([])
            }
        } catch (error) {
            console.error('Error al cargar aulas:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        listAulas()
    }, [])

    if (loading) {
        return <p>Cargando...</p>
    }

    if (aulas.length === 0) {
        return (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50
            dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium">No existen registros de aulas</span>
            </div>
        )
    }

    return (
        <table className="w-full mt-5 table-auto shadow-lg bg-white">
            
            <thead className="bg-gray-800 text-slate-400">
                <tr>
                    {["N°", "Número", "Ubicación", "Tipo"].map((header) => (
                        <th key={header} className="p-2">{header}</th>
                    ))}
                </tr>
            </thead>
            
            <tbody>
                {
                    aulas.map((aula, index) => (
                        <tr className="hover:bg-gray-300 text-center" key={aula._id}>
                            <td>{index + 1}</td>
                            <td>{aula.numero}</td>
                            <td>{aula.ubicacion}</td>
                            <td>
                                <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded
                                    ${aula.tipo === 'aula' 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : 'bg-purple-100 text-purple-800'}`}
                                >
                                    {aula.tipo}
                                </span>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default ListClassroom