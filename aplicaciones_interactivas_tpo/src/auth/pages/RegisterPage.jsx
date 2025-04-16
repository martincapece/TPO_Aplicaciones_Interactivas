import { Button, Grid, TextField } from "@mui/material"
import { Apple, Facebook, Google } from '@mui/icons-material';
import { AuthLayout } from "../layout"

export const RegisterPage = () => {
    
    
    return (
        <AuthLayout title={'CREAR CUENTA'}>
            <form>
                <Grid container spacing={ 2 } direction="column">
                    <Grid sx={{ mt: 1 }}>
                        <TextField 
                            label="Nombre Completo" 
                            placeholder="Jeremias Fernandez"
                            variant="outlined"
                            fullWidth
                            name="name"
                            type="text"
                            // onChange={}
                        />
                    </Grid>
                    <Grid>
                        <TextField 
                            label="Usuario" 
                            placeholder="Jerefer22"
                            variant="outlined"
                            fullWidth
                            name="displayName"
                            type="text"
                            // onChange={}
                        />
                    </Grid>
                    <Grid>
                        <TextField 
                            label="Correo Electronico" 
                            variant="outlined"
                            placeholder="nombre@correo.com"
                            fullWidth
                            autoComplete="undefined"
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
                            YA TENGO CUENTA
                        </Button>
                    </Grid>
                    <Grid 
                        container 
                        spacing={ 0 } 
                        direction="row"
                        justifyContent="space-around"
                        columnSpacing={{ xs: 1 }}
                    >
                        <Grid>
                            <Button
                            fullWidth
                            sx={{
                                fontFamily: 'Inter',
                                fontWeight: 500,
                                color: 'black',
                                outline: 1,
                                p: 1,
                            }}
                            >
                                <Facebook sx={{paddingX: 3, fontSize: 30 }} />
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
                            }}
                            >
                                <Apple sx={{paddingX: 3, fontSize: 30 }} />
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
                            }}
                            >
                                <Google sx={{paddingX: 3, fontSize: 30 }} />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    )
}
