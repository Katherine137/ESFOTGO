import { useEffect, useState } from "react"
import storeProfile from "../../context/storeProfile"
import storeAuth from "../../context/storeAuth"
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from "react-toastify"
import { MdCameraAlt } from "react-icons/md"

const campoImagenPorRol = {
    admin: "subirImagenAdmin",
    docente: "subirImagenDocente",
    user: "subirImagenEstudiante",
}

const FormularioPerfil = () => {
    const { user, updateProfile } = storeProfile()
    const { rol } = storeAuth()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [previewImagen, setPreviewImagen] = useState(null)

    const updateUser = async (dataForm) => {
        try {
            const formData = new FormData()
            formData.append("nombre", dataForm.nombre)
            formData.append("apellido", dataForm.apellido)
            formData.append("telefono", dataForm.telefono)

            const campoImagen = campoImagenPorRol[rol] || "subirImagenEstudiante"
            if (dataForm.imagen?.[0]) {
                formData.append(campoImagen, dataForm.imagen[0])
            }

            const resultado = await updateProfile(formData)
            if (resultado) {
                toast.success("¡Perfil actualizado con éxito!")
            }
        } catch (error) {
            const mensajeError = error.response?.data?.msg || "Error al conectar con el servidor (404)";
            toast.error(mensajeError);
        }
    }

    const onError = () => {
        toast.error("Por favor, revisa los campos obligatorios")
    }

    const handleImagenChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setPreviewImagen(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        if (user) {
            reset({
                nombre: user?.nombre || "",
                apellido: user?.apellido || "",
                telefono: user?.telefono || user?.telfono || "",
            })
            setPreviewImagen(user?.imagen || null)
        }
    }, [user, reset])

    return (
        <form onSubmit={handleSubmit(updateUser, onError)} className="space-y-4">
            <ToastContainer />

            <div className="flex justify-center">
                <label htmlFor="imagenPerfil" className="relative cursor-pointer group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-50 flex items-center justify-center">
                        {previewImagen ? (
                            <img src={previewImagen} alt="Foto de perfil" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl text-slate-300">👤</span>
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-blue-950 text-white rounded-full p-1.5 group-hover:bg-blue-900 transition-colors shadow-md">
                        <MdCameraAlt className="text-sm" />
                    </div>
                    <input
                        id="imagenPerfil"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        {...register("imagen", { onChange: handleImagenChange })}
                    />
                </label>
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Nombre</label>
                <input 
                    type="text" 
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-neutral-950 outline-none focus:border-blue-950 focus:bg-white transition-all"
                    {...register("nombre", { 
                        required: "El nombre es obligatorio",
                        pattern: {
                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                            message: "Solo se permiten letras"
                        },
                        validate: (value) => value.trim() !== "" || "El nombre no puede estar vacío"
                    })}
                />
                {errors.nombre && <p className="text-red-600 text-xs mt-1 font-medium">{errors.nombre.message}</p>}
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Apellido</label>
                <input 
                    type="text" 
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-neutral-950 outline-none focus:border-blue-950 focus:bg-white transition-all"
                    {...register("apellido", { 
                        required: "El apellido es obligatorio",
                        pattern: {
                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                            message: "Solo se permiten letras"
                        },
                        validate: (value) => value.trim() !== "" || "El apellido no puede estar vacío"
                    })}
                />
                {errors.apellido && <p className="text-red-600 text-xs mt-1 font-medium">{errors.apellido.message}</p>}
            </div>

            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Teléfono</label>
                <input 
                    type="text" 
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-neutral-950 outline-none focus:border-blue-950 focus:bg-white transition-all"
                    {...register("telefono", { 
                        required: "El teléfono es obligatorio",
                        pattern: {
                            value: /^[0-9]{10}$/,
                            message: "El teléfono debe tener exactamente 10 números"
                        }
                    })}
                />
                {errors.telefono && <p className="text-red-600 text-xs mt-1 font-medium">{errors.telefono.message}</p>}
            </div>

            <div className="pt-2">
                <button 
                    type="submit"
                    className="w-full py-3 bg-blue-950 text-white font-semibold rounded-xl hover:bg-blue-900 transition-colors shadow-md active:scale-[0.98] duration-200"
                >
                    Actualizar Perfil
                </button>
            </div>
        </form>
    )
}

export default FormularioPerfil