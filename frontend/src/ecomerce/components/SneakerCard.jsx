import { Box, Card, CardContent, CardMedia, Grid, Skeleton, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useGetImagenesPorSku } from "../hooks/useGetImagenesPorSku";
import { useState } from "react";

export const SneakerCard = ({ sku, modelo, marca, color, precio, descripcion, sizes, image, destacado }) => {
    const navigate = useNavigate();
    const { imagenes, loading } = useGetImagenesPorSku({ sku });
    const imagenPrincipal = imagenes.find((img) => img.esPrincipal);

    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

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
                <Box sx={{ overflow: 'hidden' }}>
                    {loading || !isLoaded || hasError ? (
                        <Skeleton variant="rectangular" width="100%" height="175px" />
                    ) : (
                        <CardMedia
                            component="img"
                            alt={modelo}
                            image={imagenPrincipal?.cloudinarySecureUrl}
                            onLoad={() => setIsLoaded(true)}
                            onError={() => setHasError(true)}
                            sx={{
                                height: 'auto',
                                width: '100%',
                                aspectRatio: '1/1',
                                objectFit: 'contain',
                                backgroundColor: '#f5f5f5',
                                transform: 'scale(1.0)',
                                transition: 'transform 0.3s ease-in-out'
                            }}
                        />
                    )}
                </Box>

                {/* Para asegurarnos que onLoad se dispare incluso cuando el fetch fue rápido */}
                {imagenPrincipal && !isLoaded && !hasError && (
                    <img
                        src={imagenPrincipal.cloudinaryUrl}
                        alt=""
                        style={{ display: "none" }}
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setHasError(true)}
                    />
                )}

                <CardContent sx={{ height: '175px' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {destacado && (
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
                    </Box>

                    <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2px 6px',
                        mb: destacado || !sizes.some(size => size.stock > 0) ? 0.5 : 3
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

                    <Typography gutterBottom variant="h5">${precio}</Typography>
                    <Typography gutterBottom variant="h6">{modelo}</Typography>
                    <Typography variant="h6" sx={{ color: '#C0C0C0' }}>{marca}</Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};
