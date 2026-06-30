import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

const useEventoForm = (onEventoCreado) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [imagenPreview, setImagenPreview] = useState(null)
    const [imagenBase64, setImagenBase64] = useState(null)
    const [ubicaciones, setUbicaciones] = useState([])

    useEffect(() => {
        const cargarUbicaciones = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/mapa/ubicaciones`)
                setUbicaciones(data?.data || [])
            } catch (error) {
                console.error('Error al cargar ubicaciones:', error)
            }
        }
        cargarUbicaciones()
    }, [])

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
        const payload = {
            ...dataForm,
            fecha: dataForm.fecha ? new Date(dataForm.fecha).toISOString().split('T')[0] : dataForm.fecha,
            ...(imagenBase64 && { subirBase64Evento: imagenBase64 })
        }
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/evento`, payload, {
            headers: { 'Content-Type': 'application/json' }
        })
        setMessage({ type: 'success', text: 'Evento creado exitosamente' })
        reset()
        setImagenPreview(null)
        setImagenBase64(null)
        onEventoCreado?.()
        } catch (error) {
        setMessage({
            type: 'error',
            text: error.response?.data?.message || error.response?.data?.error || 'Error al conectar con el servidor'
        })
        } finally {
        setLoading(false)
        }
    }

    return { register, handleSubmit: handleSubmit(onSubmit), errors, loading, message, imagenPreview, handleImagenChange, ubicaciones }
}

export default useEventoForm