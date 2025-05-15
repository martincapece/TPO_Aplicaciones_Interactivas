import React from 'react';
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Typography
} from '@mui/material';

const AVAILABLE_SIZES = [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];
const COLOR_OPTIONS = ["Marron", "Verde", "Negro", "Blanco", "Gris", "Beige", "Dorado", "Amarillo"];

export default function ProductForm({
    model,
    brand,
    price,
    colors,
    sizes,
    setModel,
    setBrand,
    setPrice,
    setColors,
    setSizes,
    onSubmit,
    buttonLabel
}) {
    const handleSizeStockChange = (size, stock) => {
        const updatedSizes = sizes.map((s) =>
            s.size === size ? { ...s, stock: Number(stock) } : s
        );

        if (!sizes.some((s) => s.size === size)) {
            updatedSizes.push({ size, stock: Number(stock) });
        }

        const cleaned = updatedSizes.filter((s) => !isNaN(s.stock) && s.stock > 0);
        setSizes(cleaned);
    };

    const getStockForSize = (size) => {
        const found = sizes.find((s) => s.size === String(size));
        return found ? found.stock : '';
    };


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
            <TextField
                label="Modelo"
                fullWidth
                value={model}
                onChange={(e) => setModel(e.target.value)}
                sx={{ mb: 1 }}
            />

            <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel id="brand-label">Marca</InputLabel>
                <Select
                    labelId="brand-label"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    label="Marca"
                >
                    <MenuItem value="Nike">Nike</MenuItem>
                    <MenuItem value="Vans">Vans</MenuItem>
                    <MenuItem value="Jordan">Jordan</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel id="color-label">Color</InputLabel>
                <Select
                    labelId="color-label"
                    value={colors}
                    onChange={(e) => setColors([e.target.value])}
                    label="Color"
                >
                    {COLOR_OPTIONS.map((color) => (
                        <MenuItem key={color} value={color}>
                            {color}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>


            <TextField
                label="Precio"
                type="number"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ mb: 1 }}
            />

            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Stock por talle
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 0.5 }}>
                {AVAILABLE_SIZES.map((size) => (
                    <TextField
                        key={size}
                        label={`Talle ${size}`}
                        type="number"
                        value={getStockForSize(String(size))}
                        onChange={(e) => handleSizeStockChange(String(size), e.target.value)}
                        sx={{ width: '120px', height: '80px' }}
                        inputProps={{ min: 0 }}
                    />
                ))}
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={onSubmit}
                sx={{ borderRadius: 999 }}
            >
                {buttonLabel}
            </Button>
        </Box>
    );
}
