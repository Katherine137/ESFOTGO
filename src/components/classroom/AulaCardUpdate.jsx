import { useForm } from 'react-hook-form'

const AulaCardUpdate = ({ aula, onUpdated }) => {
    const { register, handleSubmit } = useForm({
        defaultValues: { ubicacion: aula?.ubicacion || '', numero: aula?.numero || '', tipo: aula?.tipo || '' }
    })

    const onSubmit = (data) => {
        console.log('Update aula:', data)
        onUpdated?.()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-blue-900 font-bold mb-4 text-xl">Actualizar Aula</h2>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Piso / Ubicación</label>
                <input type="text" placeholder="Ingresa la ubicación"
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register('ubicacion')} />
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Numero</label>
                <input type="text" placeholder="Ingresa el número del aula"
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register('numero')} />
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Tipo</label>
                <select className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register('tipo')}>
                    <option value="">Seleccione un tipo</option>
                    <option value="aula">Aula</option>
                    <option value="laboratorio">Laboratorio</option>
                </select>
            </div>

            <div className="mb-3">
                <button type="submit"
                    className="block w-full py-2 text-center bg-red-900 text-white rounded-xl hover:bg-gray-900 duration-300">
                    Actualizar Aula
                </button>
            </div>
        </form>
    )
}

export default AulaCardUpdate