import { useEffect, useState } from 'react'
import axios from 'axios'
import { CardEvent } from "../components/event/CardEvent"
import CardUpdate from "../components/event/CardUpdate"
import FormEvent from "../components/event/FormEvent"
import { useNavigate } from 'react-router'
import storeAuth from "../context/storeAuth"
import { MdAdd, MdClose } from "react-icons/md"

const Event = () => {
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const navigate = useNavigate()
    const { rol } = storeAuth()

    const obtenerEventos = async () => {
        setLoading(true)
        setError(null)
        try {
            const baseURL = import.meta.env.VITE_BACKEND_URL
            const response = await axios.get(`${baseURL}/eventos`)
            console.log('Respuesta del servidor:', response.data);
            setEventos(Array.isArray(response.data) ? response.data : response.data.data || response.data.eventos || []);
        } catch (error) {
            console.error('Error al obtener eventos:', error)
            setError('La ruta/eventos no fue encontrada en el servidor.')
        } finally {
            setLoading(false)
        }
    }

    const handleEventoCreado = () => {
        obtenerEventos()
        setMostrarFormulario(false)
    }

    useEffect(() => {
        if (!rol) {
            navigate('/login')
            return
        }
        obtenerEventos()
    }, [rol])

    return (
        <>       
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className='font-black text-4xl text-blue-950'>Eventos</h1>
                <button
                    onClick={() => setMostrarFormulario(true)}
                    className="flex items-center gap-2 bg-blue-950 hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-lg"
                >
                    <MdAdd className="text-xl" />
                    Nuevo Evento
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
                    <p className="text-gray-600">Cargando eventos...</p>
                </div>
            ) : (
                <div className="container mx-auto px-4 mb-12">
                    <h2 className='font-black text-2xl text-blue-950 mb-8'>Eventos Registrados</h2>
                    
                    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-100">
                        {eventos.length > 0 ? (
                            eventos.map((evento) => (
                                <div key={evento._id} className="min-w-[300px] md:min-w-[350px]">
                                    <CardEvent evento={evento} />
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center w-full py-8">No hay eventos registrados aún</p>
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
                        <FormEvent onEventoCreado={handleEventoCreado} />
                    </div>
                </div>
            )}
        </>
    )
}

export default Event