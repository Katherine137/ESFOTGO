import { useState, useEffect } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { useFetch } from "../hooks/useFetch";
import Dragon from "../assets/dragon.png";

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const fetchDataBackend = useFetch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const rolValue = watch("rol"); 
  const emailValue = watch("email");

  useEffect(() => {
    const buscarPerfil = async () =>{
      if (emailValue && /^[a-z._%+-]+@epn\.edu\.ec$/.test(emailValue)) {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        let endpoint = "";
        if (rolValue == "docente") {
          endpoint = `${baseUrl}/buscarDocente?email=${emailValue}`;
        } else if (rolValue === "user") {
          endpoint = `${baseUrl}/buscarEstudiante?email=${emailValue}`;
        }
        console.log("Intentando conectar a:", endpoint);
        if (endpoint) {
          try {
            const userData = await fetchDataBackend(endpoint, null, "GET");
            if (userData) {
              setValue("nombre", userData.nombre);
              setValue("apellido", userData.apellido);
            }
          } catch (error) {
            console.error("Error al buscar el perfil:", error);
          }
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      buscarPerfil();
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [emailValue, rolValue, setValue, fetchDataBackend]);

  const registerUser = async (dataForm) => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    let url = "";

    if (dataForm.rol === "admin") url = `${baseUrl}/admin/registro`;
    if (dataForm.rol === "docente") url = `${baseUrl}/docente/registro`;
    if (dataForm.rol === "user") url = `${baseUrl}/estudiantes/registro`;

    const response = await fetchDataBackend(url, dataForm, "POST");

    if (response) {
      navigate("/Login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-blue-950 to-rose-950">

      <ToastContainer />

      {/* 🔥 LADO IZQUIERDO (DRAGÓN) */}
      <div className="hidden md:flex flex-1 items-center justify-center overflow-visible">
        <img
          src={Dragon}
          alt="dragon"
          className="shrink-0 object-contain  flame-animation w-[320px] md:w-[450px] lg:w-[600px] xl:w-[700px]"
        />
      </div>

      {/* 🔥 LADO DERECHO (FORMULARIO) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6">

        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">

          <h1 className="text-2xl sm:text-3xl font-semibold text-center text-slate-600">
            Crear Cuenta
          </h1>

          <p className="text-blue-400 text-center my-3 text-sm sm:text-base">
            Ingresa tus datos para registrarte
          </p>

          <form onSubmit={handleSubmit(registerUser)} className="space-y-3">

            {/* ROL */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Tipo de Usuario
              </label>

              <select
                {...register("rol", { required: "El rol es obligatorio" })}
                className="w-full border border-blue-500 rounded-md px-2 py-2 text-black"
              >
                <option value="user">Estudiante</option>
                <option value="docente">Docente</option>
              </select>

              {errors.rol && (
                <p className="text-red-600 text-xs mt-1">{errors.rol.message}</p>
              )}
            </div>

            {/* CORREO */}
            <div>
                <label className="block text-sm font-semibold mb-1">
                    Correo electrónico
                </label>

                <input
                    type="email"
                    placeholder="Ingresa tu correo"
                    className="w-full border border-blue-500 rounded-md px-2 py-2 text-black"
                    {...register("email", {
                        required: "El correo es obligatorio",
                        pattern: {
                            value: /^[a-z._%+-]+@epn\.edu\.ec$/,
                            message: "Debe ser un correo institucional @epn.edu.ec solo minusculas "
                        }
                    })}
                />

                {errors.email && (
                    <p className="text-red-600 text-xs mt-1">
                    {errors.email.message}
                    </p>
                )}
            </div>

            {/* NOMBRE */}
            <div>
                <label className="block text-sm font-semibold mb-1">
                    Nombre
                </label>

                <input
                    type="text"
                    placeholder="Ingresa tu nombre"
                    className="w-full border border-blue-500 rounded-md px-2 py-2 text-black"
                    {...register("nombre", {
                        required: "El nombre es obligatorio",
                        pattern: {
                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                            message: "Solo se permiten letras"
                        },
                        validate: (value) =>
                          value.trim() !== "" || "El nombre no puede estar vacío"
                    })}
                />
                {errors.nombre && (
                    <p className="text-red-600 text-xs mt-1">
                    {errors.nombre.message}
                    </p>
                )}
            </div>

            {/* APELLIDO */}
            <div>
                <label className="block text-sm font-semibold mb-1">
                    Apellido
                </label>

                <input
                    type="text"
                    placeholder="Ingresa tu apellido"
                    className="w-full border border-blue-500 rounded-md px-2 py-2 text-black"
                    {...register("apellido", {
                        required: "El apellido es obligatorio",
                        pattern: {
                            value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                            message: "Solo se permiten letras"
                        },
                        validate: (value) =>
                            value.trim() !== "" || "El apellido no puede estar vacío"
                    })}
                />
                {errors.apellido && (
                    <p className="text-red-600 text-xs mt-1">
                    {errors.apellido.message}
                    </p>
                )}
            </div>

            {/* TELÉFONO */}
            <div>
                <label className="block text-sm font-semibold mb-1">
                    Teléfono
                </label>

                <input
                    type="text"
                    placeholder="Ingresa tu teléfono"
                    className="w-full border border-blue-500 rounded-md px-2 py-2 text-black"
                    {...register("telefono", {
                        required: "El teléfono es obligatorio",
                        pattern:{
                            value: /^[0-9]{10}$/,
                            message: "Solo se permiten números"
                        }
                    })}
                />
                {errors.telefono && (
                    <p className="text-red-600 text-xs mt-1">
                    {errors.telefono.message}
                    </p>
                )}
            </div>
            
    

            {/* PASSWORD */}
            <div>
                <label className="block text-sm font-semibold mb-1">
                    Contraseña
                </label>

                <div className="relative">
                    <input
                        placeholder="Ingresa tu contraseña"
                        type={showPassword ? "text" : "password"}
                        className="w-full border border-blue-500 rounded-md px-2 py-2 pr-10 text-black"
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            pattern: {
                              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{12,}$/,
                              message: "Contraseña debil debe tener al menos 12 caracteres, incluidas mayusculas, minusculas y caracteres"
                            }
                        })}
                    />
                    {errors.password && (
                        <p className="text-red-600 text-xs mt-1">
                        {errors.password.message}
                        </p>
                    )}
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-600"
                    >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>
                </div>
            </div>

            {/* BOTÓN */}
            <button
              type="submit"
              className="w-full bg-red-900 text-white py-2 rounded-xl hover:bg-gray-900 transition"
            >
              Registrarse
            </button>
          </form>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
            <p>¿Ya tienes cuenta?</p>

            <Link
              to="/Login"
              className="w-full sm:w-auto text-center bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-900 transition"
            >
              Iniciar sesión
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};