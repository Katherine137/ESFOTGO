import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL
const authHeaders = (token) => ({ Authorization: `Bearer ${token}` })

const perfilUrl = {
    admin:   `${baseURL}/admin/perfil`,
    docente: `${baseURL}/docente/perfil`,
    user:    `${baseURL}/perfil`
}

const updatePerfilUrl = {
    admin:   (id) => `${baseURL}/admin/actualizarperfil/${id}`,
    docente: (id) => `${baseURL}/docente/actualizarperfil/${id}`,
    user:    (id) => `${baseURL}/actualizarperfil/${id}`
}

const extractUser = (data) =>
    data?.data || data?.administradorBDD || data?.estudiantesBDD || data?.docenteBDD || data

export const profileService = {
    get: async (rol, token) => {
        const url = perfilUrl[rol] || perfilUrl.user
        const { data } = await axios.get(url, { headers: authHeaders(token) })
        return extractUser(data)
    },

    update: async (id, rol, formData, token) => {
        const url = updatePerfilUrl[rol]?.(id) || `${baseURL}/actualizarperfil/${id}`
        const { data } = await axios.put(url, formData, { headers: authHeaders(token) })
        return extractUser(data)
    },

    updatePassword: async (id, payload, token) => {
        const { data } = await axios.put(`${baseURL}/actualizarpassword/${id}`, payload, {
            headers: { 'Content-Type': 'application/json', ...authHeaders(token) }
        })
        return data
    }
}