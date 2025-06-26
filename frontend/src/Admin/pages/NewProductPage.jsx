import { Box, Typography, CircularProgress } from '@mui/material';
import { useContext, useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import ProductForm from '../components/ProductForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import useImageUpload from '../hooks/useImageUpload';
import useProductForm from '../hooks/useProductForm';
import { AuthContext } from '../../auth/context/AuthContext';

export default function NewProduct() {
    const [dialogOpen, setDialogOpen] = useState(false);
    
    // ✅ CORRECCIÓN: Verificación más robusta del contexto
    const authContext = useContext(AuthContext);
    
    // ✅ Verificar si el contexto está disponible
    if (!authContext) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Cargando contexto de autenticación...</Typography>
            </Box>
        );
    }

    const { authState } = authContext;
    const token = authState?.user?.token;

    // ✅ Verificar si aún está cargando el estado de auth
    if (authState?.checking) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Verificando autenticación...</Typography>
            </Box>
        );
    }

    // ✅ Verificar si el usuario está logueado
    if (!authState?.logged || !token) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>Por favor, inicia sesión para acceder a esta página.</Typography>
            </Box>
        );
    }

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
        model, brand, price, stock, sizes, colors,
        setModel, setBrand, setPrice, setStock, setSizes, setColors,
        isEditable,
        marcasDisponibles,
        handleAddProduct,
        handleUpdateProduct
    } = useProductForm(setMainImage, setExtraImages);

    return (
        <Box sx={{ maxWidth: '1300px', margin: '26px auto', px: 1 }}>
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
                    colors={colors}
                    stock={stock}
                    sizes={sizes}
                    marcasDisponibles={marcasDisponibles}
                    setModel={setModel}
                    setBrand={setBrand}
                    setPrice={setPrice}
                    setColors={setColors}
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
