import {React,useEffect} from 'react'
import { Box, Grid, Typography, Link as MuiLink, Divider } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

const footerData = [
{
    title: "PRODUCTOS",
    links: [
        {text: "Sneakers", to: "/catalogo"}, 
        {text: "Categorías", to: "/catalogo"},
        {text: "Destacados", to: "/inicio#destacados"},
    ],
},
{
    title: "NOSOTROS",
    links: [
        {text: "Sobre nosotros", to: "/Nosotros#" }, 
        {text: "Historia", to: "/Nosotros#historia" }, 
        {text: "Contacto", to: "/Nosotros#contacto" },
    ],
},
{
    title: "LEGALES",
    links: [
        { text: "Política de Envíos", to: "/Legales#envios" },
        { text: "Términos y condiciones", to: "/Legales#terminos" },
        { text: "Devoluciones y cambios", to: "/Legales#devoluciones" },
    ],
},
];

const FooterColumn = ({ title, links }) => (
    <Box>
        <Typography
            variant="subtitle2"
            fontWeight="bold"
            gutterBottom
            sx={{ textTransform: "uppercase" }}
        >
            {title}
        </Typography>
        {links.map((link, i) => (
            <MuiLink
            key={i}
            component={RouterLink}
            to={link.to}
            underline="none"
            color="grey.400"
            sx={{
                display: "block",
                fontSize: 14,
                mb: 0.5,
                "&:hover": { color: "grey.100" },
            }}
            >
            {link.text}
            </MuiLink>
        ))}
    </Box>
);

export const Footer = () => {
    return (
        <Box component="footer" sx={{ bgcolor: "black", color: "white", px: 4, py: 6, overflowX: "hidden",}}>
        <Grid container spacing={4} justifyContent="center">
            {footerData.map((section, index) => (
            <Grid item xs={6} sm={3} key={index}>
                <FooterColumn title={section.title} links={section.links} />
            </Grid>
            ))}
        </Grid>
    
        <Divider sx={{ bgcolor: "grey.800", my: 4 }} />
    
        <Typography variant="body2" color="grey.500" align="center" fontSize={12}>
            © 2025 SAPÁH. Todos los derechos reservados.
        </Typography>
        </Box>
    );
    }