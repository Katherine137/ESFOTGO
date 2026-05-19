import { useEffect } from "react"
import storeProfile from "../../context/storeProfile"
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from "react-toastify"

const FormularioPerfil = () => {
    const { user, updateProfile } = storeProfile()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const updateUser = async (dataForm) => {
        console.log("1. Intentando actualizar con datos:", dataForm)
        try {
            const resultado = await updateProfile(dataForm);
            console.log("2. Resultado del store:", resultado)
            if (resultado) {
                toast.success("¡Perfil actualizado con éxito!")
            }
        } catch (error) {
            console.error("3. Error en componente:", error)
            const mensajeError = error.response?.data?.msg || "Error al conectar con el servidor (404)";
        toast.error(mensajeError);
        }
    }
    const onError = (errors) => {
        console.log("Errores de validación:", errors)
        toast.error("Por favor, revisa los campos obligatorios")
    }

    useEffect(() => {
        if (user) {
            reset({
                nombre: user?.nombre || "",
                apellido: user?.apellido || "",
                telefono: user?.telfono || user?.telefono || "",
            })
        }
    }, [user, reset])

    return (
        <form onSubmit={handleSubmit(updateUser, onError)}>
            <ToastContainer />
            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Nombre</label>
                <input 
                    type="text" 
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register("nombre", { required: "El nombre es obligatorio",
                        pattern: {
                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                            message: "Solo se permiten letras"
                        },
                        validate: (value) =>
                          value.trim() !== "" || "El nombre no puede estar vacío"
                     })}
                />
                {errors.nombre && <p className="text-red-600 text-xs mt-1">{errors.nombre.message}</p>}
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Apellido</label>
                <input 
                    type="text" 
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register("apellido", { required: "El apellido es obligatorio",
                        pattern: {
                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                            message: "Solo se permiten letras"
                        },
                        validate: (value) =>
                            value.trim() !== "" || "El apellido no puede estar vacío"
                    })}
                />
                {errors.apellido && <p className="text-red-600 text-xs mt-1">{errors.apellido.message}</p>}
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Teléfono</label>
                <input 
                    type="text" 
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register("telefono", { required: "El teléfono es obligatorio",
                        pattern:{
                            value: /^[0-9]{10}$/,
                            message: "Solo se permiten números"
                        }
                     })}
                />
                {errors.telefono && <p className="text-red-600 text-xs mt-1">{errors.telefono.message}</p>}
            </div>

            <div className="mb-3">
                <button 
                    type="submit"
                    className="w-full py-2 bg-red-900 text-white rounded-xl hover:bg-gray-900 transition-colors shadow-md active:scale-95"
                >
                    Actualizar Perfil
                </button>
            </div>
        </form>
    )
}

export default FormularioPerfil