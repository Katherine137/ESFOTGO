import { Navigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import storeAuth from "../context/storeAuth"

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { token, rol, setToken, setRol } = storeAuth()
    const location = useLocation()
    const [isChecking, setIsChecking] = useState(true)

    const params = new URLSearchParams(location.search)
    const tokenInUrl = params.get('token')
    const rolInUrl = params.get('rol') // Capturamos el rol si viene en la URL (común en OAuth)

    useEffect(() => {
        const checkAuth = () => {
            if (tokenInUrl) {
                console.log('🔑 Token encontrado en URL, guardando...')
                setToken(tokenInUrl)
                if (rolInUrl) setRol(rolInUrl)
                
                // Limpiar URL
                const newUrl = window.location.pathname
                window.history.replaceState({}, '', newUrl)
            }
            setIsChecking(false)
        }
        checkAuth()
    }, [tokenInUrl, rolInUrl, setToken, setRol])

    // Mientras se procesa el token de la URL, no renderizamos nada o un loading
    if (isChecking) return null 

    // Si no hay token en el store ni en la URL, redirigir
    if (!token && !tokenInUrl) {
        console.log('❌ No autenticado, redirigiendo a login...')
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Validación de Roles (Asegúrate que coincidan con 'user', 'docente', 'admin')
    if (allowedRoles.length > 0 && !allowedRoles.includes(rol)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">
                        Acceso Denegado
                    </h1>
                    <p className="text-gray-600 mb-4">
                        No tienes permisos para acceder a esta página.
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        Tu rol actual: <span className="font-semibold">{rol || 'Sin rol'}</span>
                    </p>
                    <button 
                        onClick={() => window.history.back()}
                        className="bg-blue-950 text-white px-6 py-2 rounded-md hover:bg-blue-900 transition-colors"
                    >
                        Volver
                    </button>
                </div>
            </div>
        )
    }
    
    return children
}

export default ProtectedRoute