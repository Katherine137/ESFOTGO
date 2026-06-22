import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import storeAuth from '../../context/storeAuth'

const useEventos = () => {
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const { rol } = storeAuth()

    const obtenerEventos = async () => {
        setLoading(true)
        setError(null)
        try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/eventos`)
        setEventos(Array.isArray(res.data) ? res.data : res.data.data || res.data.eventos || [])
        } catch {
        setError('La ruta /eventos no fue encontrada en el servidor.')
        } finally {
        setLoading(false)
        }
    }

    useEffect(() => {
        if (!rol) { navigate('/login'); return }
        obtenerEventos()
    }, [rol])

    return { eventos, loading, error, obtenerEventos }
}

export default useEventos