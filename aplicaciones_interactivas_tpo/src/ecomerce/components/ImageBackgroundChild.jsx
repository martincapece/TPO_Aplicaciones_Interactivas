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
            height: "600px",
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
                    fontSize: '70px',
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
                        fontSize: '30px',
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
