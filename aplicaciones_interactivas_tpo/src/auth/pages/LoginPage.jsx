import { Button, Grid, TextField } from "@mui/material"
import { Apple, Facebook, Google } from '@mui/icons-material';
import { AuthLayout } from "../layout"

export const LoginPage = () => {


    return (
        <AuthLayout title={ "INICIAR SESION" }>
            <form>
                <Grid container spacing={ 2 } direction="column">
                    <Grid sx={{ mt: 1 }}>
                        <TextField 
                            label="Correo Electronico" 
                            placeholder="nombre@correo.com"
                            variant="outlined"
                            fullWidth
                            name="email"
                            type="email"
                            // onChange={}
                        />
                    </Grid>
                    <Grid>
                        <TextField 
                            label="Contraseña" 
                            type="password"
                            variant="outlined"
                            fullWidth
                            name="password"
                            // onChange={}
                        />
                    </Grid>
                    <Grid>
                        <Button
                        fullWidth
                        sx={{
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            background: 'black',
                            color: 'white',
                            p: 1,
                            mb: 2
                        }}
                        >
                            CONTINUAR
                        </Button>
                    </Grid>
                    
                    <Grid>
                        <Button
                        fullWidth
                        sx={{
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            color: 'black',
                            outline: 1,
                            p: 1,
                            mt: 3
                        }}
                        >
                            CREAR CUENTA
                        </Button>
                    </Grid>
                    <Grid 
                        container 
                        spacing={ 0 } 
                        direction="row"
                        justifyContent="space-between"
                        columnSpacing={{ xs: 1 }}
                    >
                        <Grid item>
                            <Button
                            fullWidth
                            xs={ 4 }
                            sx={{
                                fontFamily: 'Inter',
                                fontWeight: 500,
                                color: 'black',
                                outline: 1,
                                p: { xs: 1, md: 2},
                            }}
                            >
                                <Facebook sx={{paddingX: { xs: 3, sm: 7, md: 10}, fontSize: { xs: 30, md: 35} }} />
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                            fullWidth
                            xs={ 4 }
                            sx={{
                                fontFamily: 'Inter',
                                fontWeight: 500,
                                color: 'black',
                                outline: 1,
                                p: { xs: 1, md: 2},
                            }}
                            >
                                <Apple sx={{paddingX: { xs: 3, sm: 7, md: 10}, fontSize: { xs: 30, md: 35} }} />
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                            fullWidth
                            xs={ 4 }
                            sx={{
                                fontFamily: 'Inter',
                                fontWeight: 500,
                                color: 'black',
                                outline: 1,
                                p: { xs: 1, md: 2},
                            }}
                            >
                                <Google sx={{paddingX: { xs: 3, sm: 7, md: 10}, fontSize: { xs: 30, md: 35} }} />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    )
}
