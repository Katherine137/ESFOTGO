import { Link } from "react-router";
import { ToastContainer } from "react-toastify";
import { useFetch } from "../hooks/useFetch";
import { useForm } from "react-hook-form";

export const Forgot = () => {
    const { register, handleSubmit, formState: { errors }} = useForm()
    const fetchDataBackend = useFetch()

    const sendMail = async (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword`
        await fetchDataBackend(url, dataForm, "POST")
    }
    return (
        <div className="flex flex-col sm:flex-row h-screen">

            <ToastContainer/>

            <div className="bg-linear-to-b from-blue-950 to-rose-950 w-full sm:w-1/2 flex justify-center items-center bg-white p-4">
            
                <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
                    <h1 className="text-3xl font-semibold text-center text-slate-500">¡Olvidaste la contraseña!</h1>
                    <br />

                    <form onSubmit={handleSubmit(sendMail)}>
                        <div className="mb-3">
                            <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
                            <input
                                type="email"
                                placeholder="Ingresa tu correo"
                                className="w-full rounded-md border border-blue-500 focus:ring-1 px-2 py-1 text-neutral-950"
                                {...register("email", { required: "El correo electrónico es obligatorio" })}
                            />
                            {errors.email && <p className="text-red-900">{errors.email.message}</p>}
                        </div>

                        <div className="mb-3">
                        <button className="block w-full py-2 text-center bg-red-900 text-white rounded-xl hover:bg-gray-900 duration-300">
                        Enviar correo</button>
                        </div>
                        
                    </form>

                    <div className="mt-3 flex justify-between text-sm">
                        <p className="text-neutral-950 font-medium">¿Ya tiene una cuenta?</p>
                        <Link to="/Login" className="block w-24 py-2 text-center bg-red-900 text-white rounded-xl hover:bg-gray-900 duration-300"> Iniciar sesión </Link>
                    </div>

                </div>
            </div>

            <div className="hidden sm:block sm:w-1/2 bg-[url('/buho.png')] bg-cover bg-center"></div>
        </div>
    )
}
