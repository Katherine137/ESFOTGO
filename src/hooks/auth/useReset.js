import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { authService } from '../../services/authService'

const useReset = () => {
    const navigate = useNavigate()
    const { token } = useParams()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [tokenValido, setTokenValido] = useState(false)

    useEffect(() => {
        const verificar = async () => {
            try {
                await authService.verificarToken(token)
                setTokenValido(true)
            } catch (error) {
                console.error('Token inválido:', error.response?.data || error.message)
                toast.error('El enlace de recuperación es inválido o expiró')
            }
        }
        if (token) verificar()
    }, [token])

    const onSubmit = async (dataForm) => {
        if (dataForm.password !== dataForm.confirmpassword) {
            toast.error('Las contraseñas no coinciden')
            return
        }
        try {
            await authService.nuevoPassword(token, dataForm)
            toast.success('Contraseña actualizada correctamente')
            setTimeout(() => navigate('/Login'), 2000)
        } catch (error) {
            console.error('Error al cambiar contraseña:', error.response?.data || error.message)
            toast.error(
                error.response?.data?.msg ||
                error.response?.data?.error ||
                'No se pudo cambiar la contraseña'
            )
        }
    }

    return { register, handleSubmit: handleSubmit(onSubmit), errors, tokenValido }
}

export default useReset