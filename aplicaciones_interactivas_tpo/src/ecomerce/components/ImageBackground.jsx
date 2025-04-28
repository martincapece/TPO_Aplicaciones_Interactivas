import { Button, Grid, Typography } from "@mui/material"
import portada from "/assets/portada.png"

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
                    fontSize: { xs: '40px', sm: '50px', md: '60px', lg: '100px' },
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
                        fontSize: { xs: '20px', sm: '25px', md: '30px', lg: '35px' },
                        fontFamily: 'Inter',
                        fontWeight: 700,
                    }}
                    >
                        { subtitle }
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    )
}
