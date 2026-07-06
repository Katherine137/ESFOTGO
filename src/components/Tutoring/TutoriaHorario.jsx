const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

const TutoriaHorario = ({ horarios, onChange, onAgregar, onEliminar, disabled }) => (
    <div className="mb-3">
        <label className="mb-1 block text-sm font-semibold">Horarios</label>
        <div className="space-y-3">
            {horarios.map((horario, index) => (
                <div key={index} className="flex gap-2 items-center flex-wrap md:flex-nowrap">
                    <select
                        value={horario.dia}
                        onChange={(e) => onChange(index, 'dia', e.target.value)}
                        className="rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 text-sm"
                        disabled={disabled}
                    >
                        <option value="">Día</option>
                        {DIAS.map(dia => (
                            <option key={dia} value={dia}>{dia}</option>
                        ))}
                    </select>

                    <input
                        type="time"
                        value={horario.horaInicio}
                        onChange={(e) => onChange(index, 'horaInicio', e.target.value)}
                        className="rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 text-sm"
                        disabled={disabled}
                    />
                    <span className="text-xs">a</span>
                    <input
                        type="time"
                        value={horario.horaFin}
                        onChange={(e) => onChange(index, 'horaFin', e.target.value)}
                        className="rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950 text-sm"
                        disabled={disabled}
                    />

                    {horarios.length > 1 && (
                        <button
                            type="button"
                            onClick={() => onEliminar(index)}
                            className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                            disabled={disabled}
                        >
                            ✕
                        </button>
                    )}
                </div>
            ))}
        </div>
        <button
            type="button"
            onClick={onAgregar}
            disabled={disabled}
            className="mt-3 text-blue-600 hover:text-blue-800 text-xs font-semibold underline"
        >
            + Agregar otro horario
        </button>
    </div>
)

export default TutoriaHorario