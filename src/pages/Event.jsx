import { useEffect, useState } from 'react'
import axios from 'axios'
import { CardEvent } from "../components/event/CardEvent"
import CardUpdate from "../components/event/CardUpdate"
import FormEvent from "../components/event/FormEvent"
import { useNavigate } from 'react-router'
import storeAuth from "../context/storeAuth"

const Event = () => {
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    useEffect(() => {
        if (!rol) {
            navigate('/login')
            return
        }
        if (rol !== 'admin') {
            navigate('/dashboard')
            return
        }
        obtenerEventos()
    }, [rol])

    const onEventoCreado = () => {
        obtenerEventos() 
    }

    return (
        <>       
            <div>
                <h1 className='font-black text-4xl text-blue-950'>Eventos</h1>
                <br />
            </div>

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
                <>
                    {/* Mostrar eventos existentes */}
                    <div className="container mx-auto px-4 mb-12">
                        <h1 className='font-black text-4xl text-blue-950 mb-8'>Eventos Registrados</h1>
                        
                        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-100">
                            {eventos.length > 0 ? (
                                eventos.map((evento) => (
                                    // Añadimos min-w-[300px] para asegurar que la card no se aplaste
                                    <div key={evento._id} className="min-w-[300px] md:min-w-[350px]">
                                        <CardEvent evento={evento} />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center w-full py-8">No hay eventos registrados aún</p>
                            )}
                        </div>
                    </div>

                    <br />

                    {/* Formulario para crear y actualizar */}
                    <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
                        <div className='w-full md:w-1/2'>
                            <FormEvent onEventoCreado={onEventoCreado} />
                        </div>

                    </div>
                </>
            )}
        </>
    )
}

export default Event
