import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import storeAuth from '../context/storeAuth'
import AulaCard from '../components/classroom/AulaCard'
import AulaForm from '../components/classroom/AulaForm'
import AulaCardUpdate from '../components/classroom/AulaCardUpdate'
import useAulas from '../hooks/classroom/useAulas'

const Classroom = () => {
    const navigate  = useNavigate()
    const { rol }   = storeAuth()
    const { aulas, fetchAulas } = useAulas()

    useEffect(() => {
        if (rol && rol !== 'admin') navigate('/dashboard')
    }, [rol, navigate])

    if (!rol || rol !== 'admin') return null

    return (
        <>
            <div className="px-4 py-6">
                <h1 className="font-black text-4xl text-blue-950">Aulas</h1>
            </div>

            <div className="flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap px-4">
                {aulas.slice(0, 2).map(aula => (
                    <div key={aula._id} className="w-full md:w-1/2">
                        <AulaCard aula={aula} />
                    </div>
                ))}
            </div>

            <br />

            <div className="flex justify-around gap-x-8 flex-wrap gap-y-8 md:flex-nowrap px-4">
                <div className="w-full md:w-1/2">
                    <AulaForm onCreated={fetchAulas} />
                </div>
                <div className="w-full md:w-1/2">
                    <AulaCardUpdate />
                </div>
            </div>
        </>
    )
}

export default Classroom