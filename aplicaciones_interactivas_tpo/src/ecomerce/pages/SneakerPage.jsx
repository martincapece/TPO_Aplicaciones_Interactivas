import { useState, useEffect } from "react";
import { useCart } from "../../Cart/hooks/useCart";
import { Link ,useParams,useLocation } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails,Box,Typography,Button,Grid,ToggleButton,ToggleButtonGroup, } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2'

export default function SneakerPage()  {
    const { id } = useParams();
    const location = useLocation();
    const [ selectedSize, setSelectedSize ] = useState("");
    const [ selectedStock, setSelectedStock ] = useState("");
    const [ currentPhoto, setCurrentPhoto ] = useState(null);
    const [ sneaker, setSneaker ] = useState(null);
    const [ dialogOpen, setDialogOpen ] = useState(false);
    const [ productos, setProductos ] = useState([]);
    const { addProduct } = useCart();
    const allSizes = Array.from({ length: 11 }, (_, i) => 7 + i * 0.5); // Genera [7, 7.5, ..., 12] 
    
    useEffect(() => {
        fetch("http://localhost:3000/data")
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error("Error al cargar productos", err));
    }, []);

    useEffect(() => {
        const found = productos.find((item) => item.id === id);
        if (found) setSneaker(found);
    }, [ productos, id ]);
    
    useEffect(() => {
        if (sneaker) setCurrentPhoto(sneaker.image[0]);
    }, [ sneaker ]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [ id, location.pathname ]);

    useEffect(() => {
        if (sneaker && selectedSize !== "") {
            const stockInfo = sneaker.sizes.find(s => s.size === String(selectedSize));
            setSelectedStock(stockInfo ? stockInfo.stock : 0);
        } else {
            setSelectedStock(0);
        }
    }, [ selectedSize, sneaker ]);

    
    if (!sneaker) {
        return <Typography variant="h6" sx={{ textAlign: 'center', mt: 10 }}> Producto no encontrado </Typography>
    }
    
    const handleImageClick = (image) => {
        setCurrentPhoto(image);
    }

return (
    <Grid
    container
    sx={{
        margin: '0 auto',
        maxWidth: { xs: '300px', sm: '500px', md: '900px', lg: '1200px' }
    }}
    >
        <Grid 
        container 
        spacing={4}
        direction='row'
        justifyContent='space-between'
        sx={{
            my: 10,
        }}
        >
            <Grid size={{ xs: 12, md: 6 }}>
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
                                width: { xs: 50, sm: 60 },
                                height: { xs: 50, sm: 60 },
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
                        const sizeInfo = sneaker.sizes.find(s => s.size === size.toString());
                        const isAvailable = sizeInfo && sizeInfo.stock > 0;
                        return (
                            <ToggleButton
                                key={size}
                                value={size}
                                disabled={!isAvailable}
                                selected={selectedSize === size}
                                color="primary"
                                sx={{
                                    width: 55,
                                    height: 55,
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

                {selectedSize && (
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Stock disponible: {selectedStock}
                    </Typography>
                )}
                
                </Box>

                

                {/* Botón agregar */}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ my: { xs: 6 }, borderRadius: 999, px: 4 }}
                    onClick={() => {
                        (selectedSize === "") 
                            ? Swal.fire({title: "¡Un momento!", text: "Para poder agregar el sneaker al carrito debes seleccionar un talle", icon: "error"}) 
                            : setDialogOpen(true);
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
            <DialogTitle>Confirmar compra</DialogTitle>
            <DialogContent>
                <Typography>
                ¿Deseás agregar <strong>{sneaker.model}</strong> al carrito?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button
                onClick={() => {
                    addProduct({
                        ...sneaker,
                        size: selectedSize,
                        stock: selectedStock
                    });
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
        {productos
            .filter(
                (item) =>
                item.id !== sneaker.id && item.brand.toLowerCase() === sneaker.brand.toLowerCase()
            )
            .slice(0, 6)
            .map((prod) => (
                <Grid size={{ sm: 4, md: 2 }} width='100%' key={prod.id}>
                <Link to={`/producto/${prod.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Box sx={{ textAlign: "center" }}>
                    <Box
                        component="img"
                        src={prod.image[0]}
                        alt={prod.model}
                        sx={{ width: "100%", maxWidth: { xs: 250, sm: 180}, mb: 1 }}
                    />
                    <Typography variant="body1">{prod.model}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        ${prod.price}
                    </Typography>
                    </Box>
                </Link>
                </Grid>
            ))}
        </Grid>
        </Box>
    </Grid>
);
}