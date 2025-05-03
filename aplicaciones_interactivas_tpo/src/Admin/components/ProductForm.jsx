import React from 'react';
import { Box, TextField, Button } from '@mui/material';

export default function ProductForm({
    model,
    brand,
    price,
    stock,
    sizes,
    setModel,
    setBrand,
    setPrice,
    setStock,
    setSizes,
    onSubmit
}) {
    return (
        <Box
            sx={{
                flex: 1,
                borderRadius: 2,
                border: '1px solid #ccc',
                padding: 2,
                backgroundColor: '#fafafa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minWidth: '300px',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <TextField label="Modelo" fullWidth value={model} onChange={(e) => setModel(e.target.value)} sx={{ mb: 1 }} />
            <TextField label="Marca" fullWidth value={brand} onChange={(e) => setBrand(e.target.value)} sx={{ mb: 1 }} />
            <TextField label="Precio" type="number" fullWidth value={price} onChange={(e) => setPrice(e.target.value)} sx={{ mb: 1 }} />
            <TextField label="Stock" type="number" fullWidth value={stock} onChange={(e) => setStock(e.target.value)} sx={{ mb: 1 }} />
            <TextField
                label="Tallas (separadas por comas)"
                fullWidth
                value={sizes.join(', ')}
                onChange={(e) => setSizes(e.target.value.split(',').map((size) => size.trim()))}
                sx={{ mb: 1 }}
            />
            <Button variant="contained" color="primary" onClick={onSubmit} sx={{ borderRadius: 999 }}>
                Crear Producto
            </Button>
        </Box>
    );
}
