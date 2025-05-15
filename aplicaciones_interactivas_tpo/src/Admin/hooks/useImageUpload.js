// hooks/useImageUpload.js
import { useState } from 'react';

export default function useImageUpload() {
    const [mainImage, setMainImage] = useState(null);
    const [extraImages, setExtraImages] = useState([null, null, null]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setMainImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleExtraImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updated = [...extraImages];
                updated[index] = reader.result;
                setExtraImages(updated);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => setMainImage(null);

    const handleExtraImageRemove = (index) => {
        const updated = [...extraImages];
        updated[index] = null;
        setExtraImages(updated);
    };

    return {
        mainImage,
        extraImages,
        handleImageUpload,
        handleExtraImageUpload,
        handleImageRemove,
        handleExtraImageRemove,
        setMainImage,
        setExtraImages
    };
}
