import storeProfile from "../../context/storeProfile"

export const CardProfile = () => {
    const { user } = storeProfile()

    return (
        <div >
            <div className="relative mb-6">
                <img 
                    src="/dragon_logo_1.png" 
                    alt="img-client" 
                    className="m-auto rounded-full w-32 h-32 object-cover" 
                />
                <label className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-2.5 cursor-pointer hover:bg-emerald-500 transition-colors">
                    📷
                    <input type="file" accept="image/*" className="hidden" />
                </label>
            </div>

            <div className="w-full space-y-4 text-slate-700">
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