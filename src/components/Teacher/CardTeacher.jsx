export const CardTeacher = ({ docente }) => {
    
    return(

        <div className="bg-white border border-slate-200 w-auto h-auto p-4 
                        flex flex-col items-center justify-between shadow-xl rounded-lg">

            <div className="relative">

                <img 
                    src={docente?.imagen || "/dragon_logo_1.png"} 
                    alt="img-teacher" 
                    className="m-auto rounded-full border-2 border-gray-300 w-30" 
                />
                
                <label className="absolute bottom-0 right-0 bg-blue-400 text-white rounded-full p-2 cursor-pointer hover:bg-emerald-400">
                    📷
                    <input type="file" accept="image/*" className="hidden" />
                </label>

            </div>


            <div className="self-start">
                <b>Nombre:</b>
                <p className="inline-block ml-3">{docente?.nombre}</p>
            </div>

            <div className="self-start">
                <b>Apellido:</b>
                <p className="inline-block ml-3">{docente?.apellido}</p>
            </div>

            <div className="self-start">
                <b>Celular:</b>
                <p className="inline-block ml-3">{docente?.celular}</p>
            </div>

            <div className="self-start">
                <b>Email:</b>
                <p className="inline-block ml-3">{docente?.email}</p>
            </div>
            
            <div className="self-start">
                <b>Oficina:</b>
                <p className="inline-block ml-3">{docente?.Oficina?.numero}</p>
            </div>
        
        </div>
    )
}