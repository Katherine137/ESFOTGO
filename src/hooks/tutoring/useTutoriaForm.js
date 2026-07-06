import { useState } from 'react'
import { useForm } from 'react-hook-form'
import storeAuth from '../../context/storeAuth'
import { tutoriaService, extractTutoriaError } from '../../services/tutoriaService'
import { useHorarios } from './useHorarios'

export const useTutoriaForm = ({ onCreated } = {}) => {
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const { token } = storeAuth()
    const { horarios, agregarHorario, eliminarHorario, handleHorarioChange, resetHorarios, horariosValidos } = useHorarios()

    const onSubmit = async (dataForm) => {
        if (!horariosValidos()) {
            setMessage({ type: 'error', text: 'Completa todos los campos de los horarios' })
            return
        }
        setLoading(true)
        setMessage({ type: '', text: '' })
        try {
            await tutoriaService.create({ ...dataForm, horarios }, token)
            setMessage({ type: 'success', text: 'Tutoría creada exitosamente' })
            reset()
            resetHorarios()
            onCreated?.()
        } catch (error) {
            setMessage({ type: 'error', text: extractTutoriaError(error) })
        } finally {
            setLoading(false)
        }
    }

    return {
        register, handleSubmit, errors, loading, message, setValue,
        horarios, agregarHorario, eliminarHorario, handleHorarioChange, onSubmit
    }
}