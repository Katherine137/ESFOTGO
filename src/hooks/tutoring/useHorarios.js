import { useState } from 'react'

const HORARIO_VACIO = { dia: '', horaInicio: '', horaFin: '' }

export const useHorarios = (initial = [{ ...HORARIO_VACIO }]) => {
    const [horarios, setHorarios] = useState(initial)

    const agregarHorario = () =>
        setHorarios(prev => [...prev, { ...HORARIO_VACIO }])

    const eliminarHorario = (index) =>
        setHorarios(prev => prev.filter((_, i) => i !== index))

    const handleHorarioChange = (index, campo, valor) =>
        setHorarios(prev => {
            const copia = [...prev]
            copia[index] = { ...copia[index], [campo]: valor }
            return copia
        })

    const resetHorarios = (nuevos = [{ ...HORARIO_VACIO }]) =>
        setHorarios(nuevos)

    const horariosValidos = () =>
        horarios.every(h => h.dia && h.horaInicio && h.horaFin)

    return { horarios, agregarHorario, eliminarHorario, handleHorarioChange, resetHorarios, horariosValidos }
}