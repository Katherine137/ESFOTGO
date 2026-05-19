import { MdDeleteForever, MdInfo, MdPublishedWithChanges } from "react-icons/md"
import { useEffect, useState } from "react"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

const ListStudent = () => {
    const [estudiantes, setEstudiantes] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = storeAuth()

    const listEstudiantes = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/estudiantes`
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            setEstudiantes(response.data)
        } catch (error) {
            console.error('Error al cargar estudiantes:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        listEstudiantes()
    }, [])

    if (loading) {
        return <p>Cargando...</p>
    }

    if (estudiantes.length === 0) {
        return (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50
            dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium">No existen registros de estudiantes</span>
            </div>
        )
    }

    return (
        <table className="w-full mt-5 table-auto shadow-lg bg-white">
            
            <thead className="bg-gray-800 text-slate-400">
                <tr>
                    {["N°", "Nombre", "Apellido", "Celular", "Email", "Acciones"].map((header) => (
                        <th key={header} className="p-2">{header}</th>
                    ))}
                </tr>
            </thead>
            
            <tbody>
                {
                    estudiantes.map((estudiante, index) => (
                        <tr className="hover:bg-gray-300 text-center" key={estudiante._id}>
                            <td>{index + 1}</td>
                            <td>{estudiante.nombre}</td>
                            <td>{estudiante.apellido}</td>
                            <td>{estudiante.celular}</td>
                            <td>{estudiante.email}</td>
                            <td className='py-2 text-center'>
                                <MdPublishedWithChanges
                                    title="Actualizar"
                                    className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2
                                    hover:text-blue-600"
                                />
                                <MdInfo
                                    title="Más información"
                                    className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2
                                    hover:text-green-600"
                                />
                                <MdDeleteForever
                                    title="Eliminar"
                                    className="h-7 w-7 text-red-900 cursor-pointer inline-block
                                    hover:text-red-600"
                                />
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default ListStudent