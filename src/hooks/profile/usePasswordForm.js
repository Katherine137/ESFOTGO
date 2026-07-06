import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import storeProfile from '../../context/storeProfile'
import storeAuth from '../../context/storeAuth'
import { profileService } from '../../services/profileServices'

const usePasswordForm = () => {
    const { user } = storeProfile()
    const { token, clearToken } = storeAuth()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (dataForm) => {
        try {
            await profileService.updatePassword(user._id, dataForm, token)
            toast.success('Contraseña actualizada. Inicia sesión de nuevo.')
            clearToken()
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Error al actualizar contraseña')
        }
    }

    return { register, handleSubmit: handleSubmit(onSubmit), errors }
}

export default usePasswordForm