import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from "@mui/material"
import { dataDestacados } from '../data/dataDestacados'
import { useCart } from "../../Cart/hooks/useCart"
import { useNavigate } from "react-router-dom";

export const Destacados = () => {
    const { addProduct } = useCart();
    const navigate = useNavigate();

    return (
        <>
            <Typography variant="h2" id="destacados" sx={{ fontSize: '45px', fontFamily: 'Inter', fontWeight: 800, my: 10 }}>
                DESTACADOS
            </Typography>
            
            <Grid container spacing={2} direction="row">
                {dataDestacados.map(({ id, price, model, brand, colors, image }) => (
                    <Grid key={id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card sx={{ cursor: 'pointer' }} onClick={() => navigate(`/producto/${id}`)}>
                            <CardMedia component="img" alt={model} image={image[0]} />
                            <CardContent sx={{ height: '200px' }}>
                                <Box sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f65454',
                                    border: '1px solid #ff7e7e',
                                    padding: '2px 6px',
                                    mb: 2
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

                                <Typography gutterBottom variant="h5">${price}</Typography>
                                <Typography gutterBottom variant="h6">{model}</Typography>
                                <Typography variant="h6" sx={{ color: '#C0C0C0' }}>{brand}</Typography>
                                <Typography variant="h6" sx={{ color: '#C0C0C0' }}>{colors.length} colores</Typography>
                                
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};
