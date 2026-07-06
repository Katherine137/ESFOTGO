import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { eventService, extractApiError } from '../../services/eventService'
import { useImagenBase64 } from './useImageBase64'
import { useUbicaciones } from './useUbicaciones'

const useEventoForm = (onEventoCreado) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const { imagenPreview, imagenBase64, handleImagenChange, resetImagen } = useImagenBase64()
    const ubicaciones = useUbicaciones()

    const onSubmit = async (dataForm) => {
        setLoading(true)
        setMessage({ type: '', text: '' })
        try {
            const payload = {
                ...dataForm,
                fecha: dataForm.fecha ? new Date(dataForm.fecha).toISOString().split('T')[0] : dataForm.fecha,
                ...(imagenBase64 && { subirBase64Evento: imagenBase64 })
            }
            await eventService.create(payload)
            setMessage({ type: 'success', text: 'Evento creado exitosamente' })
            reset()
            resetImagen()
            onEventoCreado?.()
        } catch (error) {
            setMessage({ type: 'error', text: extractApiError(error) })
        } finally {
            setLoading(false)
        }
    }

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        loading,
        message,
        imagenPreview,
        handleImagenChange,
        ubicaciones
    }
}

export default useEventoForm