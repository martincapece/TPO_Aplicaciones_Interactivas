import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUpload from './ImageUpload';
import ProductForm from './ProductForm';
import ConfirmationDialog from './ConfirmationDialog';
import { dataDestacados } from '../../ecomerce/data/dataDestacados';

export default function NewProduct() {
    const { id } = useParams(); // obtiene el id de la URL
    const isEditable = Boolean(id); // true si estamos editando

    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [extraImages, setExtraImages] = useState([null, null, null]); // máximo 3 extras
    const [sizes, setSizes] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isEditable) {
            const productToEdit = dataDestacados.find(p => p.id === Number(id));
            if (productToEdit) {
                setModel(productToEdit.model);
                setBrand(productToEdit.brand);
                setPrice(productToEdit.price);
                setStock(productToEdit.stock || '');
                setSizes(productToEdit.sizes);
                setMainImage(productToEdit.image[0]);
                setExtraImages(productToEdit.image.slice(1, 4)); // máximo 3 extras
            }
        }
    }, [id]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImage(reader.result);
            };
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

    const handleImageRemove = () => {
        setMainImage(null);
    };


    //creacion del nuevo producto
    //TODO: Agregarlo al json.
    const handleAddProduct = () => {
        const imageArray = [mainImage, ...extraImages.filter(img => img !== null)];
        const idValue = dataDestacados.length;
        console.log({
            id: idValue + 1,
            model,
            brand,
            price,
            stock,
            sizes,
            image: imageArray,
            featured: true,
            new: true
        });
        navigate(`/producto/${model}`);
    };

    const handleUpdateProduct = () => {
        console.log("Actualizar producto con ID:", id);
    };

    return (
        <Box sx={{ maxWidth: '1300px', margin: '40px auto', px: 2 }}>
            <Typography variant="h3" sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '30px', mb: 5 }} textAlign="center">
                {isEditable ? "Editar Producto" : "Crear Nuevo Producto"}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                <ImageUpload
                    mainImage={mainImage}
                    extraImages={extraImages}
                    handleImageUpload={handleImageUpload}
                    handleImageRemove={handleImageRemove}
                    handleExtraImageUpload={handleExtraImageUpload}
                    setExtraImages={setExtraImages}
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
                    isEditable ? handleUpdateProduct() : handleAddProduct();
                    setDialogOpen(false);
                }}
                model={model}
            />
        </Box>
    );
}
