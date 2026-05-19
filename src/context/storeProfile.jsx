import { create } from "zustand"
import axios from "axios"
import storeAuth from "./storeAuth"
import { toast } from "react-toastify"

const storeProfile = create((set, get) => ({
    user: null,
    setUser: (datos) => set({ user: datos }),
    
    profile: async () => {
        try {
            const { token } = storeAuth.getState()
            if (!token) {
                console.error("No se encontró un token de autenticación válido.")
                return null
            }
            const baseUrl = import.meta.env.VITE_BACKEND_URL
            const response = await axios.get(`${baseUrl}/perfil`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const datosActualizados = response.data.administradorBDD ||
                                      response.data.estudiantesBDD ||
                                      response.data.docenteBDD ||
                                      response.data

            set({ user: datosActualizados })
            return response.data
        } catch (error) {
            console.log("Error en la petición:", error.response.data);
            return null
        }
    },

    updateProfile: async (data) => {
        try {
            // 1. Obtenemos el token de auth
            const { token, rol } = storeAuth.getState()
            // 2. IMPORTANTE: Obtenemos el usuario de ESTE store (storeProfile)
            // O usamos el que ya tenemos en el estado local del set/get
            const { user } = get()
            const id = user?._id || user?.id

            if (!id || !rol || !token) {
                console.error("Falta datos criticos", { token, id, rol })
                toast.error("Error de sesión: No se encontró ID o Rol")
                return null
            }

            const baseUrl = import.meta.env.VITE_BACKEND_URL
            const url = `${baseUrl}/actualizarperfil/${id}`
            
            const response = await axios.put(url, data, {
                headers: { Authorization: `Bearer ${token}` }
            })

            const datosactualizados = response.data.administradorBDD ||
                                    response.data.estudiantesBDD ||
                                    response.data.docenteBDD ||
                                    response.data

            set({ user: datosActualizados })
            toast.success("Perfil actualizado con éxito")
            return response.data

        } catch (error) {
            const mensajeError = error.response ? error.response.data.msg : error.message;
            console.error("Error en la petición:", error.response)
            toast.error(error.response?.data?.msg || "Error al actualizar perfil")
            return null
        }
    },

    clearUser: () => set({ user: null })
}))

export default storeProfile