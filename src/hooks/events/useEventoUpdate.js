import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import storeAuth from '../../context/storeAuth'
import { eventService, extractApiError } from '../../services/eventService'
import { useImagenBase64 } from './useImageBase64'
import { useUbicaciones } from './useUbicaciones'

const useEventoUpdate = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { token } = storeAuth()
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const { imagenPreview, imagenBase64, handleImagenChange, setImagenPreview } = useImagenBase64()
    const ubicaciones = useUbicaciones()

    useEffect(() => {
        if (!id || !token) return
        const cargar = async () => {
            try {
                const evento = await eventService.getById(id, token)
                reset({
                    nombre: evento.nombre,
                    organizador: evento.organizador,
                    ubicacion: evento.ubicacion,
                    fecha: evento.fecha ? new Date(evento.fecha).toISOString().split('T')[0] : '',
                    hora: evento.hora,
                    informacion: evento.informacion
                })
                if (evento.imagen) setImagenPreview(evento.imagen)
            } catch {
                setMessage({ type: 'error', text: 'No se pudo cargar el evento' })
            } finally {
                setLoadingData(false)
            }
        }
        cargar()
    }, [id, token, reset, setImagenPreview])

    const onSubmit = async (dataForm) => {
        setLoading(true)
        setMessage({ type: '', text: '' })
        try {
            const payload = {
                ...dataForm,
                fecha: dataForm.fecha ? new Date(dataForm.fecha).toISOString().split('T')[0] : dataForm.fecha,
                ...(imagenBase64 && { subirBase64Evento: imagenBase64 })
            }
            await eventService.update(id, payload, token)
            setMessage({ type: 'success', text: 'Evento actualizado correctamente' })
            setTimeout(() => navigate(-1), 1500)
        } catch (error) {
            setMessage({ type: 'error', text: extractApiError(error, 'Error al actualizar el evento') })
        } finally {
            setLoading(false)
        }
    }

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        loading,
        loadingData,
        message,
        imagenPreview,
        handleImagenChange,
        navigate,
        ubicaciones
    }
}

export default useEventoUpdate