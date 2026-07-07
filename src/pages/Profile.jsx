import { useState } from 'react'
import ProfileCard from '../components/profile/ProfileCard'
import ProfileForm from '../components/profile/ProfileForm'
import PasswordForm from '../components/profile/PasswordForm'
import profile from '../../public/profile.png'

const TABS = [
    { key: 'profile',  label: '👤 Mi Perfil' },
    { key: 'edit',     label: '✏️ Editar Datos' },
    { key: 'password', label: '🔒 Contraseña' }
]

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile')

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 gap-6 p-4 md:p-8">
            <aside className="w-full md:w-64 bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-2 h-fit">
                <h1 className="font-black text-2xl text-blue-950 mb-6 px-2">Perfil</h1>
                {TABS.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            activeTab === tab.key ? 'bg-blue-950 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                        {tab.label}
                    </button>
                ))}
            </aside>

            <main className="flex-1 min-h-[400px]">
                <div className="w-full max-w-2xl mx-auto transition-all duration-300">
                    {activeTab === 'profile'  && <ProfileCard />}
                    {activeTab === 'edit'     && <ProfileForm />}
                    {activeTab === 'password' && <PasswordForm />}
                </div>
                <div className="flex justify-center mt-auto pt-10">
                    <img src={profile} alt="" className="w-55"
                        style={{ animation: 'flotar 3s ease-in-out infinite' }} />
                </div>
            </main>
        </div>
    )
}

export default Profile