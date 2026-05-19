import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import storeAuth from "../context/storeAuth"
import { CardClassroom } from "../components/Classroom/CardClassroom"
import CardUpdate from "../components/Classroom/CardUpdate"
import FormClassroom from "../components/Classroom/FormClassroom"

const Classroom = () => {
    const [clases, setClases] = useState([])
    const [loading, setloading] = useState(true)
    const [error, setError] = useState(null)

    const navigate = useNavigate()
    const rol = localStorage.getItem('rol')

    const obtenerclases = async () => {
        setloading(true)
        setError(null)
        try {
            const baseURL = import.meta.env.VITE_BACKEND_URL
            const response = await axios.get(`${baseURL}/clases`)

            setClases(response.data)
        } catch (error) {
            console.error('Error al obtener evento0s:', error)
            setError('la ruta/clases no fue encontrada en el servidor.')
        } finally{
            setloading(false)
        }
    }

    useEffect(() => {
        if (rol !== 'admin'){
            navigate('/dashboard')
        } else {
            obtenerclases()
        }
        
        if (!rol) {
            return <div className="p-8 text-center text-blue-950 font-bold">Cargando permisos...</div>
        }
        if (rol === null) return
    }, [rol, navigate])

    const onClaseCreada = () => {
        obtenerclases()
    }

    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-blue-950'>Aula</h1>
                <br />
            </div>

            <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
                <div className="w-full md:w-1/2">
                    <CardClassroom/>
                </div>

                <div className="w-full md:w-1/2">
                    <CardClassroom/>
                </div>
            </div>

            <br />

            <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
                <div className='w-full md:w-1/2'>
                    <FormClassroom onClaseCreada={onClaseCreada}/>
                </div>

                <div className='w-full md:w-1/2 '>
                    <CardUpdate/>
                </div>
        
            </div>

        </>
    )
}

export default Classroom