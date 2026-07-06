import { useState, useEffect } from 'react'
import { eventService } from '../../services/eventService'
import storeAuth from '../../context/storeAuth'

export const useUbicaciones = () => {
    const [ubicaciones, setUbicaciones] = useState([])
    const { token } = storeAuth()

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await eventService.listUbicaciones(token)
                setUbicaciones(data)
            } catch (error) {
                console.error('Error al cargar ubicaciones:', error)
            }
        }
        cargar()
    }, [token])

    return ubicaciones
}