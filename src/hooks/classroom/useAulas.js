import { useState, useEffect, useCallback } from 'react'
import storeAuth from '../../context/storeAuth'
import { aulaService } from '../../services/aulaService'

const useAulas = () => {
    const [aulas, setAulas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { token } = storeAuth()

    const fetchAulas = useCallback(async () => {
        if (!token) return
        setLoading(true)
        setError(null)
        try {
            const data = await aulaService.list(token)
            setAulas(data)
        } catch (err) {
            console.error('Error al cargar aulas:', err)
            setError(err.response?.data?.msg || 'No se pudieron cargar las aulas')
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        fetchAulas()
    }, [fetchAulas])

    return { aulas, loading, error, fetchAulas }
}

export default useAulas