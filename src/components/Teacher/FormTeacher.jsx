import { useEffect } from "react"
import storeProfile from "../../context/storeProfile"
import { useForm } from "react-hook-form"
import { ToastContainer } from "react-toastify"

const FormTeacher = ({ docenteSeleccionado = null }) => {
    // 1. Extraemos la función de actualización, pero NO usamos 'user' para el reset
    const { updateProfile } = storeProfile()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const updateUser = (dataForm) => {
        // Asegúrate de usar el ID correcto del docente a editar, no el del admin
        const idDocente = docenteSeleccionado?._id || dataForm.id;
        const url = `${import.meta.env.VITE_BACKEND_URL}/actualizardocente/${idDocente}`
        
        updateProfile(url, dataForm)
    }

    // 2. Solo reseteamos si explícitamente pasamos un docente para editar
    useEffect(() => {
        if (docenteSeleccionado) {
            reset({
                nombre: docenteSeleccionado.nombre,
                apellido: docenteSeleccionado.apellido,
                celular: docenteSeleccionado.celular,
                email: docenteSeleccionado.email,
                oficina: docenteSeleccionado.oficina
            })
        } else {
            // Si es un formulario de creación o no hay selección, se queda vacío
            reset({
                nombre: "",
                apellido: "",
                celular: "",
                email: "",
                oficina: ""
            })
        }
    }, [docenteSeleccionado, reset])

    return (
        <form onSubmit={handleSubmit(updateUser)}>
            <ToastContainer />
            
            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Nombre</label>
                <input 
                    type="text" 
                    placeholder="Ingresa el nombre" 
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                />
                {errors.nombre && <p className="text-red-800 text-xs mt-1">{errors.nombre.message}</p>}
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Apellido</label>
                <input 
                    type="text" 
                    placeholder="Ingresa el apellido" 
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register("apellido", { required: "El apellido es obligatorio" })}
                />
                {errors.apellido && <p className="text-red-800 text-xs mt-1">{errors.apellido.message}</p>}
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Celular</label>
                <input 
                    type="text" 
                    inputMode="tel" 
                    placeholder="Ingresa el teléfono" 
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register("celular", { required: "El celular es obligatorio" })}
                />
                {errors.celular && <p className="text-red-800 text-xs mt-1">{errors.celular.message}</p>}
            </div>

            <div className="mb-3">
                <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
                <input
                    type="email" 
                    placeholder="Ingresa el correo"
                    className="w-full rounded-md border border-blue-500 px-2 py-1 text-neutral-950"
                    {...register("email", { required: "El correo es obligatorio" })}
                />
                {errors.email && <p className="text-red-800 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="mb-3">
                <label className="mb-1 block text-sm font-semibold">Oficina</label>
                <input 
                    type="text" 
                    placeholder="Ubicación de tu oficina" 
                    className="block w-full rounded-md border border-blue-500 py-1 px-1.5 text-neutral-950"
                    {...register("oficina", { required: "La oficina es obligatoria" })}
                />
                {errors.oficina && <p className="text-red-800 text-xs mt-1">{errors.oficina.message}</p>}
            </div>

            <div className="mb-3">
                <button 
                    type="submit"
                    className="block w-full py-2 text-center bg-red-900 text-white rounded-xl hover:bg-gray-900 duration-300 font-semibold"
                >
                    Actualizar Docente
                </button>
            </div>
        </form>
    )
}

export default FormTeacher