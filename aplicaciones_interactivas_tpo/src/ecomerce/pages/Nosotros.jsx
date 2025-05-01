import { Box, Divider, Grid, Typography } from '@mui/material';
import React from 'react'

export const Nosotros = () => {
    return (
        <Grid container
        sx={{
            margin: '0 auto',
            maxWidth: { xs: '300px', sm: '600px', md: '800px', lg: '1000px' },
        }}>
            <Box p={4}>
            {/* Introducción */}
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Sobre Nosotros
            </Typography>
            <Typography variant="body1" mb={3}>
                Somos una tienda especializada en calzado urbano y deportivo, dedicada a ofrecer las últimas tendencias en sneakers para los amantes de la moda y la cultura streetwear. Nuestra misión es conectar a las personas con productos auténticos, exclusivos y de alta calidad.
            </Typography>
        
            <Divider sx={{ my: 4 }} />
        
            {/* Historia */}
            <Typography variant="h5" gutterBottom fontWeight="bold">
                Nuestra historia
            </Typography>
            <Typography variant="body1" mb={3}>
                Comenzamos como un pequeño emprendimiento entre amigos apasionados por las zapatillas. Lo que nació como un hobby en ferias y redes sociales, hoy se transformó en una tienda consolidada con presencia online y cientos de clientes en todo el país. Nuestro compromiso con la autenticidad, el buen servicio y las marcas más deseadas nos posicionó como una de las tiendas referentes en el mundo sneaker local.
            </Typography>
        
            <Divider sx={{ my: 4 }} />
        
            {/* Contacto */}
            <Typography variant="h5" gutterBottom fontWeight="bold">
                Contacto
            </Typography>
            <Typography variant="body1">
                📍 Dirección: Av. Siempre Viva 123, Buenos Aires, Argentina
                <br />
                📞 Teléfono: +54 11 1234 5678
                <br />
                📧 Email: contacto@sneakerstore.com
                <br />
                🕒 Horarios: Lunes a Viernes de 10 a 19 hs
            </Typography>
            </Box>
        </Grid>
    );
    }
