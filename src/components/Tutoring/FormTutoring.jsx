import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import storeAuth from '../../context/storeAuth'

const FormTutoring = ({ onCreated }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const { token } = storeAuth()

    const [horarios, setHorarios] = useState([
        { dia: '', horaInicio: '', horaFin: '' }
    ])

    const agregarHorario = () => {
        setHorarios([...horarios, { dia: '', horaInicio: '', horaFin: '' }])
    }

    const eliminarHorario = (index) => {
        const nuevosHorarios = horarios.filter((_, i) => i !== index)
        setHorarios(nuevosHorarios)
    }

    const handleHorarioChange = (index, campo, valor) => {
        const nuevosHorarios = [...horarios]
        nuevosHorarios[index][campo] = valor
        setHorarios(nuevosHorarios)
    }

    const onSubmit = async (dataForm) => {
        const horariosValidos = horarios.every(h => h.dia && h.horaInicio && h.horaFin)
        if (!horariosValidos) {
            setMessage({ type: 'error', text: 'Completa todos los campos de los horarios' })
            return
        }

        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/tutoria`

            const dataFinal = {
                ...dataForm,
                horarios: horarios
            }

            await axios.post(url, dataFinal, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            setMessage({ type: 'success', text: 'Tutoría creada exitosamente' })
            if (onCreated) onCreated() 
            reset()
            setHorarios([{ dia: '', horaInicio: '', horaFin: '' }])

        } catch (error) {
            console.error('Error:', error)
            const errorMsg = error.response?.data?.message ||
                            error.response?.data?.error ||
                            'Error al conectar con el servidor'
            setMessage({ type: 'error', text: errorMsg })
        } finally {
            setLoading(false)
        }
    }

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
                <input
                    type="text"
                    placeholder="Título de la tutoría"
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                    {...register("titulo")}
                    disabled={loading}
                />
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Docente</label>
                <input
                    type="text"
                    placeholder="Nombre del docente"
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                    {...register("docente", { required: "El docente es obligatorio" })}
                    disabled={loading}
                />
                {errors.docente && <p className="text-red-600 text-xs mt-1">{errors.docente.message}</p>}
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Oficina</label>
                <input
                    type="text"
                    placeholder="Número de oficina"
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                    {...register("oficina", { required: "La oficina es obligatoria" })}
                    disabled={loading}
                />
                {errors.oficina && <p className="text-red-600 text-xs mt-1">{errors.oficina.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="mb-1 block text-sm font-semibold">Fecha</label>
                    <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        {...register("fecha")}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-semibold">Duración (min)</label>
                    <input
                        type="number"
                        placeholder="Ej: 60"
                        min="15"
                        className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        {...register("duracion")}
                        disabled={loading}
                    />
                </div>
            </div>

            {/* Cupo máximo */}
            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Cupo máximo</label>
                <input
                    type="number"
                    placeholder="Ej: 10"
                    min="1"
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                    {...register("cupo_maximo")}
                    disabled={loading}
                />
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Horarios</label>
                <div className="space-y-3">
                    {horarios.map((horario, index) => (
                        <div key={index} className="flex gap-2 items-center flex-wrap md:flex-nowrap">
                            <select
                                value={horario.dia}
                                onChange={(e) => handleHorarioChange(index, 'dia', e.target.value)}
                                className="rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 text-sm"
                                disabled={loading}
                            >
                                <option value="">Día</option>
                                <option value="Lunes">Lunes</option>
                                <option value="Martes">Martes</option>
                                <option value="Miércoles">Miércoles</option>
                                <option value="Jueves">Jueves</option>
                                <option value="Viernes">Viernes</option>
                            </select>

                            <input
                                type="time"
                                value={horario.horaInicio}
                                onChange={(e) => handleHorarioChange(index, 'horaInicio', e.target.value)}
                                className="rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 text-sm"
                                disabled={loading}
                            />

                            <span className="text-xs">a</span>

                            <input
                                type="time"
                                value={horario.horaFin}
                                onChange={(e) => handleHorarioChange(index, 'horaFin', e.target.value)}
                                className="rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 text-sm"
                                disabled={loading}
                            />

                            {horarios.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => eliminarHorario(index)}
                                    className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                                    disabled={loading}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={agregarHorario}
                    disabled={loading}
                    className="mt-3 text-blue-600 hover:text-blue-800 text-xs font-semibold underline"
                >
                    + Agregar otro horario
                </button>
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Información Adicional</label>
                <textarea
                    placeholder="Detalles de la tutoría..."
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                    {...register("informacion", { required: "La información es obligatoria" })}
                    disabled={loading}
                />
                {errors.informacion && <p className="text-red-600 text-xs mt-1">{errors.informacion.message}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`block w-full py-2 text-white rounded-xl transition-colors font-bold shadow-lg ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-950 hover:bg-gray-800'
                }`}
            >
                {loading ? 'Guardando...' : 'Crear Tutoría'}
            </button>
        </form>
    )
}

export default FormTutoring