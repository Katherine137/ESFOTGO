import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';

const FormEvent = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const registerEventForm = async (dataForm) => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const baseURL = import.meta.env.VITE_BACKEND_URL;
            const url = `${baseURL}/eventos`;

            const response = await axios.post(url, dataForm, {
                headers: { 'Content-Type': 'application/json' }
            });

            setMessage({ type: 'success', text: 'Evento creado exitosamente' });
            reset();

        } catch (error) {
            console.error('Error en el registro:', error);
            const errorMsg = error.response?.data?.message || 
                            error.response?.data?.error || 
                            'Error al conectar con el servidor';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (data) => {
        registerEventForm(data);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-900">
            <h2 className="text-2xl font-bold text-blue-950 mb-4 text-center">Crear Nuevo Evento</h2>

            {message.text && (
                <div className={`mb-4 p-3 rounded border ${
                    message.type === 'success' 
                    ? 'bg-green-100 text-green-700 border-green-400' 
                    : 'bg-red-100 text-red-700 border-red-400'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Campo: nombre */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Evento</label>
                    <input
                        type="text"
                        placeholder="Ej: Taller de Redes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("nombre", { required: "El nombre es obligatorio" })}
                        disabled={loading}
                    />
                    {errors.nombre && <span className="text-red-600 text-xs">{errors.nombre.message}</span>}
                </div>

                {/* Campo: organizador */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Organizador</label>
                    <input
                        type="text"
                        placeholder="Ej: Rama IEEE"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("organizador", { required: "El organizador es obligatorio" })}
                        disabled={loading}
                    />
                    {errors.organizador && <span className="text-red-600 text-xs">{errors.organizador.message}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Campo: fecha */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("fecha", { required: "La fecha es obligatoria" })}
                            disabled={loading}
                        />
                    </div>
                    {/* Campo: hora */}
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

                {/* Campo: ubicacion */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación</label>
                    <input
                        type="text"
                        placeholder="Ej: Auditorio de Sistemas"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("ubicacion", { required: "La ubicación es obligatoria" })}
                        disabled={loading}
                    />
                </div>

                {/* Campo: informacion (IMPORTANTE: Debe llamarse así para el backend) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Información Adicional</label>
                    <textarea
                        placeholder="Detalles del evento..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("informacion", { required: "La información es obligatoria" })}
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
