import { MdDeleteForever, MdPublishedWithChanges } from "react-icons/md"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

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
            const data = response.data?.data || response.data
            setTutorias(response.data.data || [])
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
                            <td>{tutoria.horarios}</td>
                            <td>{tutoria.fecha}</td>
                            <td>{tutoria.duracion}</td>
                            <td>{tutoria.cupo_maximo}</td>
                            <td>{tutoria.creado_por}</td>
                            <td>{tutoria.estado}</td>
                            <td className="p-2 flex justify-center gap-3">
                                <button 
                                    onClick={() => navigate(`/admin/tutoria/${tutoria._id}`)}
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