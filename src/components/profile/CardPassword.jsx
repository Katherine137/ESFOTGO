import { useForm } from "react-hook-form"
import storeProfile from "../../context/storeProfile"
import storeAuth from "../../context/storeAuth"

const CardPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { user, updatePasswordProfile } = storeProfile()
    const { clearToken } = storeAuth()

    const updatePassword = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarpassword/${user._id}`
        const response = await updatePasswordProfile(url, dataForm)
        if (response) {
            clearToken()
        }
    }

    return (
        <form onSubmit={handleSubmit(updatePassword)} className="space-y-4"> 
            
            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Contraseña actual</label>
                <input 
                    type="password" 
                    placeholder="Ingresa tu contraseña actual" 
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-neutral-950 outline-none focus:border-blue-950 focus:bg-white transition-all"
                    {...register("passwordactual", { required: "La contraseña actual es obligatoria" })}
                />
                {errors.passwordactual && <p className="text-red-600 text-xs mt-1 font-medium">{errors.passwordactual.message}</p>}
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Nueva contraseña</label>
                <input 
                    type="password" 
                    placeholder="Ingresa tu nueva contraseña" 
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-neutral-950 outline-none focus:border-blue-950 focus:bg-white transition-all"
                    {...register("passwordnuevo", { required: "La contraseña nueva es obligatoria" })}
                />
                {errors.passwordnuevo && <p className="text-red-600 text-xs mt-1 font-medium">{errors.passwordnuevo.message}</p>}
            </div>

            <div className="pt-2">
                <input 
                    type="submit"
                    className="w-full py-3 text-center bg-blue-950 text-white font-semibold rounded-xl hover:bg-blue-900 cursor-pointer shadow-md active:scale-[0.98] transition-all duration-200"
                    value='Actualizar Contraseña'
                />
            </div>

        </form>
    )
}

export default CardPassword