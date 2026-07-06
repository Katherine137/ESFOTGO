const AulaCard = ({ aula }) => (
    <div className="bg-white border border-slate-200 w-auto h-auto p-4 flex flex-col items-center justify-between shadow-xl rounded-lg">
        <div className="relative">
            <img src={aula?.imagen || '/dragon_logo_1.png'} alt="img-classroom"
                className="m-auto rounded-full border-2 border-gray-300 w-30" />
        </div>
        <div className="self-start"><b>Numero:</b><p className="inline-block ml-3">{aula?.numero}</p></div>
        <div className="self-start"><b>Ubicación:</b><p className="inline-block ml-3">{aula?.ubicacion}</p></div>
        <div className="self-start"><b>Tipo:</b><p className="inline-block ml-3">{aula?.tipo}</p></div>
    </div>
)

export default AulaCard