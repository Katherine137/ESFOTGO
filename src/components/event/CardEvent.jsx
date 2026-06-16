export const CardEvent = ({ evento }) => {
    const fechaFormateada = evento?.fecha
        ? new Date(evento.fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric' })
        : '-'

    const getEstado = () => {
        if (!evento?.fecha || !evento?.hora) return null

        const hoy = new Date()
        const fechaEvento = new Date(evento.fecha)

        const hoyStr = hoy.toISOString().split('T')[0]
        const eventoStr = fechaEvento.toISOString().split('T')[0]

        if (eventoStr < hoyStr) return { label: 'Finalizado', color: 'bg-gray-400 text-white' }

        if (eventoStr === hoyStr) {
            const [horaEvento, minEvento] = evento.hora.split(':').map(Number)
            const horaActual = hoy.getHours()
            const minActual = hoy.getMinutes()

            const minutosEvento = horaEvento * 60 + minEvento
            const minutosActual = horaActual * 60 + minActual

            if (minutosActual < minutosEvento) {
                const diff = minutosEvento - minutosActual
                const horas = Math.floor(diff / 60)
                const mins = diff % 60
                const falta = horas > 0 ? `en ${horas}h ${mins}m` : `en ${mins}m`
                return { label: `🕐 Hoy ${falta}`, color: 'bg-yellow-500 text-white' }
            }

            
            if (minutosActual >= minutosEvento && minutosActual <= minutosEvento + 120) {
                return { label: '📡 Live ', color: 'bg-green-800 text-white animate-pulse' }
            }

            return { label: 'Finalizado', color: 'bg-gray-400 text-white' }
        }

        const diasRestantes = Math.ceil((fechaEvento - hoy) / (1000 * 60 * 60 * 24))
        const label = diasRestantes === 1 ? 'Mañana' : `En ${diasRestantes} días`
        return { label: `📅 ${label}`, color: 'bg-blue-600 text-white' }
    }

    const estado = getEstado()

    return (
        <div className="bg-white border border-slate-200 w-64 h-auto p-4 
                        flex flex-col items-center gap-3 shadow-xl rounded-xl flex-shrink-0">

            <div className="relative">
                <img 
                    src={evento?.imagen || "/Logo.png"} 
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
                <div><b>Nombre:</b> <span>{evento?.nombre}</span></div>
                <div><b>Organizador:</b> <span>{evento?.organizador}</span></div>
                <div><b>Ubicación:</b> <span>{evento?.ubicacion}</span></div>
                <div><b>Fecha:</b> <span>{fechaFormateada}</span></div>
                <div><b>Hora:</b> <span>{evento?.hora}</span></div>
                <div><b>Información:</b> <span>{evento?.informacion}</span></div>
            </div>
        </div>
    )
}