// hooks/useImageUpload.js
import { useState } from 'react';

export default function useImageUpload() {
    const [mainImage, setMainImage] = useState(null); // URL para preview
    const [mainImageFile, setMainImageFile] = useState(null); // File object original
    const [extraImages, setExtraImages] = useState([null, null, null]); // URLs para preview
    const [extraImageFiles, setExtraImageFiles] = useState([null, null, null]); // File objects originales

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Guardar el File object original
            setMainImageFile(file);
            
            // Crear URL para preview
            const reader = new FileReader();
            reader.onloadend = () => setMainImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleExtraImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            // Guardar el File object original
            const updatedFiles = [...extraImageFiles];
            updatedFiles[index] = file;
            setExtraImageFiles(updatedFiles);
            
            // Crear URL para preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const updated = [...extraImages];
                updated[index] = reader.result;
                setExtraImages(updated);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => {
        setMainImage(null);
        setMainImageFile(null);
    };

    const handleExtraImageRemove = (index) => {
        const updated = [...extraImages];
        updated[index] = null;
        setExtraImages(updated);
        
        const updatedFiles = [...extraImageFiles];
        updatedFiles[index] = null;
        setExtraImageFiles(updatedFiles);
    };

    return {
        mainImage,
        extraImages,
        mainImageFile, // ✅ NUEVO: File object de la imagen principal
        extraImageFiles, // ✅ NUEVO: File objects de las imágenes extras
        handleImageUpload,
        handleExtraImageUpload,
        handleImageRemove,
        handleExtraImageRemove,
        setMainImage,
        setExtraImages
    };
}
