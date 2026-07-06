import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL

const authHeaders = (token) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
})

export const eventService = {
    listPublic: async () => {
        const { data } = await axios.get(`${baseURL}/eventos`)
        return Array.isArray(data) ? data : data?.data || data?.eventos || []
    },

    listPrivate: async (token) => {
        const { data } = await axios.get(`${baseURL}/eventos`, {
            headers: authHeaders(token)
        })
        const result = data?.data || data
        return Array.isArray(result) ? result : []
    },

    getById: async (id, token) => {
        const { data } = await axios.get(`${baseURL}/verevento/${id}`, {
            headers: authHeaders(token)
        })
        return data?.data || data
    },

    create: async (payload) => {
        const { data } = await axios.post(`${baseURL}/admin/evento`, payload, {
            headers: { 'Content-Type': 'application/json' }
        })
        return data
    },

    update: async (id, payload, token) => {
        const { data } = await axios.put(`${baseURL}/admin/actualizarevento/${id}`, payload, {
            headers: authHeaders(token)
        })
        return data
    },

    remove: async (id, token) => {
        const { data } = await axios.delete(`${baseURL}/admin/eliminarevento/${id}`, {
            headers: authHeaders(token)
        })
        return data
    },

    listUbicaciones: async (token) => {
        const headers = token ? authHeaders(token) : { 'Content-Type': 'application/json' }
        const { data } = await axios.get(`${baseURL}/mapa/ubicaciones`, { headers })
        return data?.data || []
    }
}

export const extractApiError = (error, fallback = 'Error al conectar con el servidor') =>
    error.response?.data?.message || error.response?.data?.error || error.response?.data?.msg || fallback