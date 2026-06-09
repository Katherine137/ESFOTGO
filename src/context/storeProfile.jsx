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
            const { token, rol } = storeAuth.getState();
            const { user } = get();
            const id = user?._id || user?.id;

            if (!id || !rol || !token) {
                toast.error("Error de sesión: No se encontró ID o Rol");
                return null;
            }

            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            const url = `${baseUrl}/actualizarperfil/${id}`;
            
            const response = await axios.put(url, data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Corregido: nombre de variable consistente
            const datosActualizados = response.data.administradorBDD ||
                                    response.data.estudiantesBDD ||
                                    response.data.docenteBDD ||
                                    response.data;

            set({ user: datosActualizados }); // Ahora sí actualizará el estado correctamente
            return response.data;

        } catch (error) {
            console.error("Error al actualizar:", error.response?.data);
            const mensajeError = error.response?.data?.msg || "Error al actualizar perfil";
            toast.error(mensajeError);
            throw error; // Lanza el error para que el componente FormularioPerfil pueda manejarlo
        }
    },

    clearUser: () => set({ user: null })
}))

export default storeProfile