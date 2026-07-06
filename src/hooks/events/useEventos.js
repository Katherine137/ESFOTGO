import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import storeAuth from '../../context/storeAuth'
import { eventService } from '../../services/eventService'

const useEvents = ({ mode = 'public' } = {}) => {
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { token, rol } = storeAuth()
    const navigate = useNavigate()

    const fetchEventos = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = mode === 'private'
                ? await eventService.listPrivate(token)
                : await eventService.listPublic()
            setEventos(data)
        } catch {
            setError('La ruta /eventos no fue encontrada en el servidor.')
        } finally {
            setLoading(false)
        }
    }, [mode, token])

    const handleEliminar = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este evento?')) return
        try {
            await eventService.remove(id, token)
            setEventos(prev => prev.filter(e => e._id !== id))
        } catch (err) {
            console.error('Error al eliminar:', err)
        }
    }

    const handleEditar = (id) => navigate(`/dashboard/actualizarevento/${id}`)

    useEffect(() => {
        if (mode === 'private' && !rol) {
            navigate('/login')
            return
        }
        fetchEventos()
    }, [mode, rol, fetchEventos, navigate])

    return { eventos, loading, error, fetchEventos, handleEliminar, handleEditar }
}

export default useEvents