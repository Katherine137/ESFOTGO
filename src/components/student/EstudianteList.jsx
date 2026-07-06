import { MdDeleteForever, MdUploadFile } from 'react-icons/md'
import useEstudiantes from '../../hooks/student/useEstudiantes'

const ROLES = [
    { value: 'estudiante',    label: 'Estudiante' },
    { value: 'docente',       label: 'Docente' },
    { value: 'administrador', label: 'Administrador' }
]

const HEADERS = ['N°', 'Nombre', 'Apellido', 'Celular', 'Email', 'Rol', 'Estado', 'Acciones']

const EstudianteList = () => {
    const {
        estudiantes, loading, uploading, deletingAll, actualizandoId, fileInputRef,
        handleExcelUpload, handleEliminar, handleEliminarTodo, handleToggleEstado, handleCambiarRol
    } = useEstudiantes()

    if (loading) return (
        <div className="flex items-center justify-center h-screen"><p>Cargando...</p></div>
    )

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h2 className="text-xl font-bold text-gray-700">Lista de Estudiantes</h2>

                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-2">
                    <input type="file" accept=".xlsx, .xls" ref={fileInputRef}
                        onChange={handleExcelUpload} className="hidden" />

                    <button onClick={() => fileInputRef.current.click()}
                        disabled={uploading || deletingAll}
                        className="flex items-center justify-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <MdUploadFile className="text-xl shrink-0" />
                        {uploading ? 'Procesando...' : 'Subir Excel'}
                    </button>

                    <button onClick={handleEliminarTodo}
                        disabled={uploading || deletingAll || estudiantes.length === 0}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <MdDeleteForever className="text-xl shrink-0" />
                        {deletingAll ? 'Eliminando...' : 'Eliminar Todo'}
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
                                {HEADERS.map(h => (
                                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold uppercase whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {estudiantes.map((est, index) => {
                                const activo   = est.activo ?? true
                                const rol      = (est.rol || 'estudiante').toLowerCase()
                                const guardando = actualizandoId === est._id
                                return (
                                    <tr className="hover:bg-gray-50 text-gray-700" key={est._id}>
                                        <td className="px-3 py-3 whitespace-nowrap">{index + 1}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{est.nombre}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{est.apellido}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{est.celular || 'N/A'}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">{est.email}</td>
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            <select value={rol}
                                                onChange={(e) => handleCambiarRol(est, e.target.value)}
                                                disabled={guardando || deletingAll}
                                                className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none disabled:opacity-50">
                                                {ROLES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap">
                                            <button onClick={() => handleToggleEstado(est)}
                                                disabled={guardando || deletingAll}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 ${activo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                                                {guardando ? 'Guardando...' : activo ? 'Activo' : 'Inactivo'}
                                            </button>
                                        </td>
                                        <td className="px-3 py-3">
                                            <button onClick={() => handleEliminar(est._id, est.nombre, est.apellido)}
                                                disabled={deletingAll || guardando}
                                                className="text-red-600 hover:text-red-800 text-xl disabled:opacity-50">
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

export default EstudianteList