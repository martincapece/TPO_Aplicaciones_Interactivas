import { Image } from '@mui/icons-material';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { React,useEffect } from 'react'
import { useLocation } from "react-router-dom";

export const Nosotros = () => {
    const location = useLocation();
    useEffect(() => {
        if (location.hash) {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
            setTimeout(() => {
            const yOffset = -100; // altura aproximada de tu navbar
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
            }, 60);
        }
        }
    }, [location]);

    return (
        <Grid container
        sx={{
            margin: '0 auto',
            maxWidth: { xs: '300px', sm: '600px', md: '800px', lg: '1000px' },
        }}>
            <Box p={4}>
                <img src="/assets/subtitulo.webp" width={"100%"}></img>
            </Box>
            <Box p={4}>
            {/* Introducción */}
            <Typography variant="h4" gutterBottom fontWeight="bold" id="quienes-somos">
                Sobre Nosotros
            </Typography>
            <Typography variant="h6" mb={3}>
                En SAPÁH nos dedicamos a ofrecer lo mejor del calzado urbano con un enfoque especial en la cultura sneaker. Nos apasiona la innovación, el diseño y la autenticidad. Desde los modelos clásicos hasta las colaboraciones más exclusivas, buscamos acercar a nuestros clientes a una experiencia de compra única.
            </Typography>
            <Typography variant="h6" mb={3}>
                Nuestra tienda online se diseñó para que cada amante de las zapatillas pueda acceder fácilmente a sus modelos favoritos. Ya seas coleccionista, fanático de la moda o simplemente estés buscando comodidad con estilo, en SAPÁH vas a encontrar algo para vos.
            </Typography>

            <Divider sx={{ my: 10 }} />

            {/* Historia */}
            <Typography variant="h5" gutterBottom fontWeight="bold" id="historia">
                Nuestra historia
            </Typography>
            <Typography variant="h6" mb={3}>
                SAPÁH nació en 2020, en plena pandemia, como una respuesta a una necesidad: acceder a zapatillas auténticas, bien curadas y con atención personalizada. Todo comenzó en una habitación, con apenas unos pares, pero con una visión clara: democratizar el acceso al calzado premium.
            </Typography>
            <Typography variant="h6" mb={3}>
                A lo largo del tiempo fuimos creciendo gracias al apoyo de una comunidad fiel. Abrimos nuestro primer local en 2022 y hoy contamos con un espacio físico y una tienda online que recibe visitas de todo el país. Nos movemos al ritmo de las tendencias, pero con raíces bien firmes en la calidad y el trato humano.
            </Typography>
            <Typography variant="h6" mb={3}>
                Desde eventos pop-up, colaboraciones con artistas urbanos, hasta asesorías personalizadas: cada paso que damos está impulsado por el deseo de construir algo más que una tienda. Queremos ser parte del estilo de vida de quienes pisan fuerte.
            </Typography>

            <Divider sx={{ my: 10 }} />

            {/* Contacto */}
            <Typography variant="h5" gutterBottom fontWeight="bold" id="contacto">
                Contacto
            </Typography>
            <Typography variant="h6" mb={2}>
                Si tenés dudas, querés colaborar con nosotros o simplemente necesitás ayuda con tu compra, podés contactarnos por los siguientes medios:
            </Typography>
            <Typography variant="h6">
                📍 <strong>Dirección:</strong> Av. Siempre Viva 123, Buenos Aires, Argentina
                <br />
                📞 <strong>Teléfono:</strong> +54 11 1234 5678
                <br />
                📧 <strong>Email:</strong> contacto@sapah.com
                <br />
                🕒 <strong>Horarios:</strong> Lunes a Viernes de 10 a 19 hs
            </Typography>
            <Typography variant="h6" mt={10} mb={2} fontWeight="bold">
                Encontranos acá:
                </Typography>

                <Box
                    component="iframe"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.2472973926736!2d-58.38593478421847!3d-34.61953618045745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac7f1e0b1d1%3A0x4bb20202b62480d0!2sUADE!5e0!3m2!1ses!2sar!4v1684523121234!5m2!1ses!2sar"
                    width="100%"
                    sx={{
                        height: {
                          xs: 300,  // altura en mobile
                          md: 600   // altura en desktop
                        },
                        border: 0,
                        borderRadius: 2,
                    }}
                    style={{ border: 0, borderRadius: 10 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </Box>
        </Grid>
    );
    }
