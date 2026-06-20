import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import storeAuth from "../context/storeAuth"
import { CardTutoring } from "../components/Tutoring/CardTutoring"
import FormTutoring from "../components/Tutoring/FormTutoring"
import axios from "axios"
import { MdAdd, MdClose } from "react-icons/md"

const Tutoring = () => {
    const [tutorias, setTutorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
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
            
            setTutorias(response.data.data || [])
        } catch (error) {
            console.error('Error al obtener tutorias:', error)
            setError('No se pudieron cargar las tutorías.')
        } finally {
            setLoading(false)
        }
    }

    const handleTutoriaCreada = () => {
        obtenerTutorias()
        setMostrarFormulario(false)
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
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className='font-black text-4xl text-blue-950'>Tutorías</h1>
                <button
                    onClick={() => setMostrarFormulario(true)}
                    className="flex items-center gap-2 bg-blue-950 hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-lg"
                >
                    <MdAdd className="text-xl" />
                    Nueva Tutoría
                </button>
            </div>

            <br />

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
                <div className="container mx-auto px-4 mb-12">
                    <h2 className='font-black text-2xl text-blue-950 mb-8'>Mis Tutorías</h2>

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
            )}

            {mostrarFormulario && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setMostrarFormulario(false)}
                >
                    <div
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setMostrarFormulario(false)}
                            aria-label="Cerrar"
                            className="absolute top-3 right-3 z-20 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full p-1.5 transition-colors"
                        >
                            <MdClose className="text-xl" />
                        </button>
                        <FormTutoring onCreated={handleTutoriaCreada} />
                    </div>
                </div>
            )}
        </>
    )
}

export default Tutoring