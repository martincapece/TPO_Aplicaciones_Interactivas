
import { Box, Card, CardContent, CardMedia, Grid, Skeleton, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import imgNotFound from "../../../assets/imgNotFound.jpg"
import { ProductosContext } from "../context/ProductosContext";

export const SneakerCard = ({ sku, modelo, marca, color, precio, descripcion, sizes, image, nuevo }) => {
    const navigate = useNavigate()

    // Obtener datos del contexto (¡súper rápido porque ya están cargados!)
    const { getTallesPorSku, getImagenPrincipalPorSku, loading } = useContext(ProductosContext)

    const productoTalles = getTallesPorSku(sku)
    const imagenPrincipal = getImagenPrincipalPorSku(sku)
    const sinStock = productoTalles.length > 0 && productoTalles.every((t) => t.stock === 0)

    // Determinar si mostrar skeleton o imagen
    const mostrarSkeleton = loading || !imagenPrincipal
    const imagenParaMostrar = imagenPrincipal?.cloudinarySecureUrl || imgNotFound

    return (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        '& .MuiCardMedia-root': {
                            transform: 'scale(1.1)',
                            transition: 'transform 0.3s ease-in-out'
                        }
                    }
                }}
                onClick={() => navigate(`/producto/${sku}`)}
            >
                <Box
                    sx={{
                        overflow: "hidden",
                        position: "relative",
                        width: "100%",
                        paddingTop: "100%", // Esto crea un cuadrado perfecto (aspect-ratio 1:1)
                    }}
                >
                    {mostrarSkeleton ? (
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                borderRadius: 0,
                                animation: 'pulse 1.5s ease-in-out infinite',
                                '@keyframes pulse': {
                                    '0%': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                    '50%': {
                                        backgroundColor: '#e0e0e0',
                                    },
                                    '100%': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                },
                            }}
                        />
                    ) : (
                        <CardMedia
                            component="img"
                            alt={modelo}
                            image={imagenParaMostrar}
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                backgroundColor: "#f5f5f5",
                                transform: "scale(1.0)",
                                transition: "transform 0.3s ease-in-out",
                            }}
                        />
                    )}
                </Box>

                <CardContent sx={{ height: "175px" }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {nuevo && (
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f65454',
                                border: '1px solid #ff7e7e',
                                padding: '2px 6px'
                            }}>
                                <Typography sx={{
                                    color: '#ffffff',
                                    fontFamily: 'Inter',
                                    fontWeight: 700,
                                    fontStyle: 'italic',
                                    fontSize: 12,
                                }}>
                                    NEW IN
                                </Typography>
                            </Box>
                        )}

                        {sinStock && (
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#999999',
                                border: '1px solid #cccccc',
                                padding: '2px 6px',
                            }}>
                                <Typography sx={{
                                    color: '#ffffff',
                                    fontFamily: 'Inter',
                                    fontWeight: 700,
                                    fontStyle: 'italic',
                                    fontSize: 12,
                                }}>
                                    SIN STOCK
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2px 6px',
                        mb: nuevo || sinStock ? 0.5 : 3
                    }}>
                        <Typography sx={{
                            color: '#ffffff',
                            fontFamily: 'Inter',
                            fontWeight: 700,
                            fontStyle: 'italic',
                            fontSize: 12,
                        }}>
                        </Typography>
                    </Box>

                    {/* Mostrar skeleton para el texto también si está cargando */}
                    {mostrarSkeleton ? (
                        <Box>
                            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="50%" height={28} />
                        </Box>
                    ) : (
                        <>
                            <Typography gutterBottom variant="h5">${precio}</Typography>
                            <Typography gutterBottom variant="h6">{modelo}</Typography>
                            <Typography variant="h6" sx={{ color: '#C0C0C0' }}>{marca}</Typography>
                        </>
                    )}
                </CardContent>
            </Card>
        </Grid>
    );
};