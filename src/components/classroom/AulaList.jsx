import useAulas from '../../hooks/classroom/useAulas'

const AulaList = () => {
    const { aulas, loading, error } = useAulas()

    if (loading) return (
        <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Cargando aulas...</p>
        </div>
    )

    if (error) return (
        <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 mx-4" role="alert">
            <span className="font-medium">Error: {error}</span>
        </div>
    )

    if (aulas.length === 0) return (
        <div className="p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 mx-4" role="alert">
            <span className="font-medium">No existen registros de aulas</span>
        </div>
    )

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Lista de Aulas</h2>
            <div className="w-full overflow-x-auto rounded-lg shadow-lg">
                <table className="w-full table-auto bg-white">
                    <thead className="bg-gray-800 text-slate-400">
                        <tr>
                            {['N°', 'Número', 'Ubicación', 'Tipo'].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {aulas.map((aula, index) => (
                            <tr className="hover:bg-gray-50 text-gray-700" key={aula._id}>
                                <td className="px-4 py-3">{index + 1}</td>
                                <td className="px-4 py-3">{aula.numero}</td>
                                <td className="px-4 py-3">{aula.ubicacion}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                                        aula.tipo === 'aula'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-purple-100 text-purple-800'
                                    }`}>
                                        {aula.tipo}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AulaList