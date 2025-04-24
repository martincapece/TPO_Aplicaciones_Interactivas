import { Button, Grid, Typography } from "@mui/material"

export const ImageBackgroundChild = ({ title = '', subtitle = '', url=''}) => {
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
            width: '100%'
        }}
        >
            <Grid
            textAlign='center'
            >
                <Typography 
                variant="h1"
                sx={{
                    color: 'white',
                    fontSize: { xs: '50px', md: '50px', lg: '70px' },
                    fontWeight: 700,
                    fontFamily: 'Inter',
                    mb: 2
                }}
                >
                    { title }
                </Typography>
                <Button
                fullWidth
                sx={{
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
                        fontWeight: 500
                    }}
                    >
                        { subtitle }
                    </Typography>
                </Button>
            </Grid>
        </Grid>
    )
}
