import { useState } from 'react'
import CardPassword from '../components/profile/CardPassword'
import { CardProfile } from '../components/profile/CardProfile'
import FormProfile from '../components/profile/FormProfile'
import profileImg from '../assets/profile.png'

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile')

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 gap-6 p-4 md:p-8">
            
            {/* El aside mantiene su fondo blanco para resaltar como menú */}
            <aside className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-2 h-fit">
                <h1 className='font-black text-2xl text-blue-950 mb-6 px-2'>Perfil</h1>
                
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        activeTab === 'profile'
                            ? 'bg-blue-950 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    👤 Mi Perfil
                </button>

                <button
                    onClick={() => setActiveTab('edit')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        activeTab === 'edit'
                            ? 'bg-blue-950 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    ✏️ Editar Datos
                </button>

                <button
                    onClick={() => setActiveTab('password')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        activeTab === 'password'
                            ? 'bg-blue-950 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    🔒 Contraseña
                </button>
            </aside>

            <main className="flex-1 min-h-[400px]">
                <div className="w-full max-w-2xl mx-auto transition-all duration-300">
                    
                    {activeTab === 'profile' && (
                        <div className="animate-fadeIn">
                            <CardProfile />
                        </div>
                    )}

                    {activeTab === 'edit' && (
                        <div className="animate-fadeIn">
                            <FormProfile />
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className="animate-fadeIn">
                            <CardPassword />
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-auto pt-10">
                    <img 
                        src={profileImg} 
                        alt="" 
                        className="w-55"
                        style={{
                            animation: 'flotar 3s ease-in-out infinite'
                        }}
                    />
                </div>
            </main>

        </div>
    )
}

export default Profile