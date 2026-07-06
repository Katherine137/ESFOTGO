import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL
const authHeaders = (token) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` })

export const rutaService = {
    list: async (token) => {
        const { data } = await axios.get(`${baseURL}/admin/bus/rutas`, { headers: authHeaders(token) })
        const result = data?.data || data
        return Array.isArray(result) ? result : []
    }
}