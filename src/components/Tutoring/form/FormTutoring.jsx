import { useEffect, useState } from 'react'
import { Horario } from './Horario'
import { useTutoriaForm } from '../../../hooks/tutoring/useTutoriaForm'
import storeProfile from '../../../context/storeProfile'
import axios from 'axios'
import storeAuth from '../../../context/storeAuth'

const FormTutoring = ({ onCreated }) => {
    const { user } = storeProfile()
    const { token } = storeAuth()
    const [ubicaciones, setUbicaciones] = useState([])
    const {
        register, handleSubmit, errors, loading, message, setValue,
        horarios, agregarHorario, eliminarHorario, handleHorarioChange, onSubmit
    } = useTutoriaForm({ onCreated })

    useEffect(() => {
        if (user) {
            setValue("docente", user._id)
        }
    }, [user, setValue])

    useEffect(() => {
        const cargarUbicaciones = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/mapa/ubicaciones`
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setUbicaciones(response.data?.data || [])
            } catch (error) {
                console.error('Error al cargar ubicaciones:', error)
            }
        }
        cargarUbicaciones()
    }, [token])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-900">
            <h2 className="text-blue-900 font-bold mb-4 text-xl text-center">Crear Tutoría</h2>

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
                    value={`${user?.nombre || ""} ${user?.apellido || ""}`.trim()}
                    readOnly
                    className="block w-full rounded-md border border-blue-500 bg-gray-100 py-1 px-1.5 text-neutral-950"
                />
                <input
                    type="hidden"
                    {...register("docente")}
                    value={user?._id || ""}
                />
                {errors.docente && (
                    <p className="text-red-600 text-xs mt-1">{errors.docente.message}</p>
                )}
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
                    <input type="date" min={new Date().toISOString().split('T')[0]}
                        className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        {...register('fecha')} disabled={loading} />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-semibold">Duración (min)</label>
                    <input type="number" placeholder="Ej: 60" min="15"
                        className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        {...register('duracion')} disabled={loading} />
                </div>
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Cupo máximo</label>
                <input type="number" placeholder="Ej: 10" min="1"
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                    {...register('cupo_maximo')} disabled={loading} />
            </div>

            <Horario
                horarios={horarios}
                onChange={handleHorarioChange}
                onAgregar={agregarHorario}
                onEliminar={eliminarHorario}
                disabled={loading}
            />

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Información Adicional</label>
                <textarea placeholder="Detalles de la tutoría..."
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                    {...register('informacion', { required: 'La información es obligatoria' })} disabled={loading} />
                {errors.informacion && <p className="text-red-600 text-xs mt-1">{errors.informacion.message}</p>}
            </div>

            <button type="submit" disabled={loading}
                className={`block w-full py-2 text-white rounded-xl transition-colors font-bold shadow-lg ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-950 hover:bg-gray-800'
                }`}>
                {loading ? 'Guardando...' : 'Crear Tutoría'}
            </button>
        </form>
    )
}

export default FormTutoring