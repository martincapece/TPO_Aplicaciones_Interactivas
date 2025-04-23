import { Typography } from "@mui/material"

export const Destacados = () => {
    return (
        <>
            <Typography 
            variant="h2"
            sx={{
                fontSize: '45px',
                fontFamily: 'Inter',
                fontWeight: 800,
                mt: 10
            }}
            >
                DESTACADOS
            </Typography>
            
            {/* TRAER DATA PARA MOSTRAR DESTACADOS => habria que mapearlos (data.map( () => {} )) */}
        </>
    )
}
