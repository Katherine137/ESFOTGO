import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL
const authHeaders = (token) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` })

export const docenteService = {
    list: async (token) => {
        const { data } = await axios.get(`${baseURL}/docentes`, { headers: authHeaders(token) })
        return Array.isArray(data) ? data : data?.data || data?.docentes || []
    },
    remove: async (id, token) => {
        const { data } = await axios.delete(`${baseURL}/admin/eliminardocente/${id}`, { headers: authHeaders(token) })
        return data
    },
    update: async (id, payload, token) => {
        const { data } = await axios.put(`${baseURL}/actualizardocente/${id}`, payload, { headers: authHeaders(token) })
        return data
    },
    uploadExcel: async (formData, token) => {
        const { data } = await axios.post(`${baseURL}/admin/upload`, formData, { headers: { Authorization: `Bearer ${token}` } })
        return data
    }
}