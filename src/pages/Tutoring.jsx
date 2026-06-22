import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { MdAdd, MdClose } from 'react-icons/md'
import storeAuth from '../context/storeAuth'
import { CardTutoring } from '../components/Tutoring/card/CardTutoring'
import FormTutoring from '../components/Tutoring/form/FormTutoring'
import { useTutorias } from '../hooks/tutoring/useTutorias'

const Tutoring = () => {
    const { rol } = storeAuth()
    const navigate = useNavigate()
    const { tutorias, loading, fetchTutorias } = useTutorias()
    const [mostrarFormulario, setMostrarFormulario] = useState(false)

    useEffect(() => {
        if (rol && rol !== 'docente') navigate('/dashboard')
    }, [rol, navigate])

    if (!rol || rol !== 'docente') return null

    const handleTutoriaCreada = () => {
        fetchTutorias()
        setMostrarFormulario(false)
    }

    return (
        <>
            <br />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-4 px-4 sm:px-6 lg:px-8">
                <h1 className="font-black text-2xl sm:text-3xl md:text-4xl text-blue-950">Tutorías</h1>
                <button
                    onClick={() => setMostrarFormulario(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-950 hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-lg"
                >
                    <MdAdd className="text-xl" />
                    Nueva Tutoría
                </button>
            </div>

            <br />

            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Cargando tutorías...</p>
                </div>
            ) : (
                <div className="container mx-auto px-4 mb-12">
                    <h2 className="font-black text-xl sm:text-2xl text-blue-950 mb-6 sm:mb-8">
                        Mis Tutorías
                    </h2>
                    <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-100">
                        {tutorias.length > 0 ? (
                            tutorias.map(tutoria => (
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