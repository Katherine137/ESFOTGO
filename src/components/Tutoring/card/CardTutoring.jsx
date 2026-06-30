import { StatusBadge } from '../shared/StatusBadge'
import { formatearFecha } from '../../../utils/tutoringUtils'

export const CardTutoring = ({ tutoria }) => (

    <>
        {console.log(tutoria)}
        
        <div className="bg-white border border-slate-200 w-full h-auto p-5
                        flex flex-col gap-3 shadow-xl rounded-lg hover:shadow-2xl transition-shadow">

            <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-blue-950 text-lg leading-tight">
                    {tutoria?.titulo || 'Sin título'}
                </h3>
                <StatusBadge estado={tutoria?.estado} />
            </div>

            <hr className="border-slate-200" />

            <div className="flex items-center gap-2">
                <span className="text-blue-900">👤</span>
                <div>
                    <b className="text-sm">Docente:</b>
                    <p className="text-sm text-gray-700 inline-block ml-2">
                        {tutoria?.docente
                        ? `${tutoria.docente.nombre} ${tutoria.docente.apellido}`
                        : 'N/A'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span>🏢</span>
                <div>
                    <b className="text-sm">Oficina:</b>
                    <p className="text-sm text-gray-700 inline-block ml-2">{tutoria?.oficina || 'N/A'}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 rounded-md p-2">
                    <p className="text-xs text-gray-500 font-semibold">📅 Fecha</p>
                    <p className="text-sm text-gray-800">{formatearFecha(tutoria?.fecha)}</p>
                </div>
                <div className="bg-slate-50 rounded-md p-2">
                    <p className="text-xs text-gray-500 font-semibold">⏱ Duración</p>
                    <p className="text-sm text-gray-800">
                        {tutoria?.duracion ? `${tutoria.duracion} min` : 'N/A'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span>👥</span>
                <b className="text-sm">Cupo máximo:</b>
                <p className="text-sm text-gray-700 ml-1">{tutoria?.cupo_maximo ?? 'Sin límite'}</p>
            </div>

            <div>
                <b className="text-sm">🕐 Horarios disponibles:</b>
                <div className="ml-1 mt-2 flex flex-col gap-1">
                    {tutoria?.horarios?.length > 0 ? (
                        tutoria.horarios.map((horario, index) => (
                            <div key={index}
                                className="flex items-center gap-2 bg-blue-50 border border-blue-100
                                        rounded-md px-3 py-1 text-sm text-blue-900">
                                <span className="font-semibold w-20">{horario.dia}</span>
                                <span className="text-gray-500">{horario.horaInicio} – {horario.horaFin}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">Sin horarios registrados</p>
                    )}
                </div>
            </div>

            <div>
                <b className="text-sm">📝 Información:</b>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {tutoria?.informacion || 'Sin información adicional'}
                </p>
            </div>
        </div>
    </>
)