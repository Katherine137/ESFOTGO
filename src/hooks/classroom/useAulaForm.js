import { useState } from 'react'
import { useForm } from 'react-hook-form'
import storeAuth from '../../context/storeAuth'
import { aulaService, extractAulaError } from '../../services/aulaService'

const useAulaForm = (onCreated) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const { token } = storeAuth()

    const onSubmit = async (dataForm) => {
        setLoading(true)
        setMessage({ type: '', text: '' })
        try {
            await aulaService.create(dataForm, token)
            setMessage({ type: 'success', text: 'Aula creada exitosamente' })
            reset()
            onCreated?.()
        } catch (error) {
            setMessage({ type: 'error', text: extractAulaError(error) })
        } finally {
            setLoading(false)
        }
    }

    return { register, handleSubmit: handleSubmit(onSubmit), errors, loading, message }
}

export default useAulaForm