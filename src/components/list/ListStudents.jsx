import { MdDeleteForever, MdUploadFile } from "react-icons/md"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

const Roles = [
    { value: "estudiante", label: "Estudiante" },
    { value: "docente", label: "Docente" },
    { value: "administrador", label: "Administrador" },
]

const ListStudent = () => {
    const [estudiantes, setEstudiantes] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [deletingAll, setDeletingAll] = useState(false)
    const [actualizandoId, setActualizandoId] = useState(null)
    const fileInputRef = useRef(null)
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
            setEstudiantes(Array.isArray(response.data) ? response.data : response.data.data || response.data.estudiantes || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleExcelUpload = async (e) => {
        const archivoSeleccionado = e.target.files?.[0]
        if (!archivoSeleccionado) return

        const formData = new FormData()
        formData.append("tipo", "estudiante") // FIX: era "docente"
        formData.append("file", archivoSeleccionado)

        try {
            setUploading(true)
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/upload`
            const response = await axios.post(url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const guardados = response.data?.guardados ?? 0
            const erroresCount = response.data?.errores?.length ?? 0
            alert(`¡Proceso terminado!\nGuardados: ${guardados}\nErrores: ${erroresCount}`)
            listEstudiantes()
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.msg || 'Error al procesar el archivo Excel')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const handleEliminarEstudiante = async (id, nombre, apellido) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar al estudiante ${nombre} ${apellido}?`)) return
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/eliminarestudiante/${id}`
            await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } })
            setEstudiantes(estudiantes.filter(est => est._id !== id))
        } catch (error) {
            console.error(error)
            alert('No se pudo eliminar al estudiante')
        }
    }

    const handleEliminarTodo = async () => {
        if (estudiantes.length === 0) return
        if (!window.confirm(`¿Estás TOTALMENTE seguro de eliminar los ${estudiantes.length} estudiantes de la base de datos?`)) return
        if (!window.confirm("¡ALERTA FINAL! Se procederá a borrar todos los registros. ¿Confirmar?")) return

        try {
            setDeletingAll(true)
            await Promise.all(
                estudiantes.map(est =>
                    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/eliminarestudiante/${est._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            )
            alert("Todos los estudiantes han sido eliminados con éxito.")
            setEstudiantes([])
        } catch (error) {
            console.error(error)
            alert('Ocurrió un error al intentar eliminar algunos estudiantes.')
            listEstudiantes()
        } finally {
            setDeletingAll(false)
        }
    }

    const handleToggleEstado = async (estudiante) => {
        const nuevoEstado = !(estudiante.activo ?? true)
        if (!window.confirm(`¿Deseas ${nuevoEstado ? 'ACTIVAR' : 'INACTIVAR'} la cuenta de ${estudiante.nombre} ${estudiante.apellido}?`)) return
        try {
            setActualizandoId(estudiante._id)
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/actualizarestudiante/${estudiante._id}`,
                { activo: nuevoEstado },
                { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
            )
            setEstudiantes(prev => prev.map(est => est._id === estudiante._id ? { ...est, activo: nuevoEstado } : est))
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.msg || 'No se pudo actualizar el estado de la cuenta')
        } finally {
            setActualizandoId(null)
        }
    }

    const handleCambiarRol = async (estudiante, nuevoRol) => {
        if (nuevoRol === (estudiante.rol || "estudiante").toLowerCase()) return
        try {
            setActualizandoId(estudiante._id)
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/actualizarestudiante/${estudiante._id}`,
                { rol: nuevoRol },
                { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
            )
            setEstudiantes(prev => prev.map(est => est._id === estudiante._id ? { ...est, rol: nuevoRol } : est))
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.msg || 'No se pudo actualizar el rol del estudiante')
        } finally {
            setActualizandoId(null)
        }
    }

    useEffect(() => {
        listEstudiantes()
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <p>Cargando...</p>
        </div>
    )

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-700">Lista de Estudiantes</h2>

                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-2">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        ref={fileInputRef}
                        onChange={handleExcelUpload}
                        className="hidden"
                    />

                    <button
                        onClick={() => fileInputRef.current.click()}
                        disabled={uploading || deletingAll}
                        className="flex items-center justify-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdUploadFile className="text-xl shrink-0" />
                        {uploading ? "Procesando..." : "Subir Excel"}
                    </button>

                    <button
                        onClick={handleEliminarTodo}
                        disabled={uploading || deletingAll || estudiantes.length === 0}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdDeleteForever className="text-xl shrink-0" />
                        {deletingAll ? "Eliminando..." : "Eliminar Todo"}
                    </button>
                </div>
            </div>

            {estudiantes.length === 0 ? (
                <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                    <span className="font-medium">No existen registros de estudiantes</span>
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-gray-800 text-slate-400">
                            <tr>
                                {["N°", "Nombre", "Apellido", "Celular", "Email", "Rol", "Estado", "Acciones"].map((header) => (
                                    <th key={header} className="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {estudiantes.map((estudiante, index) => {
                                const activo = estudiante.activo ?? true
                                const rol = (estudiante.rol || "estudiante").toLowerCase()
                                const guardando = actualizandoId === estudiante._id
                                return (
                                    <tr className="hover:bg-gray-50 text-gray-700" key={estudiante._id}>
                                        <td className="px-3 py-3 whitespace-nowrap">{index + 1}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{estudiante.nombre}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{estudiante.apellido}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{estudiante.celular || 'N/A'}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{estudiante.email}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            <select
                                                value={rol}
                                                onChange={(e) => handleCambiarRol(estudiante, e.target.value)}
                                                disabled={guardando || deletingAll}
                                                className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {Roles.map((opcion) => (
                                                    <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleEstado(estudiante)}
                                                disabled={guardando || deletingAll}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                                    activo
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                            >
                                                {guardando ? "Guardando..." : activo ? "Activo" : "Inactivo"}
                                            </button>
                                        </td>
                                        <td className="px-3 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEliminarEstudiante(estudiante._id, estudiante.nombre, estudiante.apellido)}
                                                    disabled={deletingAll || guardando}
                                                    className="text-red-600 hover:text-red-800 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Eliminar estudiante"
                                                >
                                                    <MdDeleteForever />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ListStudent