import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { authService } from '../../services/authService'

const useRegister = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm()

    const rolValue   = watch('rol')
    const emailValue = watch('email')

    useEffect(() => {
        const buscarPerfil = async () => {
            if (!emailValue || !/^[a-z._%+-]+@epn\.edu\.ec$/.test(emailValue)) return
            if (!['docente', 'user'].includes(rolValue)) return
            try {
                const userData = await authService.buscarPerfil(rolValue, emailValue)
                if (userData?.data) {
                    setValue('nombre',   userData.data.nombre,   { shouldValidate: true, shouldDirty: true })
                    setValue('apellido', userData.data.apellido, { shouldValidate: true, shouldDirty: true })
                }
            } catch {
                // usuario no encontrado — no hacer nada
            }
        }
        const delay = setTimeout(buscarPerfil, 800)
        return () => clearTimeout(delay)
    }, [emailValue, rolValue, setValue])

    const onSubmit = async (dataForm) => {
        try {
            await authService.register(dataForm.rol, dataForm)
            toast.success('Registro exitoso')
            navigate('/Login')
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Error al registrarse')
        }
    }

    return { register, handleSubmit: handleSubmit(onSubmit), errors, showPassword, setShowPassword }
}

export default useRegister