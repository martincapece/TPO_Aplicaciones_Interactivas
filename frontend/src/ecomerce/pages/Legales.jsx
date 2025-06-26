import React from 'react'
import {
    Box,
    Typography,
    Divider,
    Grid,
    Container,
} from '@mui/material';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


export const Legales = () => {
    const location = useLocation();
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                const yOffset = -80;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: "smooth" });
                }, 100);
            }
        }
    }, [location]);

    return (
        
        <Grid container
        sx={{
            margin: '0 auto',
            maxWidth: { xs: '300px', sm: '600px', md: '800px', lg: '1000px' },
        }}>

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h3" gutterBottom fontWeight="bold" > 
                    Políticas Legales
                </Typography>

                {/* Título principal de la sección */}
                <Typography variant="h4" gutterBottom fontWeight="bold" id="envios">
                    ENVÍO GRATIS
                </Typography>
                <Typography variant="body1" paragraph>
                    Hacemos envíos a todo el país, excepto a las provincias de Misiones y Tierra del Fuego.
                </Typography>
                <Typography variant="body1" paragraph>
                    ¡Si tu compra es mayor a $255.000 el envío es Gratis! (Aplica para los envíos Estándar)
                </Typography>

                <Divider sx={{ my: 5 }} />

                {/* Título de la siguiente sección */}
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    PROMOCIONES BANCARIAS
                </Typography>
                <Typography variant="body1" paragraph>
                    2, 3 y 6 cuotas sin interés con todas las tarjetas de crédito bancarias.<br />
                    2, 3, 4, 5 y 6 cuotas sin interés con Banco Macro Visa o MasterCard.<br />
                    2, 3, 4 y 6 cuotas sin interés con Banco ICBC Visa o MasterCard.<br />
                    3, 6, 9 y 12 cuotas sin interés con Banco Nación Visa o MasterCard Gold, Platinum y Standard. Mastercard Black. (Exclusivo tienda online).<br />
                    3, 6 y 9 cuotas sin interés con Banco Santander Amex y Visa Women.<br />
                    2, 3 y 6 cuotas sin interés con Banco Galicia Visa o MasterCard.
                </Typography>

                

                {/* Título para la promoción especial */}
                <Typography mt={4} variant="h5" gutterBottom fontWeight="bold">
                    PROMOCIÓN 12 CUOTAS SIN INTERÉS
                </Typography>
                <Typography variant="body1" paragraph>
                    Promoción válida a partir del 24-04-2025 a las 00 hasta las 23.59 del mismo día.<br />
                    12 Cuotas sin interés con todos los bancos.<br />
                    Aplica únicamente para compras superiores a $200.000<br />
                    El envío gratis aplica únicamente para envíos Estándar y en nuestras tiendas SAPÁH habilitadas para retiro.
                </Typography>

                <Divider sx={{ my: 5 }} />

                {/* Términos y condiciones para el cupón Nike20 */}
                <Typography variant="h4" gutterBottom fontWeight="bold" id="terminos">
                    TÉRMINOS Y CONDICIONES CUPÓN SAPÁH20
                </Typography>
                <Typography variant="body1" paragraph>
                    Código válido por tiempo limitado sobre artículos seleccionados.<br />
                    Acumula con Oportunidades.<br />
                    Un sólo uso por usuario.<br />
                    Los productos adquiridos con el cupón SAPÁH 20 solamente aceptan devoluciones, no aceptan cambios en tiendas físicas.
                </Typography>

                <Divider sx={{ my: 5 }} />

                {/* Términos y condiciones para las promociones de Oportunidades */}
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    TÉRMINOS Y CONDICIONES OPORTUNIDADES
                </Typography>
                <Typography variant="body1" paragraph>
                    Promoción válida hasta agotar stock o el final de la promoción. Cualquiera que suceda primero.<br />
                    Promoción no acumulable con otras promociones.<br />
                    Los productos adquiridos en Oportunidades solamente aceptan devoluciones, no cambios en tiendas SAPÁH Store habilitadas.
                </Typography>

                <Divider sx={{ my: 5 }} />
                {/* Términos y condiciones para el cupón Nike10Comunidad */}
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    TÉRMINOS Y CONDICIONES CUPÓN DE COMUNIDAD SAPÁH - SAPÁH10COMUNIDAD
                </Typography>
                <Typography variant="body1" paragraph>
                    Promoción válida a través cupón por tiempo limitado sobre producto seleccionado.<br />
                    Uso exclusivo para primera compra.<br />
                    No aplica a Calzado o Accesorios.<br />
                    No aplica a colección San Lorenzo 2024<br />
                    No se pueden canjear una vez realizado el pedido.<br />
                    Acumula sobre los productos en Oportunidades.<br />
                    Un solo uso por usuario.
                </Typography>

                <Divider sx={{ my: 5 }} />

                {/* Términos y condiciones para los cupones de cumpleaños */}
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    TÉRMINOS Y CONDICIONES CUPÓN CUMPLEAÑOS ENERO
                </Typography>
                <Typography variant="body1" paragraph>
                    10% de reintegro en compras superiores a 120.000 pesos.<br />
                    Tope de reintegro 25.000 pesos.<br />
                    No acumula con productos en Sale.<br />
                    Un solo uso por email.<br />
                    Válido hasta 1/03.
                </Typography>

                <Typography mt={5} variant="h4" gutterBottom fontWeight="bold">
                    TÉRMINOS Y CONDICIONES CUPÓN CUMPLEAÑOS FEBRERO
                </Typography>
                <Typography variant="body1" paragraph>
                    10% de reintegro en compras superiores a 120.000 pesos.<br />
                    Tope de reintegro 25.000 pesos.<br />
                    No acumula con productos en Sale.<br />
                    Un solo uso por email.<br />
                    Válido hasta 1/04.
                </Typography>

                <Typography mt={5} variant="h4" gutterBottom fontWeight="bold">
                    TÉRMINOS Y CONDICIONES CUPÓN CUMPLEAÑOS MARZO
                </Typography>
                <Typography variant="body1" paragraph>
                    10% de reintegro en compras superiores a 120.000 pesos.<br />
                    Tope de reintegro 25.000 pesos.<br />
                    No acumula con productos en Sale.<br />
                    Un solo uso por email.<br />
                    Válido hasta 30/04.
                </Typography>

                <Typography mt={5} variant="h4" gutterBottom fontWeight="bold">
                    TÉRMINOS Y CONDICIONES CUPÓN CUMPLEAÑOS ABRIL
                </Typography>
                <Typography variant="body1" paragraph>
                    10% de reintegro en compras superiores a 120.000 pesos.<br />
                    Tope de reintegro 25.000 pesos.<br />
                    No acumula con productos en Sale.<br />
                    Un solo uso por email.<br />
                    Válido hasta 31/05.
                </Typography>

                <Divider sx={{ my: 5 }} />

                <Typography variant="h4" gutterBottom fontWeight="bold">
                    TÉRMINOS Y CONDICIONES “SPECIAL FRIDAY”
                </Typography>
                <Typography variant="body1" paragraph>
                    En Buenos Aires, a los 29 del mes de noviembre de 2024, SOUTHBAY S.R.L (CUIT 30-67815546-9), con domicilio en Av. del Libertador 2442, Piso 5to, Olivos, Provincia de Buenos Aires, Argentina y BRANDLIVE S.A. (CUIT 30-7070996436-0) con domicilio en Soler 5692, Oficina 302, Ciudad Autónoma de Buenos Aires, Argentina (en adelante, denominados los “ORGANIZADORES") han decidido realizar una promoción especial (en adelante, la "SPECIAL FRIDAY"), a través de su sitio web www.SAPÁH.com.ar (en adelante, el “Sitio Web”), a realizarse desde las 00hs hasta las 24hs del día 30 de noviembre de 2024, o hasta agotar stock de los productos dentro del “SPECIAL FRIDAY”.
                </Typography>

                <Divider sx={{ my: 5 }} />

                <Typography variant="h4" gutterBottom fontWeight="bold" id="devoluciones">
                    DEVOLUCIONES Y CAMBIOS
                </Typography>

                <Typography variant="body1" paragraph>
                    En SAPÁH queremos que estés 100% satisfecho con tu compra. Si necesitás hacer un cambio o devolución, tenés hasta 30 días desde la recepción del pedido.
                </Typography>

                <Typography variant="body1" paragraph>
                    Los productos deben estar en perfectas condiciones, sin uso y con el packaging original. Las devoluciones se gestionan a través de nuestro centro de atención o directamente desde tu cuenta si hiciste la compra online.
                </Typography>

                <Typography variant="body1" paragraph>
                    Los cambios en tiendas físicas están sujetos a disponibilidad y se realizan únicamente con comprobante de compra. En productos adquiridos con cupones, puede que apliquen restricciones de cambio.
                </Typography>

                <Typography variant="body1" paragraph>
                    Para más información, contactanos a <strong>contacto@sapah.com</strong> o por WhatsApp.
                </Typography>

                <Divider sx={{ my: 5 }} />

                {/* Sección de opciones de entrega */}
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    ¿CUÁLES SON LAS OPCIONES DE ENTREGA DE SAPÁH?
                </Typography>
                <Typography variant="body1" paragraph>
                    Hacemos envíos a todo el país, excepto a las provincias de Misiones y Tierra del Fuego.<br />
                    ¡Si tu compra es mayor a $255.000 el envío es totalmente gratis! (Aplica para los envíos Express y Estándar)
                </Typography>

                {/* Descripción de Pick Up Store */}
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Pick Up Store
                </Typography>
                <Typography variant="body1" paragraph>
                    ¡Ahora podes hacer la compra y retirar gratis desde el SAPÁH Store que elijas!<br />
                    Los plazos de entrega son de hasta 3 días hábiles y podrás retirar desde los stores habilitados:
                </Typography>

                {/* Descripción de métodos de envío */}
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Envío Same Day
                </Typography>
                <Typography variant="body1" paragraph>
                    Recibí en el mismo día comprando antes de las 11am. Las entregas se realizan de Lunes a Viernes entre las 15hs y 22hs.<br />
                    Podrás optar por este servicio si tu código postal es de CABA, Primer y segundo cordón de AMBA.
                </Typography>

                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Envío Express
                </Typography>
                <Typography variant="body1" paragraph>
                    CABA/GBA: Recibí en 24 hs hábiles tu pedido realizando la compra antes de las 14hs.<br />
                    Las entregas se realizan Lunes a Viernes de 9 a 21hs.
                </Typography>
                <Divider sx={{ my: 5 }} />
            </Container>
        </Grid>
    )
}
