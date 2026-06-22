import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import storeAuth from '../../context/storeAuth'

const useListEvents = () => {
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = storeAuth()
    const navigate = useNavigate()
    const headers = { Authorization: `Bearer ${token}` }

    const listEventos = async () => {
        try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/eventos`, {
            headers: { 'Content-Type': 'application/json', ...headers }
        })
        const result = data?.data || data
        setEventos(Array.isArray(result) ? result : [])
        } catch (error) {
        console.error('Error al cargar eventos:', error)
        } finally {
        setLoading(false)
        }
    }

    const handleEliminar = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este evento?')) return
        try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/eliminarevento/${id}`, { headers })
        setEventos(prev => prev.filter(e => e._id !== id))
        } catch (error) {
        console.error('Error al eliminar:', error)
        }
    }

    const handleEditar = (id) => navigate(`/dashboard/actualizarevento/${id}`)

    useEffect(() => { listEventos() }, [])

    return { eventos, loading, handleEliminar, handleEditar }
}

export default useListEvents