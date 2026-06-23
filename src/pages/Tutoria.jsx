import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { MdAdd, MdClose } from 'react-icons/md'
import storeAuth from '../context/storeAuth'
import { CardTutoring } from '../components/Tutoring/card/CardTutoring'
import { useTutorias } from '../hooks/tutoring/useTutorias'

const Tutoria = () => {
    const { rol } = storeAuth()
    const navigate = useNavigate()
    const { tutorias, loading, fetchTutorias } = useTutorias()
    const [mostrarFormulario, setMostrarFormulario] = useState(false)

    useEffect(() => {
        if (rol && rol !== 'user') navigate('/dashboard')
    }, [rol, navigate])

    if (!rol || rol !== 'user') return null

    const handleTutoriaCreada = () => {
        fetchTutorias()
        setMostrarFormulario(false)
    }

    return (
        <>
            <br />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-4 px-4 sm:px-6 lg:px-8">
                <h1 className="font-black text-2xl sm:text-3xl md:text-4xl text-blue-950">Tutorías</h1>
            </div>

            <br />

            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">Cargando tutorías...</p>
                </div>
            ) : (
                <div className="container mx-auto px-4 mb-12">
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
        </>
    )
}

export default Tutoria