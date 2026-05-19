export const CardTutoring = ({ docente }) => {
    
    return(
        <div className="bg-white border border-slate-200 w-auto h-auto p-4 
                        flex flex-col items-center justify-between shadow-xl rounded-lg">

            <div className="self-start">
                <b>Docente:</b>
                <p className="inline-block ml-3">
                    {docente?.nombre && docente?.apellido 
                        ? `${docente.nombre} ${docente.apellido}` 
                        : 'N/A'}
                </p>
            </div>

            <div className="self-start">
                <b>Oficina:</b>
                <p className="inline-block ml-3">
                    {docente?.Oficina?.numero}
                </p>
            </div>

            <div className="self-start">
                <b>Horarios Disponibles:</b>
                <div className="ml-3 mt-1">
                    {docente?.horariosDisponibles?.length > 0 ? (
                        docente.horariosDisponibles
                            .filter(h => h.disponible)
                            .map((horario, index) => (
                                <p key={index} className="text-sm">
                                    {horario.dia}: {horario.horaInicio} - {horario.horaFin}
                                </p>
                            ))
                    ) : (
                        <p className="text-sm">No hay horarios disponibles</p>
                    )}
                </div>
            </div>
            <div className="self-start w-full">
                <b>Información:</b>
                <p className="ml-3 mt-1 text-sm">{docente?.informacion}</p>
            </div>

        </div>
    )
}   