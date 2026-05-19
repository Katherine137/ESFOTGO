const CardUpdate = () => {


    return (

        <form >
            <h2 className="text-blue-900">Actualizar aula</h2>
            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Edificio</label>
                    <input type="text" placeholder="Ingresa el número del edificio" className="block w-full rounded-md border
                    border-blue-500  py-1 px-1.5 text-neutral-950"
                    />
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Piso</label>
                    <input type="text" placeholder="Ingresa el número de piso" className="block w-full rounded-md border
                    border-blue-500 py-1 px-1.5 text-neutral-950"
                    />
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Numero</label>
                    <input type="text" placeholder="Ingresa el número del aula" className="block w-full rounded-md border
                    border-blue-500  py-1 px-1.5 text-neutral-950"
                    />
            </div>


            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Tipo</label>
                    <select 
                        id="Tipo" 
                        name="Tipo" 
                        className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    >
                        <option value="">Seleccione un tipo</option>
                        <option value="aula">Aula</option>
                        <option value="laboratorio">Laboratorio</option>
                    </select>
            </div>
            
            <div className="mb-3">
                <input type="submit"
                className="block w-full py-2 text-center bg-red-900 text-white rounded-xl hover:bg-gray-900 duration-300"
                value='Actualizar Aula'
                />
            </div>

        </form>
    )
}

export default CardUpdate