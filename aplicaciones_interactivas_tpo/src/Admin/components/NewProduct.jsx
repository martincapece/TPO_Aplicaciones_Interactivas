import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import ProductForm from './ProductForm';
import ConfirmationDialog from './ConfirmationDialog';

export default function NewProduct() {
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState([null, null, null, null]); // [principal, extra1, extra2, extra3]
    const [sizes, setSizes] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updated = [...images];
                updated[0] = reader.result; // imagen principal
                setImages(updated);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleExtraImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updated = [...images];
                updated[index + 1] = reader.result; // extras desde índice 1
                setImages(updated);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => {
        const updated = [...images];
        updated[0] = null;
        setImages(updated);
    };

    const handleAddProduct = () => {
        const [mainImage, ...extraImages] = images;
        console.log({
            model,
            brand,
            price,
            stock,
            image: mainImage,
            sizes,
            extraImages: extraImages.filter(img => img !== null),
        });
        navigate(`/producto/${model}`);
    };

    return (
        <Box sx={{ maxWidth: '1300px', margin: '40px auto', px: 2 }}>
            <Typography variant="h3" sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '30px', mb: 5 }} textAlign="center">
                Crear Nuevo Producto
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                <ImageUpload
                    images={images}
                    handleImageUpload={handleImageUpload}
                    handleImageRemove={handleImageRemove}
                    handleExtraImageUpload={handleExtraImageUpload}
                    setImages={setImages}
                />
                <ProductForm
                    model={model}
                    brand={brand}
                    price={price}
                    stock={stock}
                    sizes={sizes}
                    setModel={setModel}
                    setBrand={setBrand}
                    setPrice={setPrice}
                    setStock={setStock}
                    setSizes={setSizes}
                    onSubmit={() => setDialogOpen(true)}
                />
            </Box>

            <ConfirmationDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={() => {
                    handleAddProduct();
                    setDialogOpen(false);
                }}
                model={model}
            />
        </Box>
    );
}
