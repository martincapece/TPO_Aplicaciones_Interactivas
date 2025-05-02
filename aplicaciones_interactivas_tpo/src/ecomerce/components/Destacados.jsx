import { Grid, Typography } from "@mui/material"
import { dataDestacados } from '../data/dataDestacados'
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SneakerCard } from "./SneakerCard";

export const Destacados = () => {
    const location = useLocation();
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

    return (
        <>
            <Typography variant="h2" id="destacados" sx={{ fontSize: '45px', fontFamily: 'Inter', fontWeight: 800, my: 10 }}>
                DESTACADOS
            </Typography>
            
            <Grid container spacing={2} direction="row">
                {dataDestacados.map( sneaker => (
                    <SneakerCard key={ sneaker.id } { ...sneaker } />
                ))}
            </Grid>
        </>
    );
};
