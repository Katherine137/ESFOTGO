
const CardUpdate = () => {


    return (

        <form >
            <h2 className="text-blue-900">Actualizar evento</h2>
            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Nombre</label>
                    <input type="text" placeholder="Ingresa el nombre del evento" className="block w-full rounded-md border
                    border-blue-500  py-1 px-1.5 text-neutral-950"
                    />
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Organizador</label>
                    <input type="text" placeholder="Ingresa el nombre del Organizador" className="block w-full rounded-md border
                    border-blue-500 py-1 px-1.5 text-neutral-950"
                    />
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Ubicación</label>
                    <input type="text" placeholder="Ingresa la ubicación del evento" className="block w-full rounded-md border
                    border-blue-500  py-1 px-1.5 text-neutral-950"
                    />
            </div>


            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Fecha</label>
                    <input type="date" id="Fecha" name="Fecha" className="block w-full 
                    rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    />
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Hora</label>
                    <input type="time" id="Hora" name="Hora" className="block w-full 
                    rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    />
            </div>
            
            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Información</label>
                    <textarea placeholder="Ingresa la información del evento" className="block w-full 
                    rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"></textarea>
            </div>


            <div className="mb-3">
                <input type="submit"
                className="block w-full py-2 text-center bg-red-900 text-white rounded-xl hover:bg-gray-900 duration-300"
                value='Actualizar Evento'
                />
            </div>

        </form>
    )
}

export default CardUpdate