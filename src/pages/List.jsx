import { Link } from "react-router-dom"

const List = () => {
    
    return(
        <>
            <div>
                <h1 className='font-black text-4xl text-blue-950'>Listados</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {/*
                <Link 
                    to="/dashboard/list/aulas"
                    className="bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg hover:bg-blue-50 hover:scale-105 transition-all"
                >
                    <div className="text-center">
                        <div className="text-5xl mb-4">🏫</div>
                        <h2 className="text-xl font-bold text-blue-900">Aulas</h2>
                        <p className="text-gray-600 mt-2">Ver listado de aulas</p>
                    </div>
                </Link>
                */}
                <Link 
                    to="/dashboard/list/eventos"
                    className="bg-white border-2 border-green-500 p-6 rounded-lg shadow-lg hover:bg-blue-50 hover:scale-105 transition-all"
                >
                    <div className="text-center">
                        <div className="text-5xl mb-4">📅</div>
                        <h2 className="text-xl font-bold text-green-900">Eventos</h2>
                        <p className="text-gray-600 mt-2">Ver listado de eventos</p>
                    </div>
                </Link>
                {/*
                <Link 
                    to="/dashboard/list/docentes"
                    className="bg-white border-2 border-purple-500 p-6 rounded-lg shadow-lg hover:bg-blue-50 hover:scale-105 transition-all"
                >
                    <div className="text-center">
                        <div className="text-5xl mb-4">📅</div>
                        <h2 className="text-xl font-bold text-purple-900">Docentes</h2>
                        <p className="text-gray-600 mt-2">Ver listado de docentes</p>
                    </div>
                </Link>
                */}
                <Link 
                    to="/dashboard/list/estudiantes"
                    className="bg-white border-2 border-purple-500 p-6 rounded-lg shadow-lg hover:bg-blue-50 hover:scale-105 transition-all block"
                >
                    <div className="text-center">
                        <div className="text-5xl mb-4">🧑‍🎓</div>
                        
                        <h2 className="text-xl font-bold text-purple-900">Estudiantes</h2>
                        
                        <p className="text-gray-600 mt-2">Ver listado de estudiantes</p>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default List