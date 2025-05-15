import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import ProductForm from '../components/ProductForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import useImageUpload from '../hooks/useImageUpload';
import useProductForm from '../hooks/useProductForm';

export default function NewProduct() {
    const [dialogOpen, setDialogOpen] = useState(false);

    const {
        mainImage,
        extraImages,
        handleImageUpload,
        handleExtraImageUpload,
        handleImageRemove,
        handleExtraImageRemove,
        setMainImage,
        setExtraImages
    } = useImageUpload();

    const {
        model, brand, price, stock, sizes,
        setModel, setBrand, setPrice, setStock, setSizes,
        isEditable,
        handleAddProduct,
        handleUpdateProduct
    } = useProductForm(setMainImage, setExtraImages);

    return (
        <Box sx={{ maxWidth: '1300px', margin: '40px auto', px: 2 }}>
            <Typography variant="h3" sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '30px', mb: 4 }} textAlign="center">
                {isEditable ? `Editando: ${model}` : "Crear Nuevo Producto"}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                <ImageUpload
                    mainImage={mainImage}
                    extraImages={extraImages}
                    handleImageUpload={handleImageUpload}
                    handleImageRemove={handleImageRemove}
                    handleExtraImageUpload={handleExtraImageUpload}
                    handleExtraImageRemove={handleExtraImageRemove}
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
                    buttonLabel={isEditable ? "Editar Producto" : "Crear Producto"}
                />
            </Box>

            <ConfirmationDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={() => {
                    setDialogOpen(false);
                    isEditable
                        ? handleUpdateProduct(mainImage, extraImages)
                        : handleAddProduct(mainImage, extraImages);
                }}
                title={isEditable ? "Confirmar actualización" : "Confirmar creación"}
                message={`¿Estás seguro de que deseas ${isEditable ? 'actualizar' : 'crear'} el producto "${model}"?`}
            />
        </Box>
    );
}
