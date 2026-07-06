import { useState, useEffect, useCallback } from 'react'
import storeAuth from '../../context/storeAuth'
import { rutaService } from '../../services/rutaService'

const useRutas = () => {
    const [rutas, setRutas] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = storeAuth()

    const fetchRutas = useCallback(async () => {
        setLoading(true)
        try {
            const data = await rutaService.list(token)
            setRutas(data)
        } catch (error) {
            console.error('Error al cargar rutas:', error)
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        if (token) fetchRutas()
    }, [token, fetchRutas])

    return { rutas, loading }
}

export default useRutas