import { useState, useEffect, useContext } from "react";
import { Grid, Typography, FormControl, InputLabel, Select, MenuItem, Slider, Button, CircularProgress } from "@mui/material";
import { SneakerCard } from "./SneakerCard"
import { useLocation } from "react-router-dom"
import { ProductosContext } from "../context/ProductosContext";

export const Productos = () => {
    // Estado para filtros
    const [marca, setMarca] = useState("")
    const [color, setColor] = useState("")
    const [talle, setTalle] = useState("")
    const [maxPrecio, setMaxPrecio] = useState(500)
    const [order, setOrder] = useState("alphabetically")

    const location = useLocation()
    const searchQuery = new URLSearchParams(location.search).get("query") || ""

    // Obtener datos del contexto
    const { productos, loading, loadingProductos, errorProductos, getTallesDisponibles, tieneStockEnTalle } = useContext(ProductosContext)

    // Efecto para cargar la marca seleccionada desde localStorage
    useEffect(() => {
        const selectedBrand = localStorage.getItem("selectedBrand");
        if (selectedBrand) {
            setMarca(selectedBrand);
            localStorage.removeItem("selectedBrand"); // Limpiar después de usar
        }
    }, []);

    // Obtener datos derivados
    const coloresDisponibles = !loadingProductos ? [...new Set(productos.flatMap((p) => p.color))] : []
    const tallesDisponibles = !loading ? getTallesDisponibles() : []

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
            return tieneStockEnTalle(p.sku, talle);
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
    
    // Mostrar loading mientras carga
    if (loading) {
        return (
        <Grid sx={{ my: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h4" sx={{ fontFamily: "Inter", fontWeight: 600 }}>
            Cargando productos...
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
            Obteniendo productos, talles e imágenes...
            </Typography>
        </Grid>
        )
    }

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
                                <em>Seleccionar marca</em>
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
                        sx={{ minWidth: 125 }}
                        >
                            <MenuItem value="">
                                <em>Seleccionar un color</em>
                            </MenuItem>
                            {coloresDisponibles.map((col) => (
                                <MenuItem key={col} value={col}>
                                {col}
                                </MenuItem>
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
                        value={talle}
                        onChange={(e) => setTalle(e.target.value)}
                        label="Talle"
                        sx={{ minWidth: 125 }}
                        >
                        <MenuItem value="">
                            <em>Seleccionar un talle</em>
                        </MenuItem>
                        {tallesDisponibles.map((talleNum) => (
                            <MenuItem key={talleNum} value={talleNum}>
                            {talleNum}
                            </MenuItem>
                        ))}
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