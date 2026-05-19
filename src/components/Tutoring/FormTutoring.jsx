import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const FormTutoring = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    
    // Estado para los horarios dinámicos
    const [horarios, setHorarios] = useState([
        { dia: '', horaInicio: '', horaFin: '' }
    ])

    // --- Lógica de Horarios ---
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

    // --- Lógica de Envío al Backend ---
    const registerEventForm = async (dataForm) => {
        setLoading(true)
        setMessage({ type: '', text: '' })
        
        try {
            const baseURL = import.meta.env.VITE_BACKEND_URL || 'https://esfotgo-backend77.onrender.com'
            // Ajusta esta ruta si en tu backend es diferente para tutorías
            const url = `${baseURL}/admin/tutoria` 
            
            const token = localStorage.getItem('token')
            
            if (!token) {
                setMessage({ type: 'error', text: 'No estás autenticado.' })
                setLoading(false)
                return
            }

            // Unimos los campos del form con el array de horarios
            const dataFinal = {
                ...dataForm,
                horarios: horarios
            }

            const response = await axios.post(url, dataFinal, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            
            setMessage({ type: 'success', text: 'Tutoría creada exitosamente' })
            reset()
            setHorarios([{ dia: '', horaInicio: '', horaFin: '' }]) // Limpiar horarios
            
        } catch (error) {
            console.error('❌ Error:', error)
            const errorMsg = error.response?.data?.message || 'Error al conectar con el servidor'
            setMessage({ type: 'error', text: errorMsg })
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = (data) => {
        registerEventForm(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-blue-900 font-bold mb-4 text-xl">Crear Tutoría</h2>
            
            {/* Mensajes de Feedback */}
            {message.text && (
                <div className={`p-3 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="mb-3">
                <label htmlFor="docente" className="mb-1 block text-sm font-semibold">Docente</label>
                <input 
                    type="text" 
                    id="docente"
                    placeholder="Nombre del docente" 
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register("docente", { required: "El docente es obligatorio" })}
                />
                {errors.docente && <p className="text-red-800 text-xs mt-1">{errors.docente.message}</p>}
            </div>

            <div className="mb-3">
                <label htmlFor="oficina" className="mb-1 block text-sm font-semibold">Oficina</label>
                <input 
                    type="text" 
                    id="oficina"
                    placeholder="Número de oficina" 
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register("oficina", { required: "La oficina es obligatoria" })}
                />
                {errors.oficina && <p className="text-red-800 text-xs mt-1">{errors.oficina.message}</p>}
            </div>

            {/* Sección Dinámica de Horarios */}
            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Horarios</label>
                <div className="space-y-3">
                    {horarios.map((horario, index) => (
                        <div key={index} className="flex gap-2 items-center flex-wrap md:flex-nowrap">
                            <select 
                                value={horario.dia}
                                onChange={(e) => handleHorarioChange(index, 'dia', e.target.value)}
                                className="rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 text-sm"
                                required
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
                                required
                            />

                            <span className="text-xs">a</span>

                            <input 
                                type="time" 
                                value={horario.horaFin}
                                onChange={(e) => handleHorarioChange(index, 'horaFin', e.target.value)}
                                className="rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 text-sm"
                                required
                            />

                            {horarios.length > 1 && (
                                <button 
                                    type="button"
                                    onClick={() => eliminarHorario(index)}
                                    className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
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
                    className="mt-3 text-blue-600 hover:text-blue-800 text-xs font-semibold underline"
                >
                    + Agregar otro horario
                </button>
            </div>
            
            <div className="mb-3">
                <label htmlFor="informacion" className="mb-1 block text-sm font-semibold">Información Adicional</label>
                <textarea 
                    id="informacion"
                    placeholder="Detalles de la tutoría..." 
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 h-24"
                    {...register("informacion", { required: "La información es obligatoria" })}
                />
                {errors.informacion && <p className="text-red-800 text-xs mt-1">{errors.informacion.message}</p>}
            </div>
            
            <button 
                type="submit"
                disabled={loading}
                className={`block w-full py-2 text-white rounded-xl transition-colors font-bold shadow-lg ${loading ? 'bg-gray-400' : 'bg-red-900 hover:bg-gray-900'}`}
            >
                {loading ? 'Guardando...' : 'Crear Tutoría'}
            </button>
        </form>
    )
}

export default FormTutoring
