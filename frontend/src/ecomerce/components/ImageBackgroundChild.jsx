import { Button, Grid, Typography } from "@mui/material"
import { Link } from 'react-router-dom';

export const ImageBackgroundChild = ({ title = '', subtitle = '', url=''}) => {
    // Función para ajustar el tamaño del texto según la longitud del título
    const getTitleFontSize = (title) => {
        const length = title.length;
        if (length <= 4) {
            // Títulos cortos como "Nike", "Vans"
            return { xs: '45px', sm: '55px', md: '65px', lg: '75px' };
        } else if (length <= 6) {
            // Títulos medianos como "Jordan", "Adidas"
            return { xs: '40px', sm: '50px', md: '60px', lg: '70px' };
        } else {
            // Títulos largos
            return { xs: '35px', sm: '45px', md: '55px', lg: '65px' };
        }
    };

    return (
        <Grid 
        container
        direction="column"
        justifyContent="center"
        alignItems= "center"
        sx={{ 
            backgroundImage: `url(${url})`, 
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: { xs: '300px', sm: '400px', md: '500px', lg: '600px' },
            width: '100%',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.3)', // Overlay sutil para mejor legibilidad
                zIndex: 1
            }
        }}
        >
            <Grid
            textAlign='center'
            sx={{ zIndex: 2, position: 'relative', px: 2 }}
            >
                <Typography 
                variant="h1"
                sx={{
                    color: 'white',
                    fontSize: getTitleFontSize(title),
                    fontWeight: 700,
                    fontFamily: 'Inter',
                    mb: { xs: 1, md: 2 },
                    textShadow: '2px 2px 4px rgba(0,0,0,0.7)', // Sombra para mejor legibilidad
                    lineHeight: 1.1,
                    wordBreak: 'keep-all', // Evita que se rompa la palabra
                    whiteSpace: 'nowrap' // Mantiene el texto en una línea
                }}
                >
                    { title }
                </Typography>
                <Button
                component={Link}
                to="/catalogo"
                fullWidth
                sx={{
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    py: { xs: 1.5, md: 2 },
                    px: { xs: 2, md: 3 },
                    color: 'black',
                    maxWidth: { xs: '200px', sm: '250px', md: '300px' },
                    borderRadius: '8px',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.3s ease'
                }}
                >
                    <Typography
                    sx={{
                        fontSize: { xs: '16px', sm: '20px', md: '24px', lg: '28px' },
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        textTransform: 'none' // Evita que se ponga en mayúsculas automáticamente
                    }}
                    >
                        { subtitle }
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    )
}
