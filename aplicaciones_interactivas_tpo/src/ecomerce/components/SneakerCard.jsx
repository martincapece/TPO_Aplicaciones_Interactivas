import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";

export const SneakerCard = ({ id, price, model, brand, colors, sizes, image, new: isNew }) => {
    const navigate = useNavigate();

    return (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => navigate(`/producto/${id}`)}>
                <CardMedia component="img" alt={model} image={image[0]} />
                <CardContent sx={{ height: '175px' }}>

                    <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                    >
                        {isNew && (
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

                        {!sizes.some(size => size.stock > 0) && (
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#000',
                                border: '1px solidrgb(0, 0, 0)',
                                padding: '2px 6px'
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
                            mb: isNew || !sizes.some(size => size.stock > 0) ? 0.5 : 3
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

                    <Typography gutterBottom variant="h5">${price}</Typography>
                    <Typography gutterBottom variant="h6">{model}</Typography>
                    <Typography variant="h6" sx={{ color: '#C0C0C0' }}>{brand}</Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

