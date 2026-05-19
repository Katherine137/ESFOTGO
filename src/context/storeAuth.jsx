import { create } from "zustand";
import { persist } from "zustand/middleware"

const storeAuth = create(
    persist(
        (set) => ({
            token: null,
            rol: null,
            userId: null,
            setToken: (token) => set({ token }),
            setRol: (rol) => set({ rol }),
            setUserId: (userId) => set({ userId }),
            setAuth: (token, rol, userId) => set({ token, rol, userId }),
            clearToken: () => set({ token: null, rol: null, userId: null }),
            logout: () => set({ token: null, rol: null, userId: null }) 
        }),
        { name: "auth-token" }
    )
)

export default storeAuth