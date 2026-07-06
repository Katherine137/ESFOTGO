import { useState, useEffect, useCallback } from 'react'
import storeAuth from '../../context/storeAuth'
import { tutoriaService } from '../../services/tutoriaService'

export const useTutorias = () => {
    const [tutorias, setTutorias] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = storeAuth()

    const fetchTutorias = useCallback(async () => {
        setLoading(true)
        try {
            const data = await tutoriaService.listAll(token)
            setTutorias(data)
        } catch (error) {
            console.error('Error al cargar tutorias:', error)
        } finally {
            setLoading(false)
        }
    }, [token])

    const handleEliminar = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar esta tutoría?')) return
        try {
            await tutoriaService.remove(id, token)
            setTutorias(prev => prev.filter(t => t._id !== id))
        } catch (error) {
            console.error('Error al eliminar:', error)
        }
    }

    useEffect(() => {
        if (token) fetchTutorias()
    }, [token, fetchTutorias])

    return { tutorias, loading, handleEliminar, fetchTutorias }
}