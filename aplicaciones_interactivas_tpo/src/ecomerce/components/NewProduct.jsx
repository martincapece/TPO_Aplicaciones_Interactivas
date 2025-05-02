import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NewProduct() {
    const [model, setModel] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = () => {
        console.log({
            model,
            brand,
            price,
            stock,
            image,
            sizes,
        });

        navigate(`/producto/${model}`);
    };

    return (
        <Box sx={{ maxWidth: '1300px', margin: '40px auto', px: 2 }}>
            <Typography
                variant="h3"
                sx={{ fontFamily: 'Inter', fontWeight: 'bold', fontSize: '30px', mb: 5 }}
                textAlign="center"
            >
                Crear Nuevo Producto
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                {/* Imagen */}
                <Box
                    sx={{
                        width: '300px',
                        height: '300px',
                        borderRadius: 2,
                        border: '1px solid #ccc',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f5f5f5',
                    }}
                >
                    {imagePreview ? (
                        <Box
                            component="img"
                            src={imagePreview}
                            alt="Vista previa"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
                                Subir Imagen
                            </Typography>
                            <Button variant="outlined" component="label">
                                Seleccionar archivo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    hidden
                                />
                            </Button>
                        </>
                    )}
                </Box>

                {/* Formulario */}
                <Box
                    sx={{
                        flex: 1,
                        minHeight: '400px',
                        borderRadius: 2,
                        border: '1px solid #ccc',
                        p: 3,
                        backgroundColor: '#fafafa',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minWidth: '300px',
                        overflow: 'auto',
                    }}
                >
                    <TextField
                        label="Modelo"
                        fullWidth
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Marca"
                        fullWidth
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Precio"
                        type="number"
                        fullWidth
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Stock"
                        type="number"
                        fullWidth
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Tallas (separadas por comas)"
                        fullWidth
                        value={sizes.join(', ')}
                        onChange={(e) =>
                            setSizes(e.target.value.split(',').map((size) => size.trim()))
                        }
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setDialogOpen(true)}
                        sx={{ borderRadius: 999 }}
                    >
                        Crear Producto
                    </Button>
                </Box>
            </Box>

            {/* Confirmación */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        backgroundColor: 'white',
                        textAlign: 'center',
                        p: 3,
                    },
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    },
                }}
            >
                <DialogTitle>¿Confirmar nuevo producto?</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Deseas confirmar la creación del producto <strong>{model}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        onClick={() => {
                            handleAddProduct();
                            setDialogOpen(false);
                        }}
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 999, px: 4 }}
                    >
                        Aceptar
                    </Button>
                    <Button
                        onClick={() => setDialogOpen(false)}
                        variant="outlined"
                        color="secondary"
                        sx={{ borderRadius: 999, px: 4 }}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
