import EventoCard from './EventoCard'

const EventoGrid = ({ eventos, titulo, emptyText = 'No hay eventos registrados aún' }) => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {titulo && (
            <h2 className="font-black text-xl sm:text-2xl text-blue-950 mb-6 sm:mb-8">
                {titulo}
            </h2>
        )}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-100">
            {eventos.length > 0 ? (
                eventos.map((evento) => (
                    <div key={evento._id} className="min-w-[85vw] sm:min-w-[300px] md:min-w-[350px] snap-start">
                        <EventoCard evento={evento} />
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center w-full py-8">{emptyText}</p>
            )}
        </div>
    </div>
)

export default EventoGrid