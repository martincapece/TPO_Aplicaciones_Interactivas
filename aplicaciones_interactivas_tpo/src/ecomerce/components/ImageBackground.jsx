import { Button, Grid, Typography } from "@mui/material"
import portada from "../assets/home/portada.png"

export const ImageBackground = ({ title, subtitle }) => {
    return (
        <Grid 
        container
        direction="column"
        justifyContent="center"
        alignItems= "center"
        sx={{ 
            backgroundImage: `url(${portada})`, 
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh" 
        }}
        >
            <Grid
            textAlign='center'
            >
                <Typography 
                variant="h1"
                sx={{
                    color: 'white',
                    fontWeight: '700',
                    fontFamily: 'Inter',
                    mb: 2
                }}
                >
                    { title }
                </Typography>
                <Button
                fullWidth
                sx={{
                    maxWidth: '60%',
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    py: 2,
                    color: 'black',
                }}
                >
                    <Typography
                    sx={{
                        fontSize: '40px',
                        fontFamily: 'Inter',
                        fontWeight: 700
                    }}
                    >
                        { subtitle }
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    )
}
