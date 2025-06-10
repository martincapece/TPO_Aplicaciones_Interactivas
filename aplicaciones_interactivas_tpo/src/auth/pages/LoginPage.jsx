import { useContext } from "react";
import { Button, Grid, TextField } from "@mui/material"
import { Facebook, Twitter, Google } from '@mui/icons-material';
import { AuthLayout } from "../layout"
import { Link } from "react-router-dom";
import { useForm } from "../hooks";
import { AuthContext } from "../context/AuthContext";
import { loginWithEmailPassword, singInWithFacebook, singInWithGoogle } from "../../firebase/providers";

const formDate = {
    email: '',
    password: ''
}

export const LoginPage = () => {

    const { formState, onInputChange } = useForm( formDate );
    const { email, password } = formState;
    const { dispatch } = useContext(AuthContext);
    
    const facebookSignIn = async() => {
        const result = await singInWithFacebook( dispatch );

        if (!result.ok){
            console.warn(result.errorMessage);
            return;
        }

        console.log("logeado")
    }

    const twitterSignIn = () => {}

    const googleSignIn = async() => {
        const result = await singInWithGoogle( dispatch );

        if (!result.ok){
            console.warn(result.errorMessage);
            return;
        }
    }

    const onSubmitButton = async( event ) => {
        event.preventDefault();

        const result = await loginWithEmailPassword({ email, password }, dispatch);

        if (!result.ok){
            console.warn(result.errorMessage);
            return;
        }
    }

    return (
        <AuthLayout title={ "INICIAR SESION" }>
            <form onSubmit={ onSubmitButton } >
                <Grid container spacing={ 2 } direction="column">
                    <Grid sx={{ mt: 1 }}>
                        <TextField 
                            label="Correo Electronico" 
                            placeholder="nombre@correo.com"
                            variant="outlined"
                            fullWidth
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
                        to="/auth/register"
                        type="submit"
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
                        <Grid>
                            <Button
                            fullWidth
                            xs={ 4 }
                            onClick={ facebookSignIn }
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
                            onClick={ twitterSignIn }
                            disabled
                            sx={{
                                fontFamily: 'Inter',
                                fontWeight: 500,
                                color: 'black',
                                outline: 1,
                                p: { xs: 1, md: 2},
                            }}
                            >
                                <Twitter sx={{paddingX: { xs: 3, sm: 7, md: 10}, fontSize: { xs: 30, md: 35} }} />
                            </Button>
                        </Grid>
                        <Grid>
                            <Button
                            fullWidth
                            xs={ 4 }
                            onClick={ googleSignIn }
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
