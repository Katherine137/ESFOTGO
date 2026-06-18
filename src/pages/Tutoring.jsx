import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import storeAuth from "../context/storeAuth"
import { CardTutoring } from "../components/Tutoring/CardTutoring"
import FormTutoring from "../components/Tutoring/FormTutoring"
import axios from "axios"

const Tutoring = () => {
    const [tutorias, setTutorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { rol, token } = storeAuth()
    const navigate = useNavigate()

    const obtenerTutorias = async () => {
        setLoading(true)
        setError(null)
        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL
            const response = await axios.get(`${baseUrl}/admin/tutorias`, { 
                headers: { Authorization: `Bearer ${token}` }             
            })
            console.log('Respuesta del servidor', response.data)

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.data || response.data.tutorias || []

            const misTutorias = data.filter(t => 
                t.docente === usuario?.nombre ||     
                t.creado_por === usuario?._id
            )
            setTutorias(response.data.data || [])
        } catch (error) {
            console.error('Error al obtener tutorias:', error)
            setError('No se pudieron cargar las tutorías.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (rol && rol !== 'docente') {
            navigate('/dashboard')
        }
    }, [rol, navigate])

    useEffect(() => {
        if (rol === 'docente' && token) {
            obtenerTutorias()
        }
    }, [rol, token])

    if (!rol || rol !== 'docente') return null

    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-blue-950'>Tutorías</h1>
                <br />
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Cargando tutorias...</p>
                </div>
            ) : (
                <>
                    <div className="container mx-auto px-4 mb-12">
                        <h1 className='font-black text-4xl text-blue-950 mb-8'>Mis Tutorías</h1>

                        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-100">
                            {tutorias.length > 0 ? (
                                tutorias.map((tutoria) => (
                                    <div key={tutoria._id} className="min-w-[300px] md:min-w-[350px]">
                                        <CardTutoring tutoria={tutoria} />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center w-full py-8">
                                    No tienes tutorías registradas aún
                                </p>
                            )}
                        </div>
                    </div>

                    <br />

                    <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
                        <div className='w-full md:w-1/2'>
                            <FormTutoring onCreated={obtenerTutorias} /> 
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Tutoring