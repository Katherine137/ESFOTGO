import { MdDeleteForever, MdUploadFile } from "react-icons/md"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

const Roles = [
    { value: "estudiante", label: "Estudiante" },
    { value: "docente", label: "Docente" },
    { value: "administrador", label: "Administrador" },
]

const ListTeacher = () => {
    const [docentes, setDocentes] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [deletingAll, setDeletingAll] = useState(false)
    const [actualizandoId, setActualizandoId] = useState(null)
    const fileInputRef = useRef(null)
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
            setDocentes(Array.isArray(response.data) ? response.data : response.data.data || response.data.docentes || [])
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
        formData.append("tipo", "docente")
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
            listDocentes()
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.msg || 'Error al procesar el archivo Excel')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const handleEliminarDocente = async (id, nombre, apellido) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar al docente ${nombre} ${apellido}?`)) return
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/eliminardocente/${id}`
            await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } })
            setDocentes(docentes.filter(docente => docente._id !== id))
        } catch (error) {
            console.error(error)
            alert('No se pudo eliminar al docente')
        }
    }

    const handleEliminarTodo = async () => {
        if (docentes.length === 0) return
        if (!window.confirm(`¿Estás TOTALMENTE seguro de eliminar los ${docentes.length} docentes de la base de datos?`)) return
        if (!window.confirm("¡ALERTA FINAL! Se procederá a borrar todos los registros. ¿Confirmar?")) return

        try {
            setDeletingAll(true)
            await Promise.all(
                docentes.map(docente =>
                    axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/eliminardocente/${docente._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            )
            alert("Todos los docentes han sido eliminados con éxito.")
            setDocentes([])
        } catch (error) {
            console.error(error)
            alert('Ocurrió un error al intentar eliminar algunos docentes.')
            listDocentes()
        } finally {
            setDeletingAll(false)
        }
    }

    const handleToggleEstado = async (docente) => {
        const nuevoEstado = !(docente.activo ?? true)
        if (!window.confirm(`¿Deseas ${nuevoEstado ? 'ACTIVAR' : 'INACTIVAR'} la cuenta de ${docente.nombre} ${docente.apellido}?`)) return
        try {
            setActualizandoId(docente._id)
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/actualizardocente/${docente._id}`,
                { activo: nuevoEstado },
                { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
            )
            setDocentes(prev => prev.map(d => d._id === docente._id ? { ...d, activo: nuevoEstado } : d))
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.msg || 'No se pudo actualizar el estado de la cuenta')
        } finally {
            setActualizandoId(null)
        }
    }

    const handleCambiarRol = async (docente, nuevoRol) => {
        if (nuevoRol === (docente.rol || "docente").toLowerCase()) return
        try {
            setActualizandoId(docente._id)
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/actualizardocente/${docente._id}`,
                { rol: nuevoRol },
                { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
            )
            setDocentes(prev => prev.map(d => d._id === docente._id ? { ...d, rol: nuevoRol } : d))
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.msg || 'No se pudo actualizar el rol del docente')
        } finally {
            setActualizandoId(null)
        }
    }

    useEffect(() => {
        listDocentes()
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <p>Cargando...</p>
        </div>
    )

    return (
        <div className="p-4">
            {/* ── Cabecera ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-700">Lista de Docentes</h2>

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
                        <MdUploadFile className="text-lg shrink-0" />
                        {uploading ? "Procesando..." : "Subir Excel"}
                    </button>

                    <button
                        onClick={handleEliminarTodo}
                        disabled={uploading || deletingAll || docentes.length === 0}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm shadow hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdDeleteForever className="text-lg shrink-0" />
                        {deletingAll ? "Eliminando..." : "Eliminar Todo"}
                    </button>
                </div>
            </div>

            {/* ── Sin registros ── */}
            {docentes.length === 0 ? (
                <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                    No existen registros de docentes
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg shadow-lg">
                    <table className="min-w-full bg-white table-auto text-xs">
                        <thead className="bg-gray-800 text-slate-400">
                            <tr>
                                {["N°", "Nombre", "Apellido", "Celular", "Email", "Oficina", "Horarios", "Información", "Rol", "Estado", "Acciones"].map((header) => (
                                    <th key={header} className="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap ">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {docentes.map((docente, index) => {
                                const activo = docente.activo ?? true
                                const rol = (docente.rol || "docente").toLowerCase()
                                const guardando = actualizandoId === docente._id

                                return (
                                    <tr className="hover:bg-gray-50 text-gray-700" key={docente._id}>
                                        <td className="px-3 py-3 whitespace-nowrap">{index + 1}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{docente.nombre}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{docente.apellido}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{docente.celular || 'N/A'}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{docente.email}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{docente.Oficina?.numero || 'N/A'}</td>
                                        <td className="px-3 py-3">
                                            {docente.horariosDisponibles?.filter(h => h.disponible).map((h, idx) => (
                                                <div key={idx} className="whitespace-nowrap">
                                                    {h.dia}: {h.horaInicio}–{h.horaFin}
                                                </div>
                                            )) || 'N/A'}
                                        </td>
                                        <td className="px-3 py-3 max-w-40">
                                            <p className="truncate" title={docente.informacion || 'N/A'}>
                                                {docente.informacion || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            <select
                                                value={rol}
                                                onChange={(e) => handleCambiarRol(docente, e.target.value)}
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
                                                onClick={() => handleToggleEstado(docente)}
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
                                                    onClick={() => handleEliminarDocente(docente._id, docente.nombre, docente.apellido)}
                                                    disabled={deletingAll || guardando}
                                                    className="text-red-600 hover:text-red-800 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Eliminar docente"
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

export default ListTeacher