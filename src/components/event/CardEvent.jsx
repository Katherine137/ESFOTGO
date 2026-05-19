export const CardEvent = ({ event }) => {

    return (
        <div className="bg-white border border-slate-200 w-auto h-auto p-4 
                        flex flex-col items-center justify-between shadow-xl rounded-lg">

            <div className="relative">
                <img 
                    src={event?.imagen || "/dragon_logo_1.png"} 
                    alt="img-event" 
                    className="m-auto rounded-full border-2 border-gray-300 w-30" 
                />
                
                <label className="absolute bottom-0 right-0 bg-blue-400 text-white rounded-full p-2 cursor-pointer hover:bg-emerald-400">
                    📷
                    <input type="file" accept="image/*" className="hidden" />
                </label>
            </div>

            <div className="self-start">
                <b>Nombre:</b>
                <p className="inline-block ml-3">{event?.nombre}</p>
            </div>

            <div className="self-start">
                <b>Organizador:</b>
                <p className="inline-block ml-3">{event?.organizador}</p>
            </div>

            <div className="self-start">
                <b>Ubicación:</b>
                <p className="inline-block ml-3">{event?.ubicacion}</p>
            </div>

            <div className="self-start">
                <b>Fecha:</b>
                <p className="inline-block ml-3">{event?.fecha}</p>
            </div>

            <div className="self-start">
                <b>Hora:</b>
                <p className="inline-block ml-3">{event?.hora}</p>
            </div>

            <div className="self-start">
                <b>Información:</b>
                <p className="inline-block ml-3">{event?.informacion}</p>
            </div>
        
        </div>
    )
}