import storeProfile from "../../context/storeProfile"

export const CardProfile = () => {
    const { user } = storeProfile()

    return (
        <div>
            <div className="relative mb-6">
                <img 
                    src={user?.imagen || user?.photo || "/Buho_1.png"} 
                    alt={user?.nombre ? `Foto de perfil de ${user.nombre}` : "Foto de perfil"} 
                    className="m-auto rounded-full w-32 h-32 object-cover border-4 border-slate-100" 
                />
            </div>

            <div className="border border-sky-950 px-5 py-3.5 w-fit gap-5 mx-auto" style={{borderRadius: '30px'}}>
                <div className="flex">
                    <b className="w-24 text-slate-400 font-medium">Nombre:</b>
                    <p className="font-semibold text-blue-950">{user?.nombre}</p>
                </div>
                <div className="flex">
                    <b className="w-24 text-slate-400 font-medium">Apellido:</b>
                    <p className="font-semibold text-blue-950">{user?.apellido}</p>
                </div>
                <div className="flex">
                    <b className="w-24 text-slate-400 font-medium">Teléfono:</b>
                    <p className="font-semibold text-blue-950">{user?.telefono}</p>
                </div>
                <div className="flex">
                    <b className="w-24 text-slate-400 font-medium">Correo:</b>
                    <p className="font-semibold text-blue-950">{user?.email}</p>
                </div>
            </div>
        </div>
    )
}