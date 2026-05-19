import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { io } from 'socket.io-client'
import { toast, ToastContainer } from "react-toastify"

const Chat = () => {
    const [messages, setMessages] = useState([])
    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const [username, setUsername] = useState("")
    const [usersOnline, setUsersOnline] = useState(0)
    const [isOpen, setIsOpen] = useState(false) // Controla si el chat está abierto o cerrado
    
    const messagesEndRef = useRef(null)
    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (isOpen) scrollToBottom()
    }, [messages, isOpen])

    // Configuración de Socket.io
    useEffect(() => {
        const newSocket = io("http://localhost:3000")
        setSocket(newSocket)

        newSocket.on("connect", () => {
            toast.success("Conectado al servidor")
        })

        newSocket.on("disconnect", () => {
            toast.error("Desconectado del servidor")
        })

        newSocket.on("mensaje-recibido", (payload) => {
            setMessages((prev) => [...prev, { ...payload, isOwn: false }])
        })

        newSocket.on("usuarios-online", (count) => {
            setUsersOnline(count)
        })

        newSocket.on("usuario-conectado", (data) => {
            toast.info(`${data.username} se unió al chat`)
        })

        newSocket.on("usuario-desconectado", (data) => {
            toast.warning(`${data.username} abandonó el chat`)
        })

        return () => newSocket.disconnect()
    }, [])

    const handleJoinChat = (data) => {
        if (!socket || !socket.connected) {
            toast.error("No hay conexión con el servidor")
            return
        }
        setUsername(data.username)
        setIsConnected(true)
        socket.emit("usuario-conectado", { username: data.username })
        toast.success(`¡Bienvenido ${data.username}!`)
    }

    const handleSendMessage = (data) => {
        if (!socket || !socket.connected) {
            toast.error("No hay conexión con el servidor")
            return
        }
        if (!data.message.trim()) return

        const newMessage = {
            text: data.message,
            from: username,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: true
        }

        socket.emit("enviar-mensaje", { 
            text: data.message, 
            from: username,
            timestamp: newMessage.timestamp
        })
        
        setMessages((prev) => [...prev, newMessage])
        reset({ message: "" })
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            <ToastContainer position="top-right" autoClose={2000} containerId="chat-toast" />

            {/* Ventana del Chat (Solo se muestra si isOpen es true) */}
            {isOpen && (
                <div className="bg-white w-[360px] sm:w-[400px] h-[550px] rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden border border-gray-100 animate-fade-in">
                    
                    {/* Header optimizado para ventana flotante */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                                {isConnected ? username.charAt(0).toUpperCase() : "G"}
                            </div>
                            <div className="text-white">
                                <h2 className="font-bold text-lg leading-tight">ESFOTgo Chat</h2>
                                <p className="text-xs text-indigo-200 flex items-center gap-1.5 mt-0.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    {usersOnline} en línea
                                </p>
                            </div>
                        </div>
                        {/* Botón para cerrar la ventana */}
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white hover:bg-opacity-10 p-1.5 rounded-full transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Contenido: Login o Mensajes */}
                    {!isConnected ? (
                        /* PANTALLA DE LOGIN */
                        <div className="flex-1 p-6 flex flex-col justify-center bg-gray-50">
                            <div className="text-center mb-6">
                                <p className="text-gray-600 font-medium">Conéctate con la comunidad ESFOT</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">¿Cuál es tu nombre?</label>
                                    <input
                                        type="text"
                                        placeholder="Ingresa tu username"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 text-sm transition-all"
                                        {...register("username", { 
                                            required: "El nombre es obligatorio",
                                            minLength: { value: 3, message: "Mínimo 3 caracteres" },
                                            maxLength: { value: 20, message: "Máximo 20 caracteres" }
                                        })}
                                    />
                                    {errors.username && (
                                        <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.username.message}</p>
                                    )}
                                </div>
                                <button
                                    onClick={handleSubmit(handleJoinChat)}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-bold text-sm hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md active:scale-[0.98]"
                                >
                                    Entrar al Chat
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* PANTALLA PRINCIPAL DEL CHAT */
                        <>
                            {/* Área de mensajes reducida */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-400 mt-16">
                                        <svg className="w-12 h-12 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <p className="text-sm font-semibold">No hay mensajes aún</p>
                                        <p className="text-xs mt-1">¡Sé el primero en escribir!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div key={index} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                                            <div className="max-w-[80%]">
                                                {!msg.isOwn && (
                                                    <span className="text-[11px] font-bold text-gray-500 ml-1 block mb-0.5">{msg.from}</span>
                                                )}
                                                <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                                                    msg.isOwn
                                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                                }`}>
                                                    <p className="break-words leading-relaxed">{msg.text}</p>
                                                    <span className={`text-[10px] block text-right mt-1 ${msg.isOwn ? 'text-indigo-200' : 'text-gray-400'}`}>
                                                        {msg.timestamp}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input de mensaje */}
                            <div className="bg-white border-t border-gray-100 p-3">
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        placeholder="Escribe un mensaje..."
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm target-input"
                                        {...register("message", { 
                                            required: true,
                                            maxLength: 500 
                                        })}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleSubmit(handleSendMessage)()
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleSubmit(handleSendMessage)}
                                        className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center shrink-0"
                                    >
                                        <svg className="w-5 h-5 transform rotate-45 -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* BOTÓN FLOTANTE PRINCIPAL */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-200 relative group"
            >
                {/* Contador de usuarios en línea discreto sobre el botón si el chat está cerrado */}
                {!isOpen && usersOnline > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow">
                        {usersOnline}
                    </span>
                )}
                
                {isOpen ? (
                    /* Icono de cerrar (X) si está abierto */
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                ) : (
                    /* Icono de chat si está cerrado */
                    <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}
            </button>
        </div>
    )
}

export default Chat