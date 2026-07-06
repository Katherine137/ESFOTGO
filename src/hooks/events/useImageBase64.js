import { useState } from 'react'

export const useImagenBase64 = (initialPreview = null) => {
    const [imagenPreview, setImagenPreview] = useState(initialPreview)
    const [imagenBase64, setImagenBase64] = useState(null)

    const handleImagenChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagenPreview(reader.result)
            setImagenBase64(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const resetImagen = (preview = null) => {
        setImagenPreview(preview)
        setImagenBase64(null)
    }

    return { imagenPreview, imagenBase64, handleImagenChange, resetImagen, setImagenPreview }
}
