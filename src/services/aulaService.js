import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL
const authHeaders = (token) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` })

export const aulaService = {
    list: async (token) => {
        const { data } = await axios.get(`${baseURL}/aulas`, { headers: authHeaders(token) })
        if (Array.isArray(data))        return data
        if (Array.isArray(data?.data))  return data.data
        if (Array.isArray(data?.aulas)) return data.aulas
        return []
    },
    create: async (payload, token) => {
        const { data } = await axios.post(`${baseURL}/admin/aula`, payload, { headers: authHeaders(token) })
        return data
    },
    update: async (id, payload, token) => {
        const { data } = await axios.put(`${baseURL}/admin/aula/${id}`, payload, { headers: authHeaders(token) })
        return data
    },
    remove: async (id, token) => {
        const { data } = await axios.delete(`${baseURL}/admin/aula/${id}`, { headers: authHeaders(token) })
        return data
    }
}

export const extractAulaError = (error, fallback = 'Error al conectar con el servidor') =>
    error.response?.data?.message || error.response?.data?.error || error.response?.data?.msg || fallback