import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useCart } from "../../Cart/hooks/useCart";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context/index.js";
import { ProductosContext } from "../context/ProductosContext.jsx";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography,
    Button,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
    Skeleton, Alert
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';
import { LazyImage } from "../components/LazyImage";
import Snackbar from "@mui/material/Snackbar";

export function SneakerPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { authState } = useContext(AuthContext);
    const { token } = authState.user;
    
    // CONSTANTE: imagen not found
    const imgNotFound = "/assets/imgNotFound.jpg";
    
    // Usar el contexto de productos
    const {
        productos,
        getTallesPorSku,
        getImagenPrincipalPorSku,
        getImagenesProductoPorSku,
        getEstadoImagenesProducto,
        solicitarImagenesProducto,
        loading: contextLoading,
        datosYaCargados
    } = useContext(ProductosContext);

    // Estados locales
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedStock, setSelectedStock] = useState(0);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [productosRecomendados, setProductosRecomendados] = useState([]);
    const [imagenesRecomendados, setImagenesRecomendados] = useState({});
    const [loadingRecomendados, setLoadingRecomendados] = useState(true);

    const { addProduct } = useCart();

    // Datos del producto
    const sneaker = useMemo(() => {
        return productos.find(p => p.sku.toString() === id);
    }, [productos, id]);

    const talles = useMemo(() => {
        return getTallesPorSku(id);
    }, [getTallesPorSku, id]);

    const imagenPrincipal = useMemo(() => {
        return getImagenPrincipalPorSku(id);
    }, [getImagenPrincipalPorSku, id]);

    const imagenesProducto = useMemo(() => {
        return getImagenesProductoPorSku(id);
    }, [getImagenesProductoPorSku, id]);

    const estadoImagenesProducto = useMemo(() => {
        return getEstadoImagenesProducto(id);
    }, [getEstadoImagenesProducto, id]);

    // Función para manejar click en imagen
    const handleImageClick = useCallback((imageUrl) => {
        if (imageUrl && imageUrl !== currentPhoto) {
            setCurrentPhoto(imageUrl);
        }
    }, [currentPhoto]);

    // Función para cargar productos recomendados
    const fetchProductosRecomendados = useCallback(async (marca) => {
        if (!marca || !token) return;

        try {
            setLoadingRecomendados(true);
            const response = await fetch(`http://localhost:8080/sapah/productos/filter?marca=${encodeURIComponent(marca)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) return;

            const data = await response.json();
            let recomendados = data.filter(prod => prod.sku.toString() !== id).slice(0, 6);

            // Si no hay suficientes productos de la misma marca, tomar productos aleatorios
            if (recomendados.length < 6) {
                const productosAleatorios = productos
                    .filter(prod => prod.sku.toString() !== id && !recomendados.some(r => r.sku === prod.sku))
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 6 - recomendados.length);

                recomendados = [...recomendados, ...productosAleatorios];
            }

            setProductosRecomendados(recomendados);
            setLoadingRecomendados(false);

            if (recomendados.length > 0) {
                const imagenesPromises = recomendados.map(async (producto) => {
                    try {
                        const imgResponse = await fetch(`http://localhost:8080/api/imagenes/${producto.sku}/principal`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json"
                            }
                        });

                        if (imgResponse.ok) {
                            const imgData = await imgResponse.json();
                            return { sku: producto.sku, url: imgData.cloudinarySecureUrl || imgNotFound };
                        }
                        return { sku: producto.sku, url: imgNotFound };
                    } catch (err) {
                        return { sku: producto.sku, url: imgNotFound };
                    }
                });

                const imagenesResultados = await Promise.allSettled(imagenesPromises);
                const nuevasImagenes = {};
                imagenesResultados.forEach((result) => {
                    if (result.status === 'fulfilled' && result.value) {
                        nuevasImagenes[result.value.sku] = result.value.url;
                    }
                });
                setImagenesRecomendados(nuevasImagenes);
            }
        } catch (err) {
            console.error("Error al cargar productos recomendados:", err);
            setLoadingRecomendados(false);
        }
    }, [token, id, imgNotFound]);

    // Datos calculados
    const getTallesDisponiblesLocal = useMemo(() => {
        return talles
            .map(t => ({
                numero: t.talle.numero,
                stock: t.stock,
                id: t.talle.id
            }))
            .sort((a, b) => parseFloat(a.numero) - parseFloat(b.numero));
    }, [talles]);

    const hayStockDisponible = useMemo(() => {
        return talles.some(t => t.stock > 0);
    }, [talles]);

    const imagenParaMostrar = useMemo(() => {
        if (currentPhoto && currentPhoto.trim() !== '') {
            return currentPhoto;
        }
        
        if (estadoImagenesProducto === 'cargado' && imagenesProducto.length > 0) {
            const imagenPrincipalCompleta = imagenesProducto.find(img => img.esPrincipal);
            const imagenPorDefecto = imagenPrincipalCompleta || imagenesProducto[0];
            return imagenPorDefecto?.cloudinarySecureUrl || null;
        }
        
        if (imagenPrincipal?.cloudinarySecureUrl) {
            return imagenPrincipal.cloudinarySecureUrl;
        }
        
        return null;
    }, [currentPhoto, estadoImagenesProducto, imagenesProducto, imagenPrincipal]);

    // Estados de carga
    const isLoading = contextLoading || !datosYaCargados || !sneaker;
    const isLoadingImagenes = estadoImagenesProducto === 'cargando' || estadoImagenesProducto === 'no-cargado';
    const hayErrorImagenes = estadoImagenesProducto === 'error';

    // Effects
    useEffect(() => {
        if (id && datosYaCargados) {
            solicitarImagenesProducto(id);
        }
    }, [id, datosYaCargados, solicitarImagenesProducto]);

    useEffect(() => {
        setCurrentPhoto(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    useEffect(() => {
        if (!currentPhoto) {
            if (estadoImagenesProducto === 'cargado' && imagenesProducto.length > 0) {
                const imagenPrincipalCompleta = imagenesProducto.find(img => img.esPrincipal);
                const imagenPorDefecto = imagenPrincipalCompleta || imagenesProducto[0];
                
                if (imagenPorDefecto?.cloudinarySecureUrl) {
                    setCurrentPhoto(imagenPorDefecto.cloudinarySecureUrl);
                    return;
                }
            }
            
            if (imagenPrincipal?.cloudinarySecureUrl && estadoImagenesProducto !== 'cargado') {
                setCurrentPhoto(imagenPrincipal.cloudinarySecureUrl);
            }
        }
    }, [estadoImagenesProducto, imagenesProducto, imagenPrincipal, id, currentPhoto]);

    useEffect(() => {
        if (sneaker && datosYaCargados) {
            fetchProductosRecomendados(sneaker.marca);
        }
    }, [sneaker, datosYaCargados, fetchProductosRecomendados]);

    useEffect(() => {
        if (selectedSize && talles.length > 0) {
            const talleSeleccionado = talles.find(t => t.talle.numero.toString() === selectedSize.toString());
            setSelectedStock(talleSeleccionado ? talleSeleccionado.stock : 0);
        } else {
            setSelectedStock(0);
        }
    }, [selectedSize, talles]);

    // Handlers
    const handleAddToCart = useCallback(() => {
        if (!selectedSize) {
            Swal.fire({
                title: "¡Un momento!",
                text: "Para poder agregar el sneaker al carrito debes seleccionar un talle",
                icon: "error"
            });
            return;
        }
        setDialogOpen(true);
    }, [selectedSize]);


    // Primero, agrega estos estados al componente
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationSeverity, setNotificationSeverity] = useState('success'); // 'success', 'warning', 'error'

    const confirmarAgregarCarrito = useCallback(() => {
        const talleSeleccionado = talles.find(t => t.talle.numero.toString() === selectedSize.toString());

        // Verificar cuántos productos de este SKU y talle ya están en el carrito
        const productosEnCarrito = JSON.parse(localStorage.getItem('cart') || '[]');
        const cantidadEnCarrito = productosEnCarrito
            .filter(item => item.sku === sneaker.sku && item.numeroProducto === talleSeleccionado?.talle?.numero)
            .reduce((total, item) => total + (item.quantity || 1), 0);

        // Verificar si hay stock disponible
        if (cantidadEnCarrito >= selectedStock) {
            setNotificationMessage(`Ya tienes ${cantidadEnCarrito} unidad${cantidadEnCarrito > 1 ? 'es' : ''} de este producto y talle en el carrito. Stock disponible: ${selectedStock}`);
            setNotificationSeverity('warning');
            setNotificationOpen(true);
            setDialogOpen(false);
            return;
        }

        const productToAdd = {
            sku: sneaker.sku,
            modelo: sneaker.modelo,
            marca: sneaker.marca,
            precio: sneaker.precio,
            color: sneaker.color,
            numeroProducto: talleSeleccionado?.talle?.numero,
            stock: selectedStock,
            image: imagenPrincipal?.cloudinarySecureUrl,
        };

        console.log(sneaker);
        console.log('Producto a agregar:', productToAdd); // Para debuggear

        addProduct(productToAdd);
        setDialogOpen(false);

        const nuevaCantidad = cantidadEnCarrito + 1;
        const stockRestante = selectedStock - nuevaCantidad;

        setNotificationMessage(`El producto se agregó correctamente al carrito${stockRestante > 0 ? `. Stock restante: ${stockRestante}` : '. ¡Última unidad!'}`);
        setNotificationSeverity('success');
        setNotificationOpen(true);
    }, [talles, sneaker, selectedSize, selectedStock, addProduct, imagenPrincipal]);


    // CORREGIDO: Componente ProductoRecomendado con sintaxis correcta
    const ProductoRecomendado = useCallback(({ producto, imagen }) => {
        const handleClick = useCallback((e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/producto/${producto.sku}`);
        }, [producto.sku]);

        return (
            <Box
                onClick={handleClick}
                sx={{
                    textAlign: "center",
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    }
                }}
            >
                <LazyImage
                    src={imagen}
                    alt={producto.modelo}
                    showSkeleton={true}
                    sx={{
                        width: "100%",
                        mb: 1,
                        aspectRatio: "1",
                        objectFit: "contain",
                        borderRadius: 1,
                        pointerEvents: "none"
                    }}
                />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {producto.modelo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ${producto.precio?.toLocaleString('es-AR')}
                </Typography>
            </Box>
        );
    }, [navigate]); // CORREGIDO: Cerrar correctamente el useCallback

    // Renderizado condicional
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!sneaker) {
        return (
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 10 }}>
                Producto no encontrado
            </Typography>
        );
    }

    return (
        <Grid container sx={{ margin: '0 auto', maxWidth: { xs: '300px', sm: '500px', md: '900px', lg: '1200px' } }}>
            <Grid container spacing={4} direction='row' justifyContent='space-between' sx={{ my: 10 }}>
                {/* Sección de imágenes */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ maxWidth: 550, width: "100%" }}>
                        {/* Imagen principal */}
                        <Box
                            sx={{
                                width: "100%",
                                aspectRatio: "1",
                                backgroundColor: "#fff",
                                borderRadius: 2,
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {isLoadingImagenes ? (
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    gap: 2,
                                    width: "100%",
                                    height: "100%"
                                }}>
                                    <Skeleton
                                        variant="rectangular" 
                                        width="100%" 
                                        height="80%"
                                        sx={{ borderRadius: 1 }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        Cargando imágenes...
                                    </Typography>
                                </Box>
                            ) : hayErrorImagenes ? (
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    gap: 1,
                                    width: "100%",
                                    height: "100%",
                                    position: 'relative'
                                }}>
                                    <LazyImage
                                        src={imgNotFound}
                                        alt={sneaker.modelo}
                                        showSkeleton={false}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                    <Button 
                                        variant="outlined" 
                                        size="small"
                                        onClick={() => solicitarImagenesProducto(id)}
                                        sx={{
                                            position: 'absolute',
                                            bottom: 10,
                                            zIndex: 10
                                        }}
                                    >
                                        Reintentar
                                    </Button>
                                </Box>
                            ) : (
                                <LazyImage
                                    src={imagenParaMostrar}
                                    alt={sneaker.modelo}
                                    showSkeleton={true}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            )}
                        </Box>

                        {/* Miniaturas */}
                        {estadoImagenesProducto === 'cargado' && imagenesProducto.length > 1 && (
                            <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                                {imagenesProducto.map((img, index) => {
                                    const imagenUrl = img.cloudinarySecureUrl;
                                    const isSelected = currentPhoto === imagenUrl;
                                    
                                    return (
                                        <Box
                                            key={img.id}
                                            onClick={() => handleImageClick(imagenUrl)}
                                            sx={{
                                                width: { xs: 50, sm: 60 },
                                                height: { xs: 50, sm: 60 },
                                                borderRadius: 1,
                                                border: isSelected ? "3px solid #000" : "1px solid #ccc",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease-in-out",
                                                transform: isSelected ? "scale(1.05)" : "scale(1)",
                                                overflow: "hidden",
                                                '&:hover': {
                                                    borderColor: isSelected ? '#000' : '#666',
                                                    transform: isSelected ? "scale(1.05)" : "scale(1.02)"
                                                }
                                            }}
                                        >
                                            <LazyImage
                                                src={imagenUrl}
                                                alt={`${sneaker.modelo} - vista ${index + 1}`}
                                                showSkeleton={true}
                                                sx={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    pointerEvents: "none"
                                                }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Info del producto */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h3" sx={{ fontFamily: "Inter", fontSize: { xs: '30px', md: '45px' }, fontWeight: "bold" }}>
                        {sneaker.modelo}
                    </Typography>
                    <Typography variant="h5" sx={{
                        color: "text.secondary",
                        fontFamily: "Inter",
                        fontSize: '20px',
                        my: 2,
                        fontWeight: "bold"
                    }}>
                        {sneaker.marca}
                    </Typography>

                    <Typography variant="h5">${sneaker.precio?.toLocaleString('es-AR')}</Typography>

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
                            {getTallesDisponiblesLocal.map((talleInfo) => {
                                const isAvailable = talleInfo.stock > 0;
                                return (
                                    <ToggleButton
                                        key={talleInfo.numero}
                                        value={talleInfo.numero}
                                        disabled={!isAvailable}
                                        selected={selectedSize === talleInfo.numero}
                                        color="primary"
                                        sx={{
                                            width: 55,
                                            height: 55,
                                            borderRadius: "12px",
                                            color: selectedSize === talleInfo.numero ? "#fff" : "#000",
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
                                        {talleInfo.numero}
                                    </ToggleButton>
                                );
                            })}
                        </ToggleButtonGroup>

                        {selectedSize && selectedStock >= 0 && (
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                Stock disponible: {selectedStock}
                            </Typography>
                        )}
                    </Box>

                    {/* Botón agregar */}
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!hayStockDisponible}
                        sx={{ my: { xs: 6 }, borderRadius: 999, px: 4 }}
                        onClick={handleAddToCart}
                    >
                        {!hayStockDisponible ? "Sin stock" : "Agregar al carrito"}
                    </Button>

                    {/* Descripción */}
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Comodidad y rendimiento
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Las {sneaker.modelo} están diseñadas para ofrecerte estilo y
                        rendimiento en todo momento. Con materiales de alta calidad y una
                        suela cómoda, son ideales tanto para el día a día como para
                        ocasiones especiales.
                    </Typography>
                </Grid>
            </Grid>

            {/* Dialog */}
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
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                    },
                }}
            >
                <DialogTitle>Confirmar compra</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Deseás agregar <strong>{sneaker.modelo}</strong> talle <strong>{selectedSize}</strong> al
                        carrito?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        onClick={confirmarAgregarCarrito}
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 999, px: 4 }}
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
                {/* Dialog de confirmación existente */}
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
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                        },
                    }}
                >
                    <DialogTitle>Confirmar compra</DialogTitle>
                    <DialogContent>
                        <Typography>
                            ¿Deseás agregar <strong>{sneaker.modelo}</strong> talle <strong>{selectedSize}</strong> al
                            carrito?
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center" }}>
                        <Button
                            onClick={confirmarAgregarCarrito}
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 999, px: 4 }}
                        >
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar para notificaciones */}
                <Snackbar
                    open={notificationOpen}
                    autoHideDuration={notificationSeverity === 'success' ? 2000 : 4000}
                    onClose={() => setNotificationOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setNotificationOpen(false)}
                        severity={notificationSeverity}
                        sx={{
                            width: '100%',
                            borderRadius: 2,
                            '& .MuiAlert-message': {
                                fontSize: '0.9rem',
                            },
                        }}
                    >
                        {notificationMessage}
                    </Alert>
                </Snackbar>


            {/* Información adicional */}
            <Box sx={{ mt: 8, width: "100%" }}>
                <Typography variant="h5" gutterBottom sx={{ fontFamily: "Inter" }}>
                    Información adicional
                </Typography>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant='h6' sx={{ fontFamily: "Inter", fontSize: { xs: '15px', md: '18px' } }}>
                            Cambios y devoluciones
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body1" sx={{ fontFamily: "Inter", fontSize: { xs: '15px' } }}>
                            Podés cambiar o devolver cualquier producto en un plazo de 30 días, siempre que esté en
                            condiciones originales.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant='h6' sx={{ fontFamily: "Inter", fontSize: { xs: '15px', md: '18px' } }}>
                            Métodos de pago
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body1" sx={{ fontFamily: "Inter", fontSize: { xs: '15px' } }}>
                            Aceptamos tarjetas de crédito, débito, MercadoPago y transferencia bancaria.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant='h6' sx={{ fontFamily: "Inter", fontSize: { xs: '15px', md: '18px' } }}>
                            Envíos
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body1" sx={{ fontFamily: "Inter", fontSize: { xs: '15px' } }}>
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
                    {loadingRecomendados ? (
                        [...Array(6)].map((_, index) => (
                            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={index}>
                                <Box sx={{ textAlign: "center" }}>
                                    <Skeleton
                                        variant="rectangular"
                                        width="100%"
                                        sx={{
                                            aspectRatio: "1",
                                            mb: 1,
                                            borderRadius: 1
                                        }}
                                    />
                                    <Skeleton variant="text" width="80%" />
                                    <Skeleton variant="text" width="60%" />
                                </Box>
                            </Grid>
                        ))
                    ) : productosRecomendados.length > 0 ? (
                        productosRecomendados.map((prod) => (
                            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={prod.sku}>
                                <ProductoRecomendado
                                    producto={prod}
                                    imagen={imagenesRecomendados[prod.sku]}
                                />
                            </Grid>
                        ))
                    ) : (
                        <Grid size={12}>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                No hay productos recomendados disponibles
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Grid>
    );
}