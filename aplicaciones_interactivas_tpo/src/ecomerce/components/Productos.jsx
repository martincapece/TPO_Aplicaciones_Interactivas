import { useState, useEffect } from "react";
import { Grid, Typography, FormControl, InputLabel, Select, MenuItem, Slider, Button } from "@mui/material";
import { SneakerCard } from "./SneakerCard";

export const Productos = () => {
    // Estado para filtros
    const [brand, setBrand] = useState("");
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [maxPrice, setMaxPrice] = useState(500);
    const [order, setOrder] = useState("alphabetically"); // Nuevo estado para ordenar

    const [productos, setProductos] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/data")
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error("Error al cargar productos", err));
    }, []); 


    // Aplica filtros sobre los productos
    const productosFiltrados = productos
        .filter(p => brand ? p.brand === brand : true)
        .filter(p => color ? p.colors.includes(color) : true)
        .filter(p => !size || p.sizes.some(s => s.size === String(size) && s.stock > 0))
        .filter(p => p.price <= maxPrice)
        .sort((a, b) => {
            switch (order) {
                case "alphabetically":
                    return a.model.localeCompare(b.model);
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                default:
                    return a.model.localeCompare(b.model);
            }
        });

    return (
        <Grid sx={{ my: 10, }}>
            <Typography
                variant="h2"
                id="productos"
                sx={{ fontSize: '45px', fontFamily: 'Inter', fontWeight: 800, mb: 5 }}
            >
                TODOS LOS PRODUCTOS
            </Typography>

            {/* Filtros */}
            <Grid container spacing={2} sx={{ mb: 6 }}>
                {/* Filtro Marca */}
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="brand-label">Marca</InputLabel>
                        <Select
                            labelId="brand-label"
                            id="brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            label="Marca"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="">
                                <em>Todas</em>
                            </MenuItem>
                            <MenuItem value="Nike">Nike</MenuItem>
                            <MenuItem value="Vans">Vans</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Filtro Color */}
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="color-label">Color</InputLabel>
                        <Select
                            labelId="color-label"
                            id="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            label="Color"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="">
                                <em>Todos</em>
                            </MenuItem>
                            {[...new Set(productos.flatMap(p => p.colors))].map(col => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Filtro Talle */}
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="size-label">Talle</InputLabel>
                        <Select
                            labelId="size-label"
                            id="size"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            label="Talle"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="">
                            <em>Todos</em>
                            </MenuItem>
                            {[...new Set(productos.flatMap(p => p.sizes.map(s => s.size)))]
                            .sort((a, b) => parseFloat(a) - parseFloat(b))
                            .map((talle) => (
                                <MenuItem key={talle} value={talle}>{talle}</MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                </Grid>

                {/* Filtro Precio */}
                <Grid item xs={12} sm={9}> {/* Ajustamos a 9 para que ocupe más espacio */}
                    <Typography gutterBottom>Precio máximo: ${maxPrice}</Typography>
                    <Slider
                        value={maxPrice}
                        onChange={(e, value) => setMaxPrice(value)}
                        min={50}
                        max={500}
                        step={10}
                        valueLabelDisplay="auto"
                        sx={{ width: '100%' }}  /* Esto hace que el slider ocupe el 100% del ancho disponible */
                    />
                </Grid>


                {/* Filtro Ordenar por */}
                <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', ml: 'auto' }}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="order-label">Ordenar por</InputLabel>
                        <Select
                            labelId="order-label"
                            id="order"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            label="Ordenar por"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="alphabetically">Alfabéticamente</MenuItem>
                            <MenuItem value="price-asc">Precio: Menor a Mayor</MenuItem>
                            <MenuItem value="price-desc">Precio: Mayor a Menor</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item>
                    <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        setBrand("");
                        setColor("");
                        setSize("");
                        setMaxPrice(500);
                        setOrder("alphabetically");
                    }}
                    >
                    LIMPIAR FILTROS
                    </Button>
                </Grid>

            </Grid>

            {/* Productos */}
            <Grid container spacing={2}>
                {productosFiltrados.length ? (
                    productosFiltrados.map(sneaker => (
                        <SneakerCard key={sneaker.id} {...sneaker} />
                    ))
                ) : (
                    <Typography variant="h6" sx={{ m: 2 }}>
                        No hay productos que coincidan con los filtros seleccionados.
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};