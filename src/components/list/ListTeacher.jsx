import { MdDeleteForever, MdInfo, MdPublishedWithChanges, MdUploadFile } from "react-icons/md"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import storeAuth from "../../context/storeAuth";

const ListTeacher = () => {
    const [docentes, setDocentes] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [deletingAll, setDeletingAll] = useState(false) 
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
            setDocentes(response.data)
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
            const url = `${import.meta.env.VITE_BACKEND_URL}/eliminardocente/${id}` 
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
                const url = `${import.meta.env.VITE_BACKEND_URL}/eliminardocente/${docente._id}`
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

    const handleActualizarDocente = (id) => {
        console.log(id)
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
                        disabled={uploading || deletingAll ? true : false}
                        className={`flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-green-800 transition-colors ${(uploading || deletingAll) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <MdUploadFile className="text-xl" />
                        {uploading ? "Procesando..." : "Subir Excel"}
                    </button>

                    <button
                        onClick={handleEliminarTodo}
                        disabled={uploading || deletingAll || docentes.length === 0 ? true : false}
                        className={`flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-red-700 transition-colors ${(uploading || deletingAll || docentes.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <MdDeleteForever className="text-xl" />
                        {deletingAll ? "Eliminando todo..." : "Eliminar Todo"}
                    </button>
                </div>
            </div>

            {docentes.length === 0 ? (
                <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <span className="font-medium">No existen registros de docentes</span>
                </div>
            ) : (
                <table className="w-full mt-5 table-auto shadow-lg bg-white">
                    <thead className="bg-gray-800 text-slate-400">
                        <tr>
                            {["N°", "Nombre", "Apellido", "Celular", "Email", "Oficina", "Horarios", "Información", "Acciones"].map((header) => (
                                <th key={header} className="p-2">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {docentes.map((docente, index) => (
                            <tr className="hover:bg-gray-300 text-center border-b border-gray-200 text-sm" key={docente._id}>
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{docente.nombre}</td>
                                <td className="p-2">{docente.apellido}</td>
                                <td className="p-2">{docente.celular || 'N/A'}</td>
                                <td className="p-2">{docente.email}</td>
                                <td className="p-2">{docente.Oficina?.numero || 'N/A'}</td>
                                <td className="p-2 text-left px-4">
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
                                <td className="text-xs p-2">{docente.informacion || 'N/A'}</td>
                                <td className="p-2 flex justify-center gap-3">
                                    <button 
                                        onClick={() => handleEliminarDocente(docente._id, docente.nombre, docente.apellido)}
                                        className="text-red-600 hover:text-red-800 text-2xl"
                                        disabled={deletingAll ? true : false}
                                    >
                                        <MdDeleteForever />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default ListTeacher