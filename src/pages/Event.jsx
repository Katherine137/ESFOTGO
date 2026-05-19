import { useEffect, useState } from 'react'
import axios from 'axios'
import { CardEvent } from "../components/event/CardEvent"
import CardUpdate from "../components/event/CardUpdate"
import FormEvent from "../components/event/FormEvent"
import { useNavigate } from 'react-router'

const Event = () => {
    const [eventos, setEventos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const navigate = useNavigate()
    const rol = localStorage.getItem('rol')

    const obtenerEventos = async () => {
        setLoading(true)
        setError(null)
        try {
            const baseURL = import.meta.env.VITE_BACKEND_URL
            const response = await axios.get(`${baseURL}/eventos`)

            setEventos(response.data)
        } catch (error) {
            console.error('Error al obtener eventos:', error)
            setError('La ruta/eventos no fue encontrada en el servidor.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (rol === null) return
        if (rol !== 'admin') {
            navigate('/dashboard')
        }else{
            obtenerEventos()
        }   
    }, [rol, navigate])

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
                    <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap mb-8'>
                        {eventos.length > 0 ? (
                            eventos.slice(0, 2).map((evento) => (
                                <div key={evento._id} className="w-full md:w-1/2">
                                    <CardEvent evento={evento} />
                                </div>
                            ))
                        ) : (
                            <div className="w-full text-center py-8">
                                <p className="text-gray-500">No hay eventos registrados aún</p>
                            </div>
                        )}
                    </div>

                    <br />

                    {/* Formulario para crear y actualizar */}
                    <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
                        <div className='w-full md:w-1/2'>
                            <FormEvent onEventoCreado={onEventoCreado} />
                        </div>

                        <div className='w-full md:w-1/2'>
                            <CardUpdate />
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Event
