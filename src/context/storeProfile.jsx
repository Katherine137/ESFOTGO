import { create } from "zustand"
import axios from "axios"
import storeAuth from "./storeAuth"
import { toast } from "react-toastify"

const storeProfile = create((set, get) => ({
    user: null,
    setUser: (datos) => set({ user: datos }),
    
    profile: async () => {
        try {
            const { token, rol } = storeAuth.getState()
            if (!token) {
                console.error("No se encontró un token de autenticación válido.")
                return null
            }
            const baseUrl = import.meta.env.VITE_BACKEND_URL

            const perfilUrl = {
                admin: `${baseUrl}/admin/perfil`,
                docente: `${baseUrl}/docente/perfil`,
                user: `${baseUrl}/perfil`
            }

            const url = perfilUrl[rol] || `${baseUrl}/perfil`

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            })

            const datosActualizados = response.data.data ||
                                    response.data.administradorBDD ||
                                    response.data.estudiantesBDD ||
                                    response.data.docenteBDD ||
                                    response.data
            set({ user: datosActualizados })
            return response.data

        } catch (error) {
            console.log("Error en la petición:", error.response?.data)
            return null
        }
    },

    updateProfile: async (data) => {
        try {
            const { token, rol } = storeAuth.getState();
            const { user } = get();
            const id = user?._id || user?.id;

            if (!id || !rol || !token) {
                toast.error("Error de sesión: No se encontró ID o Rol");
                return null;
            }

            const baseUrl = import.meta.env.VITE_BACKEND_URL;

            // ✅ Cada rol tiene su propia ruta de actualización
            const updatePerfilUrl = {
                admin: `${baseUrl}/admin/actualizarperfil/${id}`,
                docente: `${baseUrl}/docente/actualizarperfil/${id}`,
                user: `${baseUrl}/actualizarperfil/${id}`
            }

            const url = updatePerfilUrl[rol] || `${baseUrl}/actualizarperfil/${id}`

            const response = await axios.put(url, data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const datosActualizados = response.data.data ||
                          response.data.administradorBDD ||
                          response.data.estudiantesBDD ||
                          response.data.docenteBDD ||
                          response.data

            set({ user: datosActualizados });
            return response.data;

        } catch (error) {
            console.error("Error al actualizar:", error.response?.data);
            const mensajeError = error.response?.data?.msg || "Error al actualizar perfil";
            toast.error(mensajeError);
            throw error;
        }
    },

    clearUser: () => set({ user: null })
}))

export default storeProfile