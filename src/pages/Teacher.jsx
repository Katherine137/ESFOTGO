import { useEffect } from "react"
import { useNavigate } from "react-router"
import storeAuth from "../context/storeAuth"
import { CardTeacher } from "../components/Teacher/CardTeacher"
import FormTeacher from "../components/Teacher/FormTeacher"
import CardPassword from "../components/Teacher/CardPassword"

const Teacher = () => {
    const { rol } = storeAuth()
    const navigate = useNavigate()
    const [docentes, setDocentes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const obtenerDocentes = async () => {
        setLoading(true)
        setError(null)
        try {
            const baseURL = import.meta.env.VITE_BACKEND_URL
            const response = await axios.get(`${baseURL}/docentes`)

            setEventos(response.data)
        } catch (error) {
            console.error('Error al obtener docentes:', error)
            setError('La ruta/docentes no fue encontrada en el servidor.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (rol === null) return
        if (rol !== 'admin') {
            navigate('/dashboard')
        } else {
            obtenerDocentes()
        }
    }, [rol, navigate])

    const onDocenteCreado = () => {
        obtenerDocentes()
    }

    return (
        <>
            <div>
                <h1 className='font-black text-4xl text-blue-950'>Docente</h1>
                <br />
            </div>

            <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
                <div className="w-full md:w-1/2">
                    <CardTeacher />
                </div>

                <div className="w-full md:w-1/2">
                    <CardTeacher />
                </div>
            </div>

            <br />

            <div className='flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap'>
                <div className='w-full md:w-1/2'>
                    <FormTeacher onDocenteCreado={onDocenteCreado}/>
                </div>

                <div className='w-full md:w-1/2 '>
                    <CardPassword />
                </div>
            </div>
        </>
    )
}

export default Teacher