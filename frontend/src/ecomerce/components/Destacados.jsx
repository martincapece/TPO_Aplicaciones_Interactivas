import { Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SneakerCard } from "./SneakerCard";
import { useGetProductosFiltrados } from "../hooks/useGetProductosFiltrados";


export const Destacados = () => {
    const location = useLocation();
    const { productos, loading, error } = useGetProductosFiltrados({ destacados: true });

    useEffect(() => {
        if (location.hash) {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
            setTimeout(() => {
            const yOffset = -80;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
            }, 100);
        }}
    }, [location]);

    if (loading) return <Typography variant="h6">Cargando imagenes...</Typography>;
    if (!!error) return <Typography variant="h6" color="error">Error: {error}</Typography>;

    return (
        <>
            <Typography variant="h2" id="destacados" sx={{ fontSize: '45px', fontFamily: 'Inter', fontWeight: 800, my: 10 }}>
                DESTACADOS
            </Typography>
            
            <Grid container spacing={2} direction="row">
                {productos.map(sneaker => (
                    <SneakerCard key={sneaker.sku} {...sneaker} />
                ))}
            </Grid>
        </>
    );
};
