import  { useForm } from "react-hook-form"
import storeProfile from "../../context/storeProfile"
import storeAuth from "../../context/storeAuth"

const CardPassword = () => {

    const {register, handleSubmit, formState: { errors } } = useForm()
    const {user,updatePasswordProfile} = storeProfile()
    const { clearToken } = storeAuth()

    const updatePassword = async (dataForm) =>{
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarpassword/${user._id}`
        const response = await updatePasswordProfile(url,dataForm)
        if (response) {
            clearToken()
        }
    }
    return (
        <>
            <div className='mt-5'>
                <h1 className='font-black text-2xl text-blue-950 mt-16'>Actualizar contraseña</h1>
                <br />
            </div>

            <form onSubmit={handleSubmit(updatePassword)}> 

                <div className="mb-3">
                    <label className="mb-1 block text-sm font-semibold">Contraseña actual</label>
                        <input type="password" placeholder="Ingresa tu contraseña actual" className="block w-full 
                        rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                        {...register("passwordactual", { required: "La contraseña actual es obligatoria" })}
                        />
                        {errors.passwordactual && <p className="text-red-800">{errors.passwordactual.message}</p>}
                </div>

                <div className="mb-3">
                    <label className="mb-1 block text-sm font-semibold">Nueva contraseña</label>
                        <input type="password" placeholder="Ingresa tu nueva contraseña" className="block w-full 
                        rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                        {...register("passwordnuevo", { required: "La contraseña nueva es obligatoria" })}
                        />
                        {errors.passwordnuevo && <p className="text-red-800">{errors.passwordnuevo.message}</p>}
                </div>

                <div className="mb-3">
                    <input type="submit"
                    className="block w-full py-2 text-center bg-red-900 text-white rounded-xl hover:bg-gray-900 duration-300"
                    value='Actualizar Contraseña'
                    />
                </div>

            </form>
           
        </>
    )
}

export default CardPassword