import { Link } from "react-router"
import { ToastContainer } from "react-toastify"
import Fondo from "../assets/fondo.png"
import useForgot from "../hooks/auth/useForgot"

export const Forgot = () => {
    const { register, handleSubmit, errors, loading } = useForgot()

    return (
        <div
            className="min-h-screen relative flex items-center justify-center bg-slate-950 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${Fondo})` }}
        >
            <div className="absolute inset-0 bg-black/50 z-0"></div>

            <ToastContainer />

            <div className="relative z-10 w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center text-slate-500">
                    ¡Olvidaste la contraseña!
                </h1>
                <br />

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-sm font-semibold mb-1">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            placeholder="Ingresa tu correo"
                            className="w-full rounded-md border border-blue-500 px-2 py-2 text-black"
                            {...register("email", { required: "El correo es obligatorio" })}
                        />
                        {errors.email && (
                            <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="mb-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`block w-full py-2 text-center text-white rounded-xl duration-300 ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-900 hover:bg-gray-900'
                            }`}
                        >
                            {loading ? 'Enviando...' : 'Enviar correo'}
                        </button>
                    </div>
                </form>

                <div className="mt-3 flex justify-between items-center text-sm">
                    <p className="text-gray-600 font-medium">¿Ya tienes cuenta?</p>
                    <Link
                        to="/Login"
                        className="px-4 py-2 text-center bg-gray-600 text-white rounded-xl hover:bg-gray-900 duration-300"
                    >
                        Iniciar sesión
                    </Link>
                </div>
            </div>
        </div>
    )
}