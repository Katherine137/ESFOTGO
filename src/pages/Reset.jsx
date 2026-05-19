import { useEffect, useState } from 'react'
import { useFetch } from '../hooks/useFetch';
import { useNavigate, useParams } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { useForm } from 'react-hook-form';


const Reset = () => {

    const navigate = useNavigate()
    const { token } = useParams()
    const fetchDataBackend = useFetch()
    const [tokenback, setTokenBack] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm()

    const changePassword = async(dataForm) =>{
        const url = `${import.meta.env.VITE_BACKEND_URL}/nuevopassword/${token}`
        await fetchDataBackend(url, dataForm, 'POST')
        setTimeout(() => {
            if (dataForm.password === dataForm.confirmpassword) {
                navigate('/Login')
            }
        }, 2000)
    }

    useEffect(() =>{
        const verifyToken = async()=>{
            const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword/${token}`
            await fetchDataBackend(url, 'GET')
            setTokenBack(true)
        } 
        verifyToken()
    }, [token, fetchDataBackend, navigate])
    
    return (
        <div className="bg-linear-to-b from-blue-950 to-rose-950 flex flex-col items-center justify-center h-screen">

            <ToastContainer/>
            
            <h1 className="text-3xl font-semibold mb-1 text-center text-gray-500">
                Bienvenido nuevamente
            </h1>
            <small className="text-gray-400 block my-2 text-sm">
                Por favor, ingrese los siguientes datos
            </small>
            <div className="object-cover h-55 w-55 border-4 rounded-full border-solid border-black bg-[url('/Dragon_Esfot.png')] bg-cover bg-center"></div>
            <br />

            {tokenback && (

                <div className="w-full h-[275px] max-w-sm p-8 bg-red-50 rounded-lg shadow-lg">

                <form className="w-80" onSubmit={handleSubmit(changePassword)}>

                    <div className="mb-1">

                        <label className="mb-2 block text-sm font-semibold">Nueva contraseña</label>
                        <input type="password" placeholder="Ingresa tu nueva contraseña"
                            className="block w-full rounded-md border border-blue-500  py-1 px-1.5 text-neutral-950"
                            {...register("password", { required: "la contraseña es obligatoria"})}
                        />
                            {errors.password && <p className='text-red-900'>{errors.password.message}</p>}

                        <br />
                        
                        <label className="mb-2 block text-sm font-semibold">Confirmar contraseña</label>
                        <input type="password" placeholder="Ingresa de nuevo tu contraseña"
                            className="block w-full rounded-md border border-blue-500  py-1 px-1.5 text-neutral-950"
                            {...register("confirmpassword", { required: "La contraseña es obligatoria"})}
                        />
                            {errors.confirmpassword && <p className='text-red-900'>{errors.confirmpassword.message}</p>}

                    </div>

                    <br />

                    <div className="mb-3">
                        <button className="block w-full py-2 text-center bg-red-900 text-white rounded-xl hover:bg-gray-900 duration-300">
                        Enviar</button>
                    </div>
                    
                </form>
            </div>
            )}
        </div>
    )
}

export default Reset
