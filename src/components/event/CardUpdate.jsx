import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import storeAuth from '../../context/storeAuth'

const CardUpdate = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { token } = storeAuth()
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [imagenPreview, setImagenPreview] = useState(null)
    const [imagenBase64, setImagenBase64] = useState(null)

    useEffect(() => {
        const cargarEvento = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/verevento/${id}`
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const evento = response.data?.data || response.data
                const fechaFormateada = evento.fecha
                    ? new Date(evento.fecha).toISOString().split('T')[0]
                    : ''
                reset({
                    nombre: evento.nombre,
                    organizador: evento.organizador,
                    ubicacion: evento.ubicacion,
                    fecha: fechaFormateada,
                    hora: evento.hora,
                    informacion: evento.informacion,
                })
                if (evento.imagen) setImagenPreview(evento.imagen)
            } catch (error) {
                console.error('Error al cargar evento:', error)
                setMessage({ type: 'error', text: 'No se pudo cargar el evento' })
            } finally {
                setLoadingData(false)
            }
        }
        if (id && token) cargarEvento()
    }, [id, token])

    const handleImagenChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagenPreview(reader.result)
            setImagenBase64(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const onSubmit = async (dataForm) => {
        setLoading(true)
        setMessage({ type: '', text: '' })
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/actualizarevento/${id}`
            const payload = {
                ...dataForm,
                fecha: dataForm.fecha ? new Date(dataForm.fecha).toISOString().split('T')[0] : dataForm.fecha
            }
            if (imagenBase64) payload.subirBase64Evento = imagenBase64

            await axios.put(url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            setMessage({ type: 'success', text: 'Evento actualizado correctamente' })
            setTimeout(() => navigate(-1), 1500)
        } catch (error) {
            const errorMsg = error.response?.data?.message ||
                            error.response?.data?.error ||
                            'Error al actualizar el evento'
            setMessage({ type: 'error', text: errorMsg })
        } finally {
            setLoading(false)
        }
    }

    if (loadingData) return (
        <div className="text-center py-8">
            <p className="text-gray-600">Cargando evento...</p>
        </div>
    )

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-900 max-w-xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-blue-950 mb-4 text-center">Actualizar Evento</h2>

            {message.text && (
                <div className={`mb-4 p-3 rounded border ${
                    message.type === 'success'
                    ? 'bg-green-100 text-green-700 border-green-400'
                    : 'bg-red-100 text-red-700 border-red-400'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Imagen del Evento</label>
                    <div className="flex flex-col items-center gap-3">
                        {imagenPreview ? (
                            <img src={imagenPreview} alt="preview" className="w-32 h-32 object-cover rounded-full border-2 border-blue-300" />
                        ) : (
                            <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                                Sin imagen
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImagenChange}
                            disabled={loading}
                            className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                    <input
                        type="text"
                        placeholder="Nombre del evento"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("nombre", {
                            required: "El nombre es obligatorio",
                            minLength: { value: 3, message: "Mínimo 3 caracteres" },
                            maxLength: { value: 150, message: "Máximo 150 caracteres" }
                        })}
                        disabled={loading}
                    />
                    {errors.nombre && <span className="text-red-600 text-xs">{errors.nombre.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Organizador</label>
                    <input
                        type="text"
                        placeholder="Organizador del evento"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("organizador", {
                            required: "El organizador es obligatorio",
                            minLength: { value: 3, message: "Mínimo 3 caracteres" }
                        })}
                        disabled={loading}
                    />
                    {errors.organizador && <span className="text-red-600 text-xs">{errors.organizador.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("fecha", { required: "La fecha es obligatoria" })}
                            disabled={loading}
                        />
                        {errors.fecha && <span className="text-red-600 text-xs">{errors.fecha.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Hora</label>
                        <input
                            type="time"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("hora", { required: "La hora es obligatoria" })}
                            disabled={loading}
                        />
                        {errors.hora && <span className="text-red-600 text-xs">{errors.hora.message}</span>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación</label>
                    <input
                        type="text"
                        placeholder="Ubicación del evento"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("ubicacion", {
                            required: "La ubicación es obligatoria",
                            minLength: { value: 3, message: "Mínimo 3 caracteres" },
                            maxLength: { value: 200, message: "Máximo 200 caracteres" }
                        })}
                        disabled={loading}
                    />
                    {errors.ubicacion && <span className="text-red-600 text-xs">{errors.ubicacion.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Información</label>
                    <textarea
                        placeholder="Detalles del evento..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("informacion", {
                            required: "La información es obligatoria",
                            minLength: { value: 10, message: "Mínimo 10 caracteres" },
                            maxLength: { value: 2000, message: "Máximo 2000 caracteres" }
                        })}
                        disabled={loading}
                    />
                    {errors.informacion && <span className="text-red-600 text-xs">{errors.informacion.message}</span>}
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full py-2 px-4 rounded-md text-gray-700 font-bold border border-gray-300 hover:bg-gray-100 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-md text-white font-bold transition-all shadow-md ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-950 hover:bg-gray-800'
                        }`}
                    >
                        {loading ? 'Actualizando...' : 'Actualizar Evento'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CardUpdate