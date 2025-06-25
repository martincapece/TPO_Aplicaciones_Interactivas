import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useCart } from "../../Cart/hooks/useCart";
import { Link, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../../auth/context/index.js";
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
    Skeleton
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';

export function SneakerPage() {
    const {id} = useParams();
    const location = useLocation();
    const {authState} = useContext(AuthContext);
    const {token} = authState.user;

    // Estados principales
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedStock, setSelectedStock] = useState(0);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [sneaker, setSneaker] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Estados para imágenes
    const [imagenes, setImagenes] = useState([]);
    const [loadingImagenes, setLoadingImagenes] = useState(true);

    // Estados para talles
    const [talles, setTalles] = useState([]);
    const [loadingTalles, setLoadingTalles] = useState(true);

    // Estados para productos recomendados
    const [productosRecomendados, setProductosRecomendados] = useState([]);
    const [imagenesRecomendados, setImagenesRecomendados] = useState({});
    const [loadingRecomendados, setLoadingRecomendados] = useState(true);

    // Estados de carga
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {addProduct} = useCart();

    // Función optimizada para obtener datos principales en paralelo
    const fetchDatosIniciales = useCallback(async () => {
        if (!id || !token) return;

        try {
            setLoading(true);

            // Ejecutar todas las llamadas principales en paralelo
            const [productoResponse, imagenesResponse, tallesResponse] = await Promise.allSettled([
                fetch(`http://localhost:8080/sapah/productos/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }),
                fetch(`http://localhost:8080/api/imagenes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }),
                fetch(`http://localhost:8080/sapah/productos-talles/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
            ]);

            // Procesar respuesta del producto
            if (productoResponse.status === 'fulfilled' && productoResponse.value.ok) {
                const productoData = await productoResponse.value.json();
                setSneaker(productoData);

                // Inmediatamente obtener productos recomendados
                fetchProductosRecomendados(productoData.marca);
            } else {
                throw new Error("Error al obtener el producto");
            }

            // Procesar respuesta de imágenes
            if (imagenesResponse.status === 'fulfilled' && imagenesResponse.value.ok) {
                const imagenesData = await imagenesResponse.value.json();
                setImagenes(imagenesData);

                // Establecer imagen principal
                const imagenPrincipal = imagenesData.find(img => img.esPrincipal);
                if (imagenPrincipal) {
                    setCurrentPhoto(imagenPrincipal.cloudinarySecureUrl);
                } else if (imagenesData.length > 0) {
                    setCurrentPhoto(imagenesData[0].cloudinarySecureUrl);
                }
            }
            setLoadingImagenes(false);

            // Procesar respuesta de talles
            if (tallesResponse.status === 'fulfilled' && tallesResponse.value.ok) {
                const tallesData = await tallesResponse.value.json();
                setTalles(tallesData);
            }
            setLoadingTalles(false);

        } catch (err) {
            setError(err.message);
            console.error("Error al cargar datos:", err);
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    // Función optimizada para productos recomendados con lazy loading
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
            const recomendados = data.filter(prod => prod.sku.toString() !== id).slice(0, 6);
            setProductosRecomendados(recomendados);
            setLoadingRecomendados(false);

            // Cargar imágenes después de mostrar los productos (lazy loading real)
            if (recomendados.length > 0) {
                // Cargar imágenes de manera diferida y por lotes
                const batchSize = 2; // Cargar de 2 en 2
                const batches = [];

                for (let i = 0; i < recomendados.length; i += batchSize) {
                    batches.push(recomendados.slice(i, i + batchSize));
                }

                // Procesar lotes secuencialmente para no sobrecargar
                for (const batch of batches) {
                    const batchPromises = batch.map(async (producto) => {
                        try {
                            const imgResponse = await fetch(`http://localhost:8080/api/imagenes/${producto.sku}/principal`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                }
                            });

                            if (imgResponse.ok) {
                                const imgData = await imgResponse.json();
                                return {sku: producto.sku, url: imgData.cloudinarySecureUrl};
                            }
                            return {sku: producto.sku, url: null};
                        } catch (err) {
                            console.error(`Error al cargar imagen para SKU ${producto.sku}:`, err);
                            return {sku: producto.sku, url: null};
                        }
                    });

                    const batchResults = await Promise.allSettled(batchPromises);

                    // Actualizar estado por lotes
                    setImagenesRecomendados(prev => {
                        const newImages = {...prev};
                        batchResults.forEach((result) => {
                            if (result.status === 'fulfilled' && result.value) {
                                newImages[result.value.sku] = result.value.url;
                            }
                        });
                        return newImages;
                    });

                    // Pequeña pausa entre lotes para mejor UX
                    if (batches.indexOf(batch) < batches.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
            }
        } catch (err) {
            console.error("Error al cargar productos recomendados:", err);
            setLoadingRecomendados(false);
        }
    }, [token, id]);

    // Effect principal optimizado
    useEffect(() => {
        fetchDatosIniciales();
    }, [fetchDatosIniciales]);

    // Effect para scroll al top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id, location.pathname]);

    // Effect para actualizar stock (memoizado)
    useEffect(() => {
        if (selectedSize && talles.length > 0) {
            const talleSeleccionado = talles.find(t => t.talle.numero.toString() === selectedSize.toString());
            setSelectedStock(talleSeleccionado ? talleSeleccionado.stock : 0);
        } else {
            setSelectedStock(0);
        }
    }, [selectedSize, talles]);

    // Funciones memoizadas
    const getTallesDisponibles = useMemo(() => {
        return talles.map(t => ({
            numero: t.talle.numero,
            stock: t.stock,
            id: t.talle.id
        }));
    }, [talles]);

    const hayStockDisponible = useMemo(() => {
        return talles.some(t => t.stock > 0);
    }, [talles]);

    // Función para manejar click en imagen
    const handleImageClick = useCallback((imageUrl) => {
        setCurrentPhoto(imageUrl);
    }, []);

    // Función para manejar agregar al carrito
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

    // Función para confirmar agregar al carrito
    const confirmarAgregarCarrito = useCallback(() => {
        const talleSeleccionado = talles.find(t => t.talle.numero.toString() === selectedSize.toString());

        addProduct({
            sku: sneaker.sku,
            modelo: sneaker.modelo,
            marca: sneaker.marca,
            precio: sneaker.precio,
            image: currentPhoto,
            size: selectedSize,
            stock: selectedStock,
            talleId: talleSeleccionado?.talle?.id
        });
        setDialogOpen(false);

        Swal.fire({
            title: "¡Agregado!",
            text: "El producto se agregó correctamente al carrito",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
    }, [talles, sneaker, currentPhoto, selectedSize, selectedStock, addProduct]);

    // Componente para imagen con lazy loading mejorado
    const LazyImage = ({src, alt, onClick, ...props}) => {
        const [loaded, setLoaded] = useState(false);
        const [error, setError] = useState(false);
        const [imageSrc, setImageSrc] = useState(null);

        useEffect(() => {
            if (src) {
                setImageSrc(src);
                setLoaded(false);
                setError(false);
            }
        }, [src]);

        const handleImageLoad = () => {
            setLoaded(true);
        };

        const handleImageError = () => {
            setError(true);
            setLoaded(true);
        };

        return (
            <Box sx={{position: 'relative', ...props.sx}} onClick={onClick}>
                {!loaded && (
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        sx={{
                            position: loaded ? 'absolute' : 'static',
                            top: 0,
                            left: 0,
                            borderRadius: props.sx?.borderRadius || 0
                        }}
                    />
                )}
                {imageSrc && !error && (
                    <Box
                        component="img"
                        src={imageSrc}
                        alt={alt}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        loading="lazy"
                        sx={{
                            ...props.sx,
                            opacity: loaded && !error ? 1 : 0,
                            transition: 'opacity 0.3s ease-in-out',
                            position: loaded ? 'static' : 'absolute',
                            top: 0,
                            left: 0
                        }}
                    />
                )}
                {error && loaded && (
                    <Box
                        sx={{
                            ...props.sx,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f5f5f5',
                            color: '#999'
                        }}
                    >
                        <Typography variant="caption">Sin imagen</Typography>
                    </Box>
                )}
            </Box>
        );
    };

    // Componente para producto recomendado con manejo de click optimizado
    const ProductoRecomendado = ({producto, imagen}) => {
        const handleClick = useCallback((e) => {
            e.preventDefault();
            // Limpiar estados antes de navegar
            setSneaker(null);
            setImagenes([]);
            setTalles([]);
            setProductosRecomendados([]);
            setImagenesRecomendados({});
            setSelectedSize("");
            setCurrentPhoto(null);

            // Navegar después de limpiar
            setTimeout(() => {
                window.location.href = `/producto/${producto.sku}`;
            }, 50);
        }, [producto.sku]);

        return (
            <Box
                onClick={handleClick}
                sx={{
                    textAlign: "center",
                    cursor: 'pointer',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.2s ease-in-out'
                    }
                }}
            >
                <LazyImage
                    src={imagen}
                    alt={producto.modelo}
                    sx={{
                        width: "100%",
                        maxWidth: {xs: 250, sm: 180},
                        mb: 1,
                        aspectRatio: "1",
                        objectFit: "contain",
                        borderRadius: 1
                    }}
                />
                <Typography variant="body1" sx={{fontWeight: 500}}>
                    {producto.modelo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    ${producto.precio?.toLocaleString('es-AR')}
                </Typography>
            </Box>
        );
    };

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh'}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error || !sneaker) {
        return (
            <Typography variant="h6" sx={{textAlign: 'center', mt: 10}}>
                {error || "Producto no encontrado"}
            </Typography>
        );
    }

    return (
        <Grid
            container
            sx={{
                margin: '0 auto',
                maxWidth: {xs: '300px', sm: '500px', md: '900px', lg: '1200px'}
            }}
        >
            <Grid
                container
                spacing={4}
                direction='row'
                justifyContent='space-between'
                sx={{my: 10}}
            >
                {/* Sección de imágenes */}
                <Grid size={{xs: 12, md: 6}}>
                    <Box sx={{maxWidth: 550, width: "100%"}}>
                        {/* Imagen principal */}
                        <Box
                            sx={{
                                width: "100%",
                                aspectRatio: "1",
                                backgroundColor: "#ffff",
                                borderRadius: 2,
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {loadingImagenes ? (
                                <Skeleton variant="rectangular" width="100%" height="100%"/>
                            ) : currentPhoto ? (
                                <LazyImage
                                    src={currentPhoto}
                                    alt={sneaker.modelo}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            ) : (
                                <Typography>Sin imagen</Typography>
                            )}
                        </Box>

                        {/* Miniaturas */}
                        {imagenes.length > 1 && (
                            <Box sx={{display: "flex", gap: 1, mt: 2, flexWrap: "wrap"}}>
                                {imagenes.map((img, index) => (
                                    <LazyImage
                                        key={img.id}
                                        src={img.cloudinarySecureUrl}
                                        onClick={() => handleImageClick(img.cloudinarySecureUrl)}
                                        alt={`${sneaker.modelo} - ${index + 1}`}
                                        sx={{
                                            width: {xs: 50, sm: 60},
                                            height: {xs: 50, sm: 60},
                                            objectFit: "cover",
                                            borderRadius: 1,
                                            border: currentPhoto === img.cloudinarySecureUrl ? "2px solid black" : "1px solid #ccc",
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
                <Grid size={{xs: 12, md: 6}}>
                    <Typography variant="h3"
                                sx={{fontFamily: "Inter", fontSize: {xs: '30px', md: '45px'}, fontWeight: "bold"}}>
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

                        {loadingTalles ? (
                            <Box sx={{display: 'flex', gap: 1.5, flexWrap: 'wrap'}}>
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} variant="rectangular" width={55} height={55}
                                              sx={{borderRadius: '12px'}}/>
                                ))}
                            </Box>
                        ) : (
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
                                {getTallesDisponibles.map((talleInfo) => {
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
                        )}

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
                        sx={{my: {xs: 6}, borderRadius: 999, px: 4}}
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

            {/* Dialog Confirmar Agregar al Carrito */}
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
                <DialogActions sx={{justifyContent: "center"}}>
                    <Button
                        onClick={confirmarAgregarCarrito}
                        variant="contained"
                        color="primary"
                        sx={{borderRadius: 999, px: 4}}
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Información adicional */}
            <Box sx={{mt: 8, width: "100%"}}>
                <Typography variant="h5" gutterBottom sx={{fontFamily: "Inter"}}>
                    Información adicional
                </Typography>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant='h6' sx={{fontFamily: "Inter", fontSize: {xs: '15px', md: '18px'}}}>
                            Cambios y devoluciones
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body1" sx={{fontFamily: "Inter", fontSize: {xs: '15px'}}}>
                            Podés cambiar o devolver cualquier producto en un plazo de 30 días, siempre que esté en
                            condiciones originales.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant='h6' sx={{fontFamily: "Inter", fontSize: {xs: '15px', md: '18px'}}}>
                            Métodos de pago
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body1" sx={{fontFamily: "Inter", fontSize: {xs: '15px'}}}>
                            Aceptamos tarjetas de crédito, débito, MercadoPago y transferencia bancaria.
                        </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography variant='h6' sx={{fontFamily: "Inter", fontSize: {xs: '15px', md: '18px'}}}>
                            Envíos
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body1" sx={{fontFamily: "Inter", fontSize: {xs: '15px'}}}>
                            Envío gratuito a todo el país en compras mayores a $50.000. Despacho en 24 horas.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* Productos recomendados */}
            <Box sx={{width: "100%", my: 15}}>
                <Typography variant="h5" mb={2}>
                    Te recomendamos
                </Typography>
                <Grid container spacing={2}>
                    {loadingRecomendados ? (
                        // Skeletons para productos recomendados
                        [...Array(6)].map((_, index) => (
                            <Grid size={{sm: 4, md: 2}} width='100%' key={index}>
                                <Box sx={{textAlign: "center"}}>
                                    <Skeleton
                                        variant="rectangular"
                                        width="100%"
                                        sx={{
                                            maxWidth: {xs: 250, sm: 180},
                                            aspectRatio: "1",
                                            mb: 1
                                        }}
                                    />
                                    <Skeleton variant="text" width="80%"/>
                                    <Skeleton variant="text" width="60%"/>
                                </Box>
                            </Grid>
                        ))
                    ) : productosRecomendados.length > 0 ? (
                        productosRecomendados.map((prod) => (
                            <Grid size={{sm: 4, md: 2}} width='100%' key={prod.sku}>
                                <ProductoRecomendado
                                    producto={prod}
                                    imagen={imagenesRecomendados[prod.sku]}
                                />
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ml: 2}}>
                            No hay productos recomendados disponibles
                        </Typography>
                    )}
                </Grid>
            </Box>
        </Grid>
    );
}