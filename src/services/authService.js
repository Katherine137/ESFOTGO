import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL

const loginUrl    = { admin: `${baseURL}/admin/login`,    docente: `${baseURL}/docente/login`,    user: `${baseURL}/estudiantes/login` }
const registerUrl = { admin: `${baseURL}/admin/registro`, docente: `${baseURL}/docente/registro`, user: `${baseURL}/estudiantes/registro` }
const buscarUrl   = { docente: (e) => `${baseURL}/buscarDocente?email=${e}`, user: (e) => `${baseURL}/buscarEstudiante?email=${e}` }

export const authService = {
    login: async (rol, credentials) => {
        const { data } = await axios.post(loginUrl[rol] || loginUrl.user, credentials)
        return data
    },
    register: async (rol, payload) => {
        const { data } = await axios.post(registerUrl[rol] || registerUrl.user, payload)
        return data
    },
    buscarPerfil: async (rol, email) => {
        const url = buscarUrl[rol]?.(email)
        if (!url) return null
        const { data } = await axios.get(url)
        return data
    },
    recuperarPassword: async (email) => {
        const url = `${baseURL}/recuperarpassword`
        
        console.log('=== DEBUG FORGOT ===')
        console.log('URL llamada:', url)
        console.log('Email enviado:', email)
        console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL)
        
        const { data } = await axios.post(url, { email })
        
        console.log('Respuesta del servidor:', data)
        return data
    },
    verificarToken: async (token) => {
        const { data } = await axios.get(`${baseURL}/recuperarpassword/${token}`)
        return data
    },
    nuevoPassword: async (token, payload) => {
        const { data } = await axios.post(`${baseURL}/nuevopassword/${token}`, payload)
        return data
    }
}
