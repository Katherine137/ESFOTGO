import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import storeAuth from '../../context/storeAuth'

const HORARIO_VACIO = { dia: '', horaInicio: '', horaFin: '' }

export const useTutoriaForm = ({ onCreated } = {}) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [horarios, setHorarios] = useState([{ ...HORARIO_VACIO }])
    const { token } = storeAuth()

    const agregarHorario = () =>
        setHorarios(prev => [...prev, { ...HORARIO_VACIO }])

    const eliminarHorario = (index) =>
        setHorarios(prev => prev.filter((_, i) => i !== index))

    const handleHorarioChange = (index, campo, valor) =>
        setHorarios(prev => {
            const copia = [...prev]
            copia[index] = { ...copia[index], [campo]: valor }
            return copia
        })

    const onSubmit = async (dataForm) => {
        const horariosValidos = horarios.every(h => h.dia && h.horaInicio && h.horaFin)
        if (!horariosValidos) {
            setMessage({ type: 'error', text: 'Completa todos los campos de los horarios' })
            return
        }
        setLoading(true)
        setMessage({ type: '', text: '' })
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/tutoria`
            await axios.post(url, { ...dataForm, horarios }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            setMessage({ type: 'success', text: 'Tutoría creada exitosamente' })
            reset()
            setHorarios([{ ...HORARIO_VACIO }])
            onCreated?.()
        } catch (error) {
            const errorMsg = error.response?.data?.message
                || error.response?.data?.error
                || 'Error al conectar con el servidor'
            setMessage({ type: 'error', text: errorMsg })
        } finally {
            setLoading(false)
        }
    }

    return {
        register, handleSubmit, errors, loading, message,
        horarios, agregarHorario, eliminarHorario, handleHorarioChange, onSubmit
    }
}