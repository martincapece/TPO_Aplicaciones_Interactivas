import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";

export const FiltroLateral = () => {
    return (
        <Box
            sx={{
                position: 'sticky',
                top: 100,
                p: 2,
                borderRight: '1px solid #ddd',
                height: '100vh',
                minWidth: 200,
            }}
        >
            <Typography variant="h6" fontWeight="bold" mb={2}>
                FILTRAR POR
            </Typography>

            <FormControlLabel control={<Checkbox />} label="Hombre" />
            <FormControlLabel control={<Checkbox />} label="Mujer" />
            <FormControlLabel control={<Checkbox />} label="Niños" />

            <Typography variant="subtitle1" fontWeight="bold" mt={3}>
                Talles
            </Typography>
            <FormControlLabel control={<Checkbox />} label="38" />
            <FormControlLabel control={<Checkbox />} label="39" />
            <FormControlLabel control={<Checkbox />} label="40" />
        </Box>
    );
};
