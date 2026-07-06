import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import storeAuth from '../../context/storeAuth'
import storeProfile from '../../context/storeProfile'
import { authService } from '../../services/authService'

const useLogin = () => {
    const [selectedRol, setSelectedRol] = useState('user')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { setAuth } = storeAuth()
    const { profile } = storeProfile()

    const onSubmit = async (dataForm) => {
        try {
            const response = await authService.login(selectedRol, dataForm)
            const token  = response?.token  || response?.data?.token
            const userId = response?.id || response?._id || response?.data?.id || response?.data?._id
            if (token) {
                setAuth(token, selectedRol, userId)
                toast.success(response?.msg || 'Inicio de sesión exitoso')
                navigate('/dashboard')
                profile()
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Credenciales incorrectas')
        }
    }

    return { register, handleSubmit: handleSubmit(onSubmit), errors, selectedRol, setSelectedRol, showPassword, setShowPassword }
}

export default useLogin