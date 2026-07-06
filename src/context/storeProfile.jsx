import { create } from 'zustand'
import { toast } from 'react-toastify'
import storeAuth from './storeAuth'
import { profileService } from '../services/profileServices'

const storeProfile = create((set, get) => ({
    user: null,
    setUser: (datos) => set({ user: datos }),

    profile: async () => {
        try {
            const { token, rol } = storeAuth.getState()
            if (!token) return null
            const data = await profileService.get(rol, token)
            set({ user: data })
            return data
        } catch (error) {
            console.log('Error en la petición:', error.response?.data)
            return null
        }
    },

    updateProfile: async (data) => {
        try {
            const { token, rol } = storeAuth.getState()
            const { user } = get()
            const id = user?._id || user?.id
            if (!id || !rol || !token) {
                toast.error('Error de sesión: No se encontró ID o Rol')
                return null
            }
            const updated = await profileService.update(id, rol, data, token)
            set({ user: updated })
            return updated
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Error al actualizar perfil')
            throw error
        }
    },

    clearUser: () => set({ user: null })
}))

export default storeProfile