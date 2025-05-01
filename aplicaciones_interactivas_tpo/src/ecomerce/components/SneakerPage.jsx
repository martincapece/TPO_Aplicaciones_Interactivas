import React from 'react'
import { useParams } from "react-router-dom";
import { dataDestacados } from "../data/dataDestacados";
import {Box,Typography,Button,Grid,Chip,Stack,Divider,ToggleButton,ToggleButtonGroup,} from "@mui/material";
import { useState } from "react";
import { useCart } from "../../Cart/hooks/useCart";
import { Link } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";


export default function SneakerPage() {
    const { id } = useParams();
    const sneaker = dataDestacados.find((item) => item.id === parseInt(id));
    const [ selectedSize, setSelectedSize ] = useState("");
    const { addProduct } = useCart();
    const [ dialogOpen, setDialogOpen ] = useState(false);
    const [ currentPhoto, setCurrentPhoto ] = useState(sneaker.image[0]);
    const allSizes = Array.from({ length: 11 }, (_, i) => 7 + i * 0.5); // Genera [7, 7.5, ..., 12]

    if (!sneaker) {
        return <Typography variant="h6">Producto no encontrado</Typography>;
    }

    const handleImageClick = (image) => {
        setCurrentPhoto(image);
    }

return (
    <Grid
    container
    sx={{
        margin: '0 auto',
        maxWidth: { xs: '300px', sm: '600px', md: '800px', lg: '1300px' },
    }}
    >
        <Grid 
        container 
        spacing={4}
        direction='row'
        justifyContent='space-between'
        sx={{
            my: 10
        }}
        >
            <Grid item xs={12} md={6}>
                <Box sx={{ maxWidth: 550, width: "100%" }}>
                    {/* Contenedor de imagen princigitpal con relación fija */}
                    <Box
                    sx={{
                        width: "100%",
                        aspectRatio: "1", // cuadrado responsivo
                        backgroundColor: "#ffff",
                        borderRadius: 2,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    >
                    <Box
                        component="img"
                        src={currentPhoto}
                        alt={sneaker.model}
                        sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        }}
                    />
                    </Box>

                    {/* Miniaturas */}
                    {sneaker.image.length > 1 && (
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        {sneaker.image.map((img, index) => (
                        <Box
                            key={index}
                            component="img"
                            src={img}
                            onClick={() => handleImageClick(img)}
                            alt={`${sneaker.model} - ${index + 1}`}
                            sx={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 1,
                            border: currentPhoto === img ? "2px solid black" : "1px solid #ccc",
                            cursor: "pointer",
                            transition: "border 0.2s ease-in-out",
                            }}
                        />
                        ))}
                    </Box>
                    )}
                </Box>
            </Grid>

            {/* Info del producto */}
            <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h3" sx={{ fontFamily: "Inter", fontSize: { xs: '30px',md: '45px'}, fontWeight: "bold" }}>
                {sneaker.model}
                </Typography>
                <Typography variant="h5" sx={{ color: "text.secondary", fontFamily: "Inter", fontSize: '20px', my: 2, fontWeight: "bold" }}>
                {sneaker.brand}
                </Typography>

                <Typography variant="h5">${sneaker.price}</Typography>

                {/* Talles */}
                <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                    Seleccionar Talle
                </Typography>
                <ToggleButtonGroup
                    value={selectedSize}
                    exclusive
                    onChange={(e, newSize) => {
                    if (newSize) setSelectedSize(newSize);
                    }}
                    aria-label="talles"
                    sx={{
                        flexWrap: "wrap",
                        gap: 1.5,
                        justifyContent: "center",
                        marginY: 2,
                        '& .MuiToggleButtonGroup-grouped': {
                            border: '1.5px solid #ccc !important',
                            margin: 0,
                            borderRadius: '12px !important',
                        },
                        '& .MuiToggleButtonGroup-grouped.Mui-selected': {
                            borderColor: '#000 !important',
                        }
                    }}
                    >
                    {allSizes.map((size) => {
                        const isAvailable = sneaker.sizes.includes(size.toString());
                        return (
                            <ToggleButton
                                key={size}
                                value={size}
                                disabled={!isAvailable}
                                selected={selectedSize === size}
                                color="primary"
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: "12px",
                                    color: selectedSize === size ? "#fff" : "#000",
                                    fontWeight: 500,
                                    fontSize: "16px",
                                    fontFamily: "Inter",
                                    transition: "all 0.2s ease-in-out",
                                    '&:hover': {
                                        backgroundColor: isAvailable ? "#f0f0f0" : "#f5f5f5",
                                    },
                                    '&.Mui-disabled': {
                                        position: 'relative',
                                        color: '#bbb',
                                        backgroundColor: '#f9f9f9',
                                        borderColor: '#eee',
                                        cursor: 'not-allowed',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '10%',
                                            width: '80%',
                                            height: '2px',
                                            backgroundColor: '#bbb',
                                            transform: 'rotate(-20deg)',
                                            transformOrigin: 'center',
                                        },
                                    },
                                }}
                            >
                                { size }
                            </ToggleButton>
                        );
                    })}
                </ToggleButtonGroup>
                </Box>

                {/* Botón agregar */}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ my: { xs: 6 }, borderRadius: 999, px: 4 }}
                    onClick={() => {
                        setDialogOpen(true);
                    }}

                >
                    Agregar al Carrito
                </Button>

                {/* Descripción */}
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Comodidad y rendimiento
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Las {sneaker.model} están diseñadas para ofrecerte estilo y
                    rendimiento en todo momento. Con materiales de alta calidad y una
                    suela cómoda, son ideales tanto para el día a día como para
                    ocasiones especiales.
                </Typography>
            </Grid>
        </Grid>

        {/* Alerta Confirmar Agregar al Carrito */}
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                borderRadius: 4,
                backgroundColor: "white",
                textAlign: "center",
                p: 3,
                },
            }}
            BackdropProps={{
                sx: {
                backgroundColor: "rgba(0, 0, 0, 0.4)", // fondo opaco
                },
            }}
            >
            <DialogTitle>Producto agregado</DialogTitle>
            <DialogContent>
                <Typography>
                ¿Deseás confirmar agregar el producto <strong>{sneaker.model}</strong> al carrito?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button
                onClick={() => {
                    addProduct(sneaker);
                    setDialogOpen(false);
                }}
                variant="contained"
                color="primary"
                sx={{ borderRadius: 999, px: 4 }}
                >
                Aceptar
                </Button>
            </DialogActions>
        </Dialog>

        <Box sx={{ mt: 8,width: "100%" }}>
            <Typography variant="h5" gutterBottom sx={{ fontFamily: "Inter" }}>Información adicional</Typography>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant='h6' sx={{ fontFamily: "Inter", fontSize: { xs: '15px', md: '18px' },} }>Cambios y devoluciones</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography variant="body1" sx={{ fontFamily: "Inter", fontSize: { xs: '15px' },}}>
                    Podés cambiar o devolver cualquier producto en un plazo de 30 días, siempre que esté en condiciones originales.
                </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant='h6' sx={{ fontFamily: "Inter", fontSize: { xs: '15px', md: '18px' } }}>Métodos de pago</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography variant="body1" sx={{ fontFamily: "Inter", fontSize: { xs: '15px' },}}>
                    Aceptamos tarjetas de crédito, débito, MercadoPago y transferencia bancaria.
                </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant='h6' sx={{ fontFamily: "Inter", fontSize: { xs: '15px', md: '18px' } }}>Envíos</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography variant="body1" sx={{ fontFamily: "Inter", fontSize: { xs: '15px' },}}>
                    Envío gratuito a todo el país en compras mayores a $50.000. Despacho en 24 horas.
                </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>

        {/* Productos recomendados */}
        <Box sx={{ width: "100%", my: 15 }}>
        <Typography variant="h5" mb={2}>
            Te recomendamos
        </Typography>
        <Grid container spacing={2}>
            {dataDestacados
            .filter((item) => item.id !== sneaker.id)
            .slice(0, 3)
            .map((prod) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={prod.id}>
                <Box sx={{ textAlign: "center" }}>
                    <Box
                    component="img"
                    src={prod.image}
                    alt={prod.model}
                    sx={{ width: "100%", maxWidth: 250, mb: 1 }}
                    />
                    <Typography variant="body1">{prod.model}</Typography>
                    <Typography variant="body2" color="text.secondary">
                    ${prod.price}
                    </Typography>
                    <Link to={`/producto/${prod.id}`} style={{ color: "inherit" }}>
                        <Box>Ver Producto</Box>
                    </Link>
                </Box>
                </Grid>
            ))}
        </Grid>
        </Box>
    </Grid>
);
}