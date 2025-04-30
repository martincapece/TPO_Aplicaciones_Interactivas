import React from 'react'
import { useParams } from "react-router-dom";
import { dataDestacados } from "../data/dataDestacados";
import {Box,Typography,Button,Grid,Chip,Stack,Divider,ToggleButton,ToggleButtonGroup,} from "@mui/material";
import { useState } from "react";
import { useCart } from "../../Cart/hooks/useCart";
import { Link } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from "framer-motion";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

export default function SneakerPage() {
    const { id } = useParams();
    const sneaker = dataDestacados.find((item) => item.id === parseInt(id));
    const [selectedSize, setSelectedSize] = useState("");
    const { addProduct } = useCart();
    const [dialogOpen, setDialogOpen] = useState(false);


    if (!sneaker) {
        return <Typography variant="h6">Producto no encontrado</Typography>;
    }

return (
    <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
    >
        <Box p={4}>
            <Grid container spacing={4}>
            {/* Imagen y miniaturas */}
            <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={1}>
                <Box
                    sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    }}
                >
                    {/* Miniaturas (simulada una sola) */}
                    <Box
                    component="img"
                    src={sneaker.image}
                    alt={sneaker.model}
                    sx={{
                        width: 70,
                        height: 70,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: "1px solid #ccc",
                    }}
                    />
                </Box>

                {/* Imagen principal */}
                <Box
                    component="img"
                    src={sneaker.image}
                    alt={sneaker.model}
                    sx={{
                    width: "100%",
                    maxWidth: 550,
                    height: "auto",
                    borderRadius: 2,
                    ml: 2,
                    }}
                />
                </Stack>
            </Grid>

            {/* Info del producto */}
            <Grid item xs={12} md={6}>
                <Typography variant="h3" fontWeight="bold">
                {sneaker.model}
                </Typography>
                <Typography variant="h5" color="text.secondary" mb={2}>
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
                    sx={{ flexWrap: "wrap", gap: 1 }}
                >
                    {sneaker.sizes.map((size) => (
                    <ToggleButton key={size} value={size}>
                        {size}
                    </ToggleButton>
                    ))}
                </ToggleButtonGroup>
                </Box>

                {/* Botón agregar */}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, borderRadius: 999, px: 4 }}
                    onClick={() => {
                        setDialogOpen(true);
                    }}

                >
                    Agregar al Carrito
                </Button>

                {/* Descripción */}
                <Box mt={4}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Comodidad y rendimiento
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Las {sneaker.model} están diseñadas para ofrecerte estilo y
                    rendimiento en todo momento. Con materiales de alta calidad y una
                    suela cómoda, son ideales tanto para el día a día como para
                    ocasiones especiales.
                </Typography>
                </Box>
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

            <Box mt={5} width={800}>
                <Typography variant="h5" gutterBottom>Información adicional</Typography>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant='h6'>Cambios y devoluciones</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body1">
                        Podés cambiar o devolver cualquier producto en un plazo de 30 días, siempre que esté en condiciones originales.
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant='h6'>Métodos de pago</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body1">
                        Aceptamos tarjetas de crédito, débito, MercadoPago y transferencia bancaria.
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant='h6'>Envíos</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body1">
                        Envío gratuito a todo el país en compras mayores a $50.000. Despacho en 24 horas.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* Productos recomendados */}
            <Box mt={8}>
            <Typography variant="h5" mb={2}>
                Te recomendamos
            </Typography>
            <Grid container spacing={2}>
                {dataDestacados
                .filter((item) => item.id !== sneaker.id)
                .slice(0, 3)
                .map((prod) => (
                    <Grid item xs={12} sm={4} key={prod.id}>
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
                        <Link to={`/producto/${prod.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <Box>Ver Producto</Box>
                        </Link>
                    </Box>
                    </Grid>
                    
                ))}
            </Grid>
            </Box>
        </Box>
    </motion.div>
);
}