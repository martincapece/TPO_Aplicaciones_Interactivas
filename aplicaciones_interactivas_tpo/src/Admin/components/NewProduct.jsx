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
        const newId = dataDestacados.length > 0 ? Math.max(...dataDestacados.map(p => p.id)) + 1 : 1;
    
        const newProduct = {
            id: newId,
            model,
            brand,
            price,
            stock,
            sizes,
            image: imageArray,
            featured: true,
            new: true
        };
    
        dataDestacados.push(newProduct); // Esto solo vive en memoria
        console.log("Producto agregado al array:", newProduct);
    
        navigate(`/producto/${id}`);
    };
    

    const handleUpdateProduct = () => {
        const updatedProduct = {
            id: Number(id),
            model,
            brand,
            price,
            stock,
            sizes,
            image: [mainImage, ...extraImages.filter(img => img !== null)],
        };
    
        const index = dataDestacados.findIndex(p => p.id === Number(id));
        if (index !== -1) {
            dataDestacados[index] = updatedProduct;
            console.log("Producto actualizado:", updatedProduct);
            navigate(`/producto/${id}`);
        } else {
            console.warn("Producto no encontrado para editar.");
        }
    };
    

    return (
        <Box sx={{ maxWidth: '1300px', margin: '40px auto', px: 2 }}>
            <Typography
                variant="h3"
                sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '30px', mb: 5 }}
                textAlign="center"
            >
                {isEditable ? `Editando: ${model}` : "Crear Nuevo Producto"}
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
                    buttonLabel={isEditable ? "Guardar Cambios" : "Agregar Producto"}
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
                confirmText={isEditable ? "Sí, actualizar" : "Sí, crear"}
            />
        </Box>
    );    
}
