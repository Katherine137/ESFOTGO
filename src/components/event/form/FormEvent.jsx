import useEventoForm from '../../../hooks/events/useEventoForm'

const FormEvent = ({ onEventoCreado }) => {
    const { register, handleSubmit, errors, loading, message, imagenPreview, handleImagenChange, ubicaciones } = useEventoForm(onEventoCreado)

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-900">
            <h2 className="text-2xl font-bold text-blue-950 mb-4 text-center">Crear Nuevo Evento</h2>
            {message.text && (
                <div className={`mb-4 p-3 rounded border ${message.type === 'success' ? 'bg-green-100 text-green-700 border-green-400' : 'bg-red-100 text-red-700 border-red-400'}`}>
                {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Imagen del Evento</label>
                    <div className="flex flex-col items-center gap-3">
                        {imagenPreview ? (
                            <img src={imagenPreview} alt="preview" className="w-32 h-32 object-cover rounded-full border-2 border-blue-300" />
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

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Evento</label>
                    <input
                        type="text"
                        placeholder="Ej: Taller de Redes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("nombre", { 
                            required: "El nombre es obligatorio",
                            minLength: { value: 3, message: "El nombre debe tener al menos 3 caracteres" },
                            maxLength: { value: 150, message: "El nombre no puede superar 150 caracteres" }
                        })}
                    />
                    {errors.nombre && <span className="text-red-600 text-xs">{errors.nombre.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Organizador</label>
                    <input
                        type="text"
                        placeholder="Ej: Rama IEEE"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("organizador", { 
                            required: "El organizador es obligatorio",
                            minLength: { value: 3, message: "El organizador debe tener al menos 3 caracteres" }
                        })}
                    />
                    {errors.organizador && <span className="text-red-600 text-xs">{errors.organizador.message}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
                        <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("fecha", { required: "La fecha es obligatoria" })}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Hora</label>
                        <input
                            type="time"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("hora", { required: "La hora es obligatoria" })}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("ubicacion", { required: "La ubicación es obligatoria" })}
                        disabled={loading}
                    >
                        <option value="">Selecciona una ubicación</option>
                        {ubicaciones.map((ubic) => (
                            <option key={ubic._id} value={ubic.nombre}>
                                {ubic.nombre} {ubic.categoria ? `(${ubic.categoria})` : ''}
                            </option>
                        ))}
                    </select>
                    {errors.ubicacion && <span className="text-red-600 text-xs">{errors.ubicacion.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Información Adicional</label>
                    <textarea
                        placeholder="Detalles del evento..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("informacion", { 
                            required: "La información es obligatoria",
                            minLength: { value: 10, message: "La información debe tener al menos 10 caracteres" },
                            maxLength: { value: 2000, message: "La información no puede superar 2000 caracteres" }
                        })}
                        disabled={loading}
                    />
                    {errors.informacion && <span className="text-red-600 text-xs">{errors.informacion.message}</span>}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md text-white font-bold transition-all shadow-md ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-950 hover:bg-gray-800'
                    }`}
                >
                    {loading ? 'Procesando...' : 'Crear Evento'}
                </button>
            </form>
        </div>
    );
};

export default FormEvent;