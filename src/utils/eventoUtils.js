export const formatearFecha = (fecha) => {
    if (!fecha) return '-'
    return new Date(fecha).toLocaleDateString('es-EC', {
        day: '2-digit', month: 'long', year: 'numeric'
    })
}

export const getEstado = (fecha, hora) => {
    if (!fecha || !hora) return null

    const hoy = new Date()
    const fechaEvento = new Date(fecha)
    const hoyStr = hoy.toISOString().split('T')[0]
    const eventoStr = fechaEvento.toISOString().split('T')[0]

    if (eventoStr < hoyStr)
        return { label: 'Finalizado', color: 'bg-gray-400 text-white' }

    if (eventoStr === hoyStr) {
        const [horaEvento, minEvento] = hora.split(':').map(Number)
        const minutosEvento = horaEvento * 60 + minEvento
        const minutosActual = hoy.getHours() * 60 + hoy.getMinutes()

        if (minutosActual < minutosEvento) {
            const diff = minutosEvento - minutosActual
            const h = Math.floor(diff / 60), m = diff % 60
            return { label: `🕐 Hoy ${h > 0 ? `en ${h}h ${m}m` : `en ${m}m`}`, color: 'bg-yellow-500 text-white' }
        }
        if (minutosActual <= minutosEvento + 120)
            return { label: '📡 Live', color: 'bg-green-800 text-white animate-pulse' }

        return { label: 'Finalizado', color: 'bg-gray-400 text-white' }
    }

    const diasRestantes = Math.ceil((fechaEvento - hoy) / (1000 * 60 * 60 * 24))
    return {
        label: `📅 ${diasRestantes === 1 ? 'Mañana' : `En ${diasRestantes} días`}`,
        color: 'bg-blue-600 text-white'
    }
}