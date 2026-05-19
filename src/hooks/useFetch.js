// useFetch.js
import axios from "axios"
import { toast } from "react-toastify"


export function useFetch() {

    const fetchDataBackend = async (url, data=null, method="GET", headers = {}) => 
        {
            const loadingToast = toast.loading("Procesando solicitud...")
            
            try {
                const options = {
                    method,
                    url,
                    headers: {
                        "Content-Type": "application/json",
                        ...headers,
                    },
                    data
                }
                const response = await axios(options)
                
                toast.dismiss(loadingToast)
                toast.success(response?.data?.msg || "Operación exitosa")
                
                return response?.data 

            } catch (error) {
                
                toast.dismiss(loadingToast)
                console.error("Error en la petición:", error)
                
                
                const errorMessage = error.response?.data?.msg || "Error de conexión o credenciales incorrectas.";
                toast.error(errorMessage)
                
                
                return null; 
            }
    }
    return fetchDataBackend
}