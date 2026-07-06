import { useEffect } from 'react'
import { useTutoriaUpdate } from '../../hooks/tutoring/useTutoriaUpdate'
import { useUbicaciones } from '../../hooks/events/useUbicaciones'
import TutoriaHorario from './TutoriaHorario'
import storeProfile from '../../context/storeProfile'

const TutoriaCardUpdate = () => {
    const { user } = storeProfile()
    const ubicaciones = useUbicaciones()
    const {
        register, handleSubmit, errors, loading, cargandoDatos, message, setValue,
        horarios, agregarHorario, eliminarHorario, handleHorarioChange, onSubmit
    } = useTutoriaUpdate()

    useEffect(() => {
        if (user) setValue('docente', user._id)
    }, [user, setValue])

    if (cargandoDatos) return <p>Cargando tutoría...</p>

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-900">
            <h2 className="text-blue-900 font-bold mb-4 text-xl text-center">Actualizar Tutoría</h2>

            {message.text && (
                <div className={`p-3 mb-4 rounded border ${
                    message.type === 'error'
                        ? 'bg-red-100 text-red-700 border-red-400'
                        : 'bg-green-100 text-green-700 border-green-400'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Título</label>
                <input type="text" placeholder="Título de la tutoría"
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                    {...register('titulo')} disabled={loading} />
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Docente</label>
                <input
                    type="text"
                    value={`${user?.nombre || ''} ${user?.apellido || ''}`.trim()}
                    readOnly
                    className="block w-full rounded-md border border-blue-500 bg-gray-100 py-1 px-1.5 text-neutral-950"
                />
                <input type="hidden" {...register('docente')} value={user?._id || ''} />
                {errors.docente && <p className="text-red-600 text-xs mt-1">{errors.docente.message}</p>}
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Oficina</label>
                <select
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                    {...register('oficina', { required: 'La oficina es obligatoria' })}
                    disabled={loading}
                >
                    <option value="">Selecciona una ubicación</option>
                    {ubicaciones.map((ubic) => (
                        <option key={ubic._id} value={ubic.nombre}>
                            {ubic.nombre} {ubic.categoria ? `(${ubic.categoria})` : ''}
                        </option>
                    ))}
                </select>
                {errors.oficina && <p className="text-red-600 text-xs mt-1">{errors.oficina.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="mb-1 block text-sm font-semibold">Fecha</label>
                    <input type="date"
                        className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        {...register('fecha')} disabled={loading} />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-semibold">Duración (min)</label>
                    <input type="number" min="15"
                        className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        {...register('duracion')} disabled={loading} />
                </div>
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Cupo máximo</label>
                <input type="number" min="1"
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                    {...register('cupo_maximo')} disabled={loading} />
            </div>

            <TutoriaHorario
                horarios={horarios}
                onChange={handleHorarioChange}
                onAgregar={agregarHorario}
                onEliminar={eliminarHorario}
                disabled={loading}
            />

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Información</label>
                <textarea placeholder="Detalles de la tutoría..."
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                    {...register('informacion', { required: 'La información es obligatoria' })} disabled={loading} />
                {errors.informacion && <p className="text-red-600 text-xs mt-1">{errors.informacion.message}</p>}
            </div>

            <button type="submit" disabled={loading}
                className={`block w-full py-2 text-white rounded-xl transition-colors font-bold shadow-lg ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-900 hover:bg-gray-900'
                }`}>
                {loading ? 'Guardando...' : 'Actualizar Tutoría'}
            </button>
        </form>
    )
}

export default TutoriaCardUpdate