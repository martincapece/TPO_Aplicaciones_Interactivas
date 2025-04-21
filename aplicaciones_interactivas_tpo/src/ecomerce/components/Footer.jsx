import React from 'react'
import { Box, Grid, Typography, Link as MuiLink, Divider } from "@mui/material";

const footerData = [
{
    title: "PRODUCTOS",
    links: ["Sneakers", "Categorías", "Destacados"],
},
{
    title: "NOSOTROS",
    links: ["Sobre nosotros", "Historia", "Contacto"],
},
{
    title: "AYUDA",
    links: ["Preguntas frecuentes", "Envíos", "Soporte técnico"],
},
{
    title: "LEGAL",
    links: ["Términos y condiciones", "Devoluciones y cambios"],
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
        {links.map((text, i) => (
        <MuiLink
            key={i}
            href="#"
            underline="none"
            color="grey.400"
            sx={{
            display: "block",
            fontSize: 14,
            mb: 0.5,
            "&:hover": { color: "grey.100" },
            }}
        >
            {text}
        </MuiLink>
        ))}
    </Box>
    );

export default function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: "black", color: "white", px: 4, py: 6 }}>
        <Grid container spacing={4} justifyContent="center">
            {footerData.map((section, index) => (
            <Grid item xs={6} sm={3} key={index}>
                <FooterColumn title={section.title} links={section.links} />
            </Grid>
            ))}
        </Grid>
    
        <Divider sx={{ bgcolor: "grey.800", my: 4 }} />
    
        <Typography variant="body2" color="grey.500" align="center" fontSize={12}>
            © 2025 LOQO. Todos los derechos reservados.
        </Typography>
        </Box>
    );
    }