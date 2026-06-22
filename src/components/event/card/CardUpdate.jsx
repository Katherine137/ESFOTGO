import useEventoUpdate from '../../../hooks/events/useEventoUpdate'

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"

const CardUpdate = () => {
    const {
        register, handleSubmit, errors,
        loading, loadingData, message,
        imagenPreview, handleImagenChange,
        navigate,
    } = useEventoUpdate()

    if (loadingData) return (
        <div className="text-center py-8">
        <p className="text-gray-600">Cargando evento...</p>
        </div>
    )

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-900 max-w-xl mx-auto mt-6">
        <h2 className="text-2xl font-bold text-blue-950 mb-4 text-center">Actualizar Evento</h2>

        {message.text && (
            <div className={`mb-4 p-3 rounded border ${
            message.type === 'success'
                ? 'bg-green-100 text-green-700 border-green-400'
                : 'bg-red-100 text-red-700 border-red-400'
            }`}>
            {message.text}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Imagen */}
            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Imagen del Evento</label>
            <div className="flex flex-col items-center gap-3">
                {imagenPreview ? (
                <img src={imagenPreview} alt="preview" className="w-32 h-32 object-cover rounded-full border-2 border-blue-300"/>
                ) : (
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                    Sin imagen
                </div>
                )}
                <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                disabled={loading}
                className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
            </div>
            </div>

            {/* Nombre */}
            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
            <input
                type="text"
                placeholder="Nombre del evento"
                className={inputClass}
                disabled={loading}
                {...register('nombre', {
                required: 'El nombre es obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                maxLength: { value: 150, message: 'Máximo 150 caracteres' },
                })}
            />
            {errors.nombre && <span className="text-red-600 text-xs">{errors.nombre.message}</span>}
            </div>

            {/* Organizador */}
            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Organizador</label>
            <input
                type="text"
                placeholder="Organizador del evento"
                className={inputClass}
                disabled={loading}
                {...register('organizador', {
                required: 'El organizador es obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                })}
            />
            {errors.organizador && <span className="text-red-600 text-xs">{errors.organizador.message}</span>}
            </div>

            {/* Fecha + Hora */}
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
                <input
                type="date"
                className={inputClass}
                disabled={loading}
                {...register('fecha', { required: 'La fecha es obligatoria' })}
                />
                {errors.fecha && <span className="text-red-600 text-xs">{errors.fecha.message}</span>}
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hora</label>
                <input
                type="time"
                className={inputClass}
                disabled={loading}
                {...register('hora', { required: 'La hora es obligatoria' })}
                />
                {errors.hora && <span className="text-red-600 text-xs">{errors.hora.message}</span>}
            </div>
            </div>

            {/* Ubicación */}
            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación</label>
            <input
                type="text"
                placeholder="Ubicación del evento"
                className={inputClass}
                disabled={loading}
                {...register('ubicacion', {
                required: 'La ubicación es obligatoria',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                maxLength: { value: 200, message: 'Máximo 200 caracteres' },
                })}
            />
            {errors.ubicacion && <span className="text-red-600 text-xs">{errors.ubicacion.message}</span>}
            </div>

            {/* Información */}
            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Información</label>
            <textarea
                placeholder="Detalles del evento..."
                rows="3"
                className={inputClass}
                disabled={loading}
                {...register('informacion', {
                required: 'La información es obligatoria',
                minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                maxLength: { value: 2000, message: 'Máximo 2000 caracteres' },
                })}
            />
            {errors.informacion && <span className="text-red-600 text-xs">{errors.informacion.message}</span>}
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full py-2 px-4 rounded-md text-gray-700 font-bold border border-gray-300 hover:bg-gray-100 transition-all"
            >
                Cancelar
            </button>
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white font-bold transition-all shadow-md ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-950 hover:bg-gray-800'
                }`}
            >
                {loading ? 'Actualizando...' : 'Actualizar Evento'}
            </button>
            </div>

        </form>
        </div>
    )
}

export default CardUpdate