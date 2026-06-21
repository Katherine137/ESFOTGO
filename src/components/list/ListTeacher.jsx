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
            setDocentes(Array.isArray(response.data) ? response.data : response.data.data || response.data.docentes || []);
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleExcelUpload = async (e) => {
        const archivoSeleccionado = e.target.files?.[0];
        if (!archivoSeleccionado) return;

        const formData = new FormData();

        formData.append("tipo", "docente");
        formData.append("file", archivoSeleccionado);

        try {
            setUploading(true);
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/upload`;

            const response = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const guardados = response.data?.guardados ?? 0;
            const erroresCount = response.data?.errores?.length ?? 0;

            alert(`¡Proceso terminado!\nGuardados: ${guardados}\nErrores: ${erroresCount}`);
            listDocentes();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.msg || 'Error al procesar el archivo Excel');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    const handleEliminarDocente = async (id, nombre, apellido) => {
        const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar al docente ${nombre} ${apellido}?`)
        if (!confirmar) return

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

        const primerAviso = window.confirm(`¿Estás TOTALMENTE seguro de eliminar los ${docentes.length} docentes de la base de datos?`)
        if (!primerAviso) return

        const segundoAviso = window.confirm("¡ALERTA FINAL! Se procederá a borrar todos los registros uno por uno. ¿Confirmar?")
        if (!segundoAviso) return

        try {
            setDeletingAll(true)

            const promesasEliminacion = docentes.map(docente => {
                const url = `${import.meta.env.VITE_BACKEND_URL}/admin/eliminardocente/${docente._id}`
                return axios.delete(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            })

            await Promise.all(promesasEliminacion)

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
        const estadoActual = docente.activo ?? true
        const nuevoEstado = !estadoActual
        const confirmar = window.confirm(
            `¿Deseas ${nuevoEstado ? 'ACTIVAR' : 'INACTIVAR'} la cuenta de ${docente.nombre} ${docente.apellido}?`
        )
        if (!confirmar) return
        try {
            setActualizandoId(docente._id)
            const url = `${import.meta.env.VITE_BACKEND_URL}/actualizardocente/${docente._id}`
            await axios.put(
                url,
                { activo: nuevoEstado },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }
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
        const rolActual = (docente.rol || "docente").toLowerCase()
        if (nuevoRol === rolActual) return
        try {
            setActualizandoId(docente._id)
            const url = `${import.meta.env.VITE_BACKEND_URL}/actualizardocente/${docente._id}`
            await axios.put(
                url,
                { rol: nuevoRol },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }
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

    if (loading) {
        return <p className="text-center mt-10 font-medium">Cargando...</p>
    }

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-700">Lista de Docentes</h2>

                <div className="flex items-center gap-3">
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
                        className={`flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-green-800 transition-colors ${(uploading || deletingAll) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <MdUploadFile className="text-lg" />
                        {uploading ? "Procesando..." : "Subir Excel"}
                    </button>

                    <button
                        onClick={handleEliminarTodo}
                        disabled={uploading || deletingAll || docentes.length === 0}
                        className={`flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm shadow hover:bg-red-700 transition-colors ${(uploading || deletingAll || docentes.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <MdDeleteForever className="text-lg" />
                        {deletingAll ? "Eliminando todo..." : "Eliminar Todo"}
                    </button>
                </div>
            </div>

            {docentes.length === 0 ? (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                    No existen registros de docentes
                </div>
            ) : (
                <div className="overflow-x-auto shadow-lg bg-white rounded-lg">
                    <table className="w-full min-w-[900px] table-auto">
                        <thead className="bg-gray-800 text-slate-400">
                            <tr>
                                {["N°", "Nombre", "Apellido", "Celular", "Email", "Oficina", "Horarios", "Información", "Rol", "Estado", "Acciones"].map((header) => (
                                    <th key={header} className="p-3 text-xs uppercase">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {docentes.map((docente, index) => {
                                const activo = docente.activo ?? true
                                const rol = (docente.rol || "docente").toLowerCase()
                                const guardando = actualizandoId === docente._id
                                return (
                                    <tr className="hover:bg-gray-50 text-center text-xs" key={docente._id}>
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3">{docente.nombre}</td>
                                        <td className="p-3">{docente.apellido}</td>
                                        <td className="p-3">{docente.celular || 'N/A'}</td>
                                        <td className="p-3">{docente.email}</td>
                                        <td className="p-3">{docente.Oficina?.numero || 'N/A'}</td>
                                        <td className="p-3 text-left">
                                            {docente.horariosDisponibles?.filter(h => h.disponible).map((h, idx) => (
                                                <div key={idx} className="whitespace-nowrap">
                                                    {h.dia}: {h.horaInicio}-{h.horaFin}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="p-3 max-w-[150px] truncate">{docente.informacion || 'N/A'}</td>
                                        <td className="p-3">
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
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleToggleEstado(docente)}
                                                disabled={guardando || deletingAll}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${activo
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                            >
                                                {guardando ? "Guardando..." : activo ? "Activo" : "Inactivo"}
                                            </button>
                                        </td>
                                        <td className="p-3 flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEliminarDocente(docente._id, docente.nombre, docente.apellido)}
                                                className="text-red-600 hover:text-red-800 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={deletingAll || guardando}
                                            >
                                                <MdDeleteForever />
                                            </button>
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