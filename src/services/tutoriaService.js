import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL

const authHeaders = (token) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
})

export const tutoriaService = {
    listAll: async (token) => {
        const { data } = await axios.get(`${baseURL}/admin/tutorias`, {
            headers: authHeaders(token)
        })
        return data?.data || []
    },

    getById: async (id, token) => {
        const { data } = await axios.get(`${baseURL}/admin/tutorias/${id}`, {
            headers: authHeaders(token)
        })
        return data?.data
    },

    create: async (payload, token) => {
        const { data } = await axios.post(`${baseURL}/admin/tutoria`, payload, {
            headers: authHeaders(token)
        })
        return data
    },

    update: async (id, payload, token) => {
        const { data } = await axios.put(`${baseURL}/admin/tutoria/${id}`, payload, {
            headers: authHeaders(token)
        })
        return data
    },

    remove: async (id, token) => {
        const { data } = await axios.delete(`${baseURL}/admin/tutoria/${id}`, {
            headers: authHeaders(token)
        })
        return data
    },

    toggleEstado: async (id, estado, token) => {
        const { data } = await axios.put(`${baseURL}/admin/tutoria/${id}`, { estado }, {
            headers: authHeaders(token)
        })
        return data
    }
}

export const extractTutoriaError = (error, fallback = 'Error al conectar con el servidor') =>
    error.response?.data?.message || error.response?.data?.error || error.response?.data?.msg || fallback