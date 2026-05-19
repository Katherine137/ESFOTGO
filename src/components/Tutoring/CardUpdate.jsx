import { useState } from 'react'

const CardUpdate = () => {
    const [horarios, setHorarios] = useState([
        { dia: '', horaInicio: '', horaFin: '' }
    ])

    const agregarHorario = () => {
        setHorarios([...horarios, { dia: '', horaInicio: '', horaFin: '' }])
    }

    const eliminarHorario = (index) => {
        const nuevosHorarios = horarios.filter((_, i) => i !== index)
        setHorarios(nuevosHorarios)
    }

    const handleHorarioChange = (index, campo, valor) => {
        const nuevosHorarios = [...horarios]
        nuevosHorarios[index][campo] = valor
        setHorarios(nuevosHorarios)
    }

    return (
        <form>
            <h2 className="text-blue-900">Actualizar tutoria</h2>
            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Docente</label>
                <input type="text" placeholder="Ingresa el nombre del docente" className="block w-full rounded-md border
                border-blue-500  py-1 px-1.5 text-neutral-950"
                />
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Oficina</label>
                <input type="text" placeholder="Ingresa el numero de oficina" className="block w-full rounded-md border
                border-blue-500  py-1 px-1.5 text-neutral-950"
                />
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Horarios</label>
                
                <div className="space-y-3">
                    {horarios.map((horario, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <select 
                                value={horario.dia}
                                onChange={(e) => handleHorarioChange(index, 'dia', e.target.value)}
                                className="rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                            >
                                <option value="">Seleccione día</option>
                                <option value="lunes">Lunes</option>
                                <option value="martes">Martes</option>
                                <option value="miércoles">Miércoles</option>
                                <option value="jueves">Jueves</option>
                                <option value="viernes">Viernes</option>
                            </select>

                            <span className="text-sm">de</span>

                            <input 
                                type="time" 
                                value={horario.horaInicio}
                                onChange={(e) => handleHorarioChange(index, 'horaInicio', e.target.value)}
                                className="rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                            />

                            <span className="text-sm">a</span>

                            <input 
                                type="time" 
                                value={horario.horaFin}
                                onChange={(e) => handleHorarioChange(index, 'horaFin', e.target.value)}
                                className="rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                            />

                            {horarios.length > 1 && (
                                <button 
                                    type="button"
                                    onClick={() => eliminarHorario(index)}
                                    className="text-red-600 hover:text-red-800 font-bold"
                                >
                                    ✕ Eliminar Horario
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button 
                    type="button"
                    onClick={agregarHorario}
                    className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-semibold"
                >
                    + Agregar otro horario
                </button>
            </div>
            
            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Información</label>
                <textarea placeholder="Ingresa la información de la tutoria" className="block w-full 
                rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"></textarea>
            </div>

            <div className="mb-3">
                <input type="submit"
                className="block w-full py-2 text-center bg-red-900 text-white rounded-xl hover:bg-gray-900 duration-300"
                value='Actualizar Evento'
                />
            </div>
        </form>
    )
}

export default CardUpdate