import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import storeAuth from '../../context/storeAuth'

const HORARIO_VACIO = { dia: '', horaInicio: '', horaFin: '' }

export const useTutoriaUpdate = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [cargandoDatos, setCargandoDatos] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [horarios, setHorarios] = useState([{ ...HORARIO_VACIO }])
    const { token } = storeAuth()

    useEffect(() => {
        if (!token || !id) return
        const obtenerTutoria = async () => {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/admin/tutorias/${id}`
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const t = response.data?.data
                reset({
                    titulo:       t.titulo,
                    docente:      t.docente,
                    oficina:      t.oficina,
                    fecha:        t.fecha ? t.fecha.split('T')[0] : '',
                    duracion:     t.duracion,
                    cupo_maximo:  t.cupo_maximo,
                    informacion:  t.informacion,
                })
                if (t.horarios?.length > 0) setHorarios(t.horarios)
            } catch (error) {
                console.error('Error al cargar la tutoría:', error)
                setMessage({ type: 'error', text: 'No se pudo cargar la tutoría' })
            } finally {
                setCargandoDatos(false)
            }
        }
        obtenerTutoria()
    }, [id, token, reset])

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
            const url = `${import.meta.env.VITE_BACKEND_URL}/admin/tutoria/${id}`
            await axios.put(url, { ...dataForm, horarios }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            setMessage({ type: 'success', text: 'Tutoría actualizada exitosamente' })
            setTimeout(() => navigate('/dashboard/list/tutorias'), 1000)
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
        register, handleSubmit, errors, loading, cargandoDatos, message, setValue,
        horarios, agregarHorario, eliminarHorario, handleHorarioChange, onSubmit
    }
}