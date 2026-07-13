import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { authService } from '../../services/authService'

const useForgot = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (dataForm) => {
        console.log('=== FORM DATA ===')
        console.log('dataForm completo:', dataForm)
        console.log('email extraído:', dataForm.email)
        
        setLoading(true)
        try {
            const response = await authService.recuperarPassword(dataForm.email)
            console.log('Respuesta exitosa:', response)
            toast.success(response?.msg || 'Correo enviado, revisa tu bandeja de entrada')
            reset()
        } catch (error) {
            console.error('=== ERROR COMPLETO ===')
            console.error('Status:', error.response?.status)
            console.error('Data:', error.response?.data)
            console.error('URL intentada:', error.config?.url)
            console.error('Body enviado:', error.config?.data)
            console.error('Message:', error.message)
            
            toast.error(
                error.response?.data?.msg ||
                error.response?.data?.error ||
                `Error ${error.response?.status || ''}: No se pudo enviar el correo`
            )
        } finally {
            setLoading(false)
        }
    }

    return { register, handleSubmit: handleSubmit(onSubmit), errors, loading }
}

export default useForgot
