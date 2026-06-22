import Chat from "./Chat"
const DashboardHome = () => {
    return (
        <div className="container mx-auto">
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className=" p-8 w-full">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                        Bienvenido a ESFOTGO
                    </h1>
                    
                    <div className="flex justify-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl">
                            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                                    Perfil
                                </h3>
                                <p className="text-gray-600">
                                    Administra tu información personal y configuración
                                </p>
                            </div>
                            
                            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                                <h3 className="text-xl font-semibold text-green-900 mb-2">
                                    Eventos
                                </h3>
                                <p className="text-gray-600">
                                    Consulta y gestiona los eventos disponibles
                                </p>
                            </div>


                        </div>
                    </div>
                    
                    <div className="mt-8 p-6 border-yellow-600 -> border-yellow-200 rounded-lg border-2 ">
                        <p className="text-gray-700">
                            💡 <strong>Consejo:</strong> Utiliza el menú lateral para navegar entre las diferentes secciones
                        </p>
                    </div>
                </div>
            </div>
            <Chat />
        </div>
    )
}

export default DashboardHome