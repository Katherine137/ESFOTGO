import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import storeAuth from '../../context/storeAuth'
import { tutoriaService, extractTutoriaError } from '../../services/tutoriaService'
import { useHorarios } from './useHorarios'

export const useTutoriaUpdate = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [cargandoDatos, setCargandoDatos] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const { token } = storeAuth()
    const { horarios, agregarHorario, eliminarHorario, handleHorarioChange, resetHorarios, horariosValidos } = useHorarios()

    useEffect(() => {
        if (!token || !id) return
        const cargar = async () => {
            try {
                const t = await tutoriaService.getById(id, token)
                reset({
                    titulo:      t.titulo,
                    docente:     t.docente,
                    oficina:     t.oficina,
                    fecha:       t.fecha ? t.fecha.split('T')[0] : '',
                    duracion:    t.duracion,
                    cupo_maximo: t.cupo_maximo,
                    informacion: t.informacion
                })
                if (t.horarios?.length > 0) resetHorarios(t.horarios)
            } catch (error) {
                console.error('Error al cargar la tutoría:', error)
                setMessage({ type: 'error', text: 'No se pudo cargar la tutoría' })
            } finally {
                setCargandoDatos(false)
            }
        }
        cargar()
    }, [id, token, reset, resetHorarios])

    const onSubmit = async (dataForm) => {
        if (!horariosValidos()) {
            setMessage({ type: 'error', text: 'Completa todos los campos de los horarios' })
            return
        }
        setLoading(true)
        setMessage({ type: '', text: '' })
        try {
            await tutoriaService.update(id, { ...dataForm, horarios }, token)
            setMessage({ type: 'success', text: 'Tutoría actualizada exitosamente' })
            setTimeout(() => navigate('/dashboard/list/tutorias'), 1000)
        } catch (error) {
            setMessage({ type: 'error', text: extractTutoriaError(error) })
        } finally {
            setLoading(false)
        }
    }

    return {
        register, handleSubmit, errors, loading, cargandoDatos, message, setValue,
        horarios, agregarHorario, eliminarHorario, handleHorarioChange, onSubmit
    }
}