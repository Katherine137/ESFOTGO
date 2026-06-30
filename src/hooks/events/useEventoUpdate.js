import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import storeAuth from '../../context/storeAuth'

const useEventoUpdate = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { token } = storeAuth()
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [imagenPreview, setImagenPreview] = useState(null)
    const [imagenBase64, setImagenBase64] = useState(null)
    const headers = { Authorization: `Bearer ${token}` }
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

    useEffect(() => {
        if (!id || !token) return
        const cargar = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verevento/${id}`, { headers })
            const evento = data?.data || data
            reset({
            nombre: evento.nombre,
            organizador: evento.organizador,
            ubicacion: evento.ubicacion,
            fecha: evento.fecha ? new Date(evento.fecha).toISOString().split('T')[0] : '',
            hora: evento.hora,
            informacion: evento.informacion,
            })
            if (evento.imagen) setImagenPreview(evento.imagen)
        } catch {
            setMessage({ type: 'error', text: 'No se pudo cargar el evento' })
        } finally {
            setLoadingData(false)
        }
        }
        cargar()
    }, [id, token])

    const handleImagenChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => { setImagenPreview(reader.result); setImagenBase64(reader.result) }
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
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/actualizarevento/${id}`, payload, {
            headers: { 'Content-Type': 'application/json', ...headers }
        })
        setMessage({ type: 'success', text: 'Evento actualizado correctamente' })
        setTimeout(() => navigate(-1), 1500)
        } catch (error) {
        setMessage({
            type: 'error',
            text: error.response?.data?.message || error.response?.data?.error || 'Error al actualizar el evento'
        })
        } finally {
        setLoading(false)
        }
    }

    return { register, handleSubmit: handleSubmit(onSubmit), errors, loading, loadingData, message, imagenPreview, handleImagenChange, navigate, ubicaciones }
}

export default useEventoUpdate