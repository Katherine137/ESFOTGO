import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import storeAuth from '../../context/storeAuth'

const CardUpdate = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [cargandoDatos, setCargandoDatos] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const { token } = storeAuth()

    const [horarios, setHorarios] = useState([
        { dia: '', horaInicio: '', horaFin: '' }
    ])

    useEffect(() => {
        const obtenerTutoria = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/admin/tutorias/${id}`
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const tutoria = response.data?.data

                reset({
                    titulo: tutoria.titulo,
                    docente: tutoria.docente,
                    oficina: tutoria.oficina,
                    fecha: tutoria.fecha ? tutoria.fecha.split('T')[0] : '',
                    duracion: tutoria.duracion,
                    cupo_maximo: tutoria.cupo_maximo,
                    informacion: tutoria.informacion,
                })

                if (tutoria.horarios?.length > 0) {
                    setHorarios(tutoria.horarios)
                }
            } catch (error) {
                console.error('Error al cargar la tutoría:', error)
                setMessage({ type: 'error', text: 'No se pudo cargar la tutoría' })
            } finally {
                setCargandoDatos(false)
            }
        }

        if (token && id) obtenerTutoria()
    }, [id, token, reset])

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
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/tutoria/${id}`

            const dataFinal = {
                ...dataForm,
                horarios: horarios
            }

            await axios.put(url, dataFinal, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            setMessage({ type: 'success', text: 'Tutoría actualizada exitosamente' })
            setTimeout(() => navigate('/dashboard/list/tutorias'), 1000)

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
                        className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        {...register("fecha")}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-semibold">Duración (min)</label>
                    <input
                        type="number"
                        min="15"
                        className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 focus:ring-2 focus:ring-blue-500 outline-none"
                        {...register("duracion")}
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Cupo máximo</label>
                <input
                    type="number"
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
                <label className="mb-1 block text-sm font-semibold">Información</label>
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
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-900 hover:bg-gray-900'
                }`}
            >
                {loading ? 'Guardando...' : 'Actualizar Tutoría'}
            </button>
        </form>
    )
}

export default CardUpdate