import { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'
import { CardEvent } from '../components/event/card/CardEvent'
import FormEvent from '../components/event/form/FormEvent'
import useEventos from '../hooks/events/useEventos'
import storeAuth from '../context/storeAuth'

const Event = () => {
    const { eventos, loading, error, obtenerEventos } = useEventos()
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const rol = storeAuth((state) => state.rol)

    const puedeCrearEvento = rol === 'admin' || rol === 'docente'

    const handleEventoCreado = () => {
        obtenerEventos()
        setMostrarFormulario(false)
    }

    return (
        <>
            <br />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-4 px-4 sm:px-6 lg:px-8">
                <h1 className="font-black text-2xl sm:text-3xl md:text-4xl text-blue-950">Eventos</h1>
                {puedeCrearEvento &&  (
                <button
                    onClick={() => setMostrarFormulario(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-950 hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-lg"
                >
                    <MdAdd className="text-xl" />
                    Nuevo Evento
                </button>
                )}
            </div>

            <br />

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4 sm:mx-6 lg:mx-8">
                {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-8">
                <p className="text-gray-600">Cargando eventos...</p>
                </div>
            ) : (
                <EventosGrid eventos={eventos} />
            )}

            {mostrarFormulario && (
                <EventoModal
                onClose={() => setMostrarFormulario(false)}
                onEventoCreado={handleEventoCreado}
                />
            )}
        </>
    )
    }

    const EventosGrid = ({ eventos }) => (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <h2 className="font-black text-xl sm:text-2xl text-blue-950 mb-6 sm:mb-8">
                Eventos Registrados
            </h2>
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-100">
                {eventos.length > 0 ? (
                    eventos.map((evento) => (
                    <div
                        key={evento._id}
                        className="min-w-[85vw] sm:min-w-[300px] md:min-w-[350px] snap-start"
                    >
                        <CardEvent evento={evento} />
                    </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center w-full py-8">
                    No hay eventos registrados aún
                    </p>
                )}
            </div>
        </div>
    )

    const EventoModal = ({ onClose, onEventoCreado }) => (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
            className="relative w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            >
            <button
                onClick={onClose}
                aria-label="Cerrar"
                className="absolute top-3 right-3 z-20 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full p-1.5 transition-colors"
            >
                <MdClose className="text-xl" />
            </button>
            <FormEvent onEventoCreado={onEventoCreado} />
            </div>
        </div>
    )

export default Event