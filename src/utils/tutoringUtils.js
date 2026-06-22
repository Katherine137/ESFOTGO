export const mostrarCreador = (creador) => {
    if (!creador) return 'N/A'
    if (typeof creador === 'string') return creador
    return creador.nombre
        ? `${creador.nombre} ${creador.apellido || ''}`.trim()
        : creador.email || 'N/A'
}

export const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha'
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    })
}