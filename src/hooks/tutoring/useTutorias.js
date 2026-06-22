import { useState, useEffect } from 'react'
import axios from 'axios'
import storeAuth from '../../context/storeAuth'

export const useTutorias = () => {
    const [tutorias, setTutorias] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = storeAuth()

    const fetchTutorias = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/tutorias`
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTutorias(response.data?.data || [])
        } catch (error) {
            console.error('Error al cargar tutorias:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleEliminar = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este evento?')) return
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/tutoria/${id}`
            await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTutorias(prev => prev.filter(e => e._id !== id))
        } catch (error) {
            console.error('Error al eliminar:', error)
        }
    }

    useEffect(() => {
        if (token) fetchTutorias()
    }, [token])

    return { tutorias, loading, handleEliminar, fetchTutorias }
}