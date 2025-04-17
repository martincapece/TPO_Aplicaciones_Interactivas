import { Button, Grid, TextField } from "@mui/material"
import { Apple, Facebook, Google } from '@mui/icons-material';
import { AuthLayout } from "../layout"
import { Link } from "react-router-dom";
import { useForm } from "../hooks";

const formDate = {
    name: '',
    username: '',
    email: '',
    password: ''
}

export const RegisterPage = () => {
    
    const { name, username, email, password, onInputChange } = useForm( formDate );
    
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
                            onChange={ onInputChange }
                            value={ name }
                        />
                    </Grid>
                    <Grid>
                        <TextField 
                            label="Usuario" 
                            placeholder="Jerefer22"
                            variant="outlined"
                            fullWidth
                            name="username"
                            type="text"
                            onChange={ onInputChange }
                            value={ username }
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
                            onChange={ onInputChange }
                            value={ email }
                        />
                    </Grid>
                    <Grid>
                        <TextField 
                            label="Contraseña" 
                            type="password"
                            variant="outlined"
                            fullWidth
                            name="password"
                            onChange={ onInputChange }
                            value={ password }
                        />
                    </Grid>
                    <Grid>
                        <Button
                        fullWidth
                        type="submit"
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
                        LinkComponent={Link}
                        to="/auth/login"
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
                        justifyContent="space-between"
                        columnSpacing={{ xs: 1 }}
                    >
                        <Grid>
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
                        <Grid>
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
                        <Grid>
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
