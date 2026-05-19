import { Navigate, Outlet } from 'react-router-dom'
import storeAuth from '../context/storeAuth'

const PublicRoute = () => {
    const { token } = storeAuth()
    
    if (token) {
        return <Navigate to="/dashboard" replace />
    }
    
    return <Outlet />
}

export default PublicRoute