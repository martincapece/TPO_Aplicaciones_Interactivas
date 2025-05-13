import { Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { SneakerCard } from "./SneakerCard";


export const Destacados = () => {
    const location = useLocation();

    const [productos, setProductos] = useState([]);

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
            }
        }
    }, [location]);

    useEffect(() => {
    fetch("http://localhost:3000/data")
        .then(res => res.json())
        .then(data => setProductos(data))
        .catch(err => console.error("Error al cargar productos", err));
    }, []); 

    return (
        <>
            <Typography variant="h2" id="destacados" sx={{ fontSize: '45px', fontFamily: 'Inter', fontWeight: 800, my: 10 }}>
                DESTACADOS
            </Typography>
            
            <Grid container spacing={2} direction="row">
                {productos.map(sneaker => (
                    ( sneaker.featured ) &&
                    <SneakerCard key={sneaker.id} {...sneaker} />
                ))}
            </Grid>
        </>
    );
};
