import useAulaForm from '../../hooks/classroom/useAulaForm'

const AulaForm = ({ onCreated }) => {
    const { register, handleSubmit, errors, loading, message } = useAulaForm(onCreated)

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-blue-900 font-bold mb-4 text-xl">Crear Aula</h2>

            {message.text && (
                <div className={`p-3 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Ubicación</label>
                <input type="text" placeholder="Ingresa la ubicación"
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register('ubicacion', { required: 'La ubicación es obligatoria' })} />
                {errors.ubicacion && <p className="text-red-800 text-xs mt-1">{errors.ubicacion.message}</p>}
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Número</label>
                <input type="text" placeholder="Ingresa el número del aula"
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register('numero', { required: 'El número es obligatorio' })} />
                {errors.numero && <p className="text-red-800 text-xs mt-1">{errors.numero.message}</p>}
            </div>

            <div className="mb-3">
                <label htmlFor="tipo" className="mb-1 block text-sm font-semibold">Tipo</label>
                <select id="tipo"
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register('tipo', { required: 'El tipo es obligatorio' })}>
                    <option value="">Seleccione un tipo</option>
                    <option value="aula">Aula</option>
                    <option value="laboratorio">Laboratorio</option>
                </select>
                {errors.tipo && <p className="text-red-800 text-xs mt-1">{errors.tipo.message}</p>}
            </div>

            <div className="mb-3">
                <button type="submit" disabled={loading}
                    className={`block w-full py-2 text-center text-white rounded-xl duration-300 font-semibold ${loading ? 'bg-gray-400' : 'bg-red-900 hover:bg-gray-900'}`}>
                    {loading ? 'Enviando...' : 'Crear Aula'}
                </button>
            </div>
        </form>
    )
}

export default AulaForm