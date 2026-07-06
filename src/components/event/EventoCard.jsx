import { formatearFecha, getEstado } from '../../utils/eventoUtils'

const EventoCard = ({ evento }) => {
    const estado = getEstado(evento?.fecha, evento?.hora)

    return (
        <div className="bg-white border border-slate-200 w-64 p-4 flex flex-col items-center gap-3 shadow-xl rounded-xl flex-shrink-0">
            <div className="relative">
                <img
                    src={evento?.imagen || '/Logo.png'}
                    alt="img-event"
                    className="rounded-full border-2 border-gray-300 w-24 h-24 object-cover"
                />
                {estado && (
                    <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${estado.color}`}>
                        {estado.label}
                    </span>
                )}
            </div>
            <div className="w-full space-y-1 text-sm mt-2">
                <div><b>Nombre:</b> {evento?.nombre}</div>
                <div><b>Organizador:</b> {evento?.organizador}</div>
                <div><b>Ubicación:</b> {evento?.ubicacion}</div>
                <div><b>Fecha:</b> {formatearFecha(evento?.fecha)}</div>
                <div><b>Hora:</b> {evento?.hora}</div>
                <div><b>Información:</b> {evento?.informacion}</div>
            </div>
        </div>
    )
}

export default EventoCard