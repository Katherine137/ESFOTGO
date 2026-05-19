import { MdDeleteForever, MdInfo, MdPublishedWithChanges } from "react-icons/md"
import { useEffect, useState } from "react"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

const ListTeacher = () => {
    const [docentes, setDocentes] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = storeAuth()

    const listDocentes = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/docentes`
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            setDocentes(response.data)
        } catch (error) {
            console.error('Error al cargar docentes:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        listDocentes()
    }, [])

    if (loading) {
        return <p>Cargando...</p>
    }

    if (docentes.length === 0) {
        return (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50
            dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium">No existen registros de docentes</span>
            </div>
        )
    }

    return (
        <table className="w-full mt-5 table-auto shadow-lg bg-white">
            
            <thead className="bg-gray-800 text-slate-400">
                <tr>
                    {["N°", "Nombre", "Apellido", "Celular", "Email", "Oficina", "Horarios", "Información", "Acciones"].map((header) => (
                        <th key={header} className="p-2">{header}</th>
                    ))}
                </tr>
            </thead>
            
            <tbody>
                {
                    docentes.map((docente, index) => (
                        <tr className="hover:bg-gray-300 text-center" key={docente._id}>
                            <td>{index + 1}</td>
                            <td>{docente.nombre}</td>
                            <td>{docente.apellido}</td>
                            <td>{docente.celular}</td>
                            <td>{docente.email}</td>
                            <td>{docente.Oficina?.numero}</td>
                            <td className="text-left px-4">
                                {docente.horariosDisponibles?.length > 0 ? (
                                    docente.horariosDisponibles
                                        .filter(h => h.disponible)
                                        .map((horario, idx) => (
                                            <div key={idx} className="text-xs">
                                                {horario.dia}: {horario.horaInicio} - {horario.horaFin}
                                            </div>
                                        ))
                                ) : (
                                    <span className="text-xs text-gray-500">No disponible</span>
                                )}
                            </td>
                            <td className="text-xs px-2">{docente.informacion || 'N/A'}</td>
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

export default ListTeacher