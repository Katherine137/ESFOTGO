const estadoColor = {
    activo:     'bg-green-100 text-green-700 border-green-300',
    inactivo:   'bg-red-100 text-red-600 border-red-300',
    pendiente:  'bg-yellow-100 text-yellow-700 border-yellow-300',
    finalizado: 'bg-gray-100 text-gray-600 border-gray-300',
}

export const StatusBadge = ({ estado }) => (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full border capitalize whitespace-nowrap
        ${estadoColor[estado] || 'bg-gray-100 text-gray-600 border-gray-300'}`}>
        {estado || 'Sin estado'}
    </span>
)