import { useState, useEffect } from "react";
import { Grid, Typography, FormControl, InputLabel, Select, MenuItem, Slider, Button } from "@mui/material";
import { SneakerCard } from "./SneakerCard";
import { useLocation } from "react-router-dom";
import { useGetProductosFiltrados } from "../hooks/useGetProductosFiltrados";
import { useGetTallesPorSkus } from "../hooks/useGetTallesPorSkus";

export const Productos = () => {
    // Estado para filtros
    const [marca, setMarca] = useState("");
    const [color, setColor] = useState("");
    const [talle, setTalle] = useState("");
    const [maxPrecio, setMaxPrecio] = useState(500);
    const [order, setOrder] = useState("alphabetically"); // Nuevo estado para ordenar
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get("query") || "";
    const { productos, loading, error } = useGetProductosFiltrados({
        marca: marca || null,
        color: color || null,
        modelo: searchQuery || null,
        minPrecio: 0,
        maxPrecio: maxPrecio || null,
    });

    const skus = productos.map(p => p.sku);
    const { productoTalles } = useGetTallesPorSkus({ skus });


    // Leer el filtro guardado en localStorage
    useEffect(() => {
        const savedMarca = localStorage.getItem("selectedMarca");
        if (savedMarca) {
            setMarca(savedMarca);
            localStorage.removeItem("selectedMarca");
        }
    }, []);

    // Aplica filtros sobre los productos
    const productosFiltrados = productos
        .filter(p =>
            p.modelo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.marca.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(p => marca ? p.marca === marca : true)
        .filter(p => color ? p.color === color : true)
        .filter(p => {
            if (!talle) return true;
            const tallesDeProducto = productoTalles.filter(pt => pt.producto.sku === p.sku);
            return tallesDeProducto.some(pt => pt.talle.numero === talle && pt.stock > 0);
        })
        .filter(p => p.precio <= maxPrecio)
        .sort((a, b) => {
            switch (order) {
            case "alphabetically":
                return a.modelo.localeCompare(b.modelo);
            case "price-asc":
                return a.precio - b.precio;
            case "price-desc":
                return b.precio - a.precio;
            default:
                return a.modelo.localeCompare(b.modelo);
            }
        });

    return (
        <Grid sx={{ my: 10, }}>
            <Typography variant="h2" id="productos" sx={{ fontSize: '45px', fontFamily: 'Inter', fontWeight: 800, mb: 5 }}>
                {searchQuery ? `Resultados para: "${searchQuery}"` : "TODOS LOS PRODUCTOS"}
            </Typography>

            {/* Filtros */}
            <Grid container spacing={2} sx={{ mb: 6 }}>
                {/* Filtro Marca */}
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth variant="outlined" size="small">
                        <InputLabel id="marca-label">Marca</InputLabel>
                        <Select
                            labelId="marca-label"
                            id="marca"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            label="Marca"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="">
                                <em>Todas</em>
                            </MenuItem>
                            <MenuItem value="Jordan">Jordan</MenuItem>
                            <MenuItem value="Nike">Nike</MenuItem>
                            <MenuItem value="Asics">Asics</MenuItem>
                            <MenuItem value="Hoka">Hoka</MenuItem>
                            <MenuItem value="New Balance">New Balance</MenuItem>
                            <MenuItem value="Rebook">Rebook</MenuItem>
                            <MenuItem value="Adidas">Adidas</MenuItem>
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
                            {[...new Set(productos.flatMap(p => p.color))].map(col => (
                                <MenuItem key={col} value={col}>{col}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Filtro Talle */}
                <Grid item xs={12} sm={3}>
                    <FormControl fullWidth variant="outlined" size="small" >
                        <InputLabel id="size-label">Talle</InputLabel>
                        <Select
                            labelId="size-label"
                            id="size"
                            value={talle}
                            onChange={(e) => setTalle(e.target.value)}
                            label="Talle"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem>
                                {productos.length === 0 ? "Cargando talles..." : "Todos"}
                            </MenuItem>
                            {[...new Set(productoTalles.map(p => p.talle.numero))]
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
                    <Typography gutterBottom>Precio máximo: ${maxPrecio}</Typography>
                    <Slider
                        value={maxPrecio}
                        onChange={(e, value) => setMaxPrecio(value)}
                        min={0}
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
                        setMarca("");
                        setColor("");
                        setTalle("");
                        setMaxPrecio(500);
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
                        <SneakerCard key={sneaker.sku} {...sneaker} />
                    ))
                ) : (
                    <Typography variant="h6" sx={{ m: 2 }}>
                        {searchQuery
                        ? `No se encontraron resultados para: "${searchQuery}".`
                        : "No hay productos que coincidan con los filtros seleccionados."}
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};