import { useContext } from "react";
import { Alert, Button, Grid, TextField } from "@mui/material"
import { AuthLayout } from "../layout"
import { Link } from "react-router-dom";
import { useForm } from "../hooks";
import { AuthContext } from "../context/AuthContext";
import { types } from "../types/types";

const formDate = {
    mail: '',
    contraseña: ''
}

export const LoginPage = () => {
    const { formState, onInputChange } = useForm( formDate );
    const { mail, contraseña } = formState;
    const { dispatch, authState, login } = useContext(AuthContext);
    const { errorMessageLogin } = authState;

    const onSubmitButton = async( event ) => {
        event.preventDefault();

        const result = await login({ mail, contraseña });
        
        if (!result.ok){
            return dispatch({ 
                type: types.error, 
                payload: { errorMessageLogin: result.errorMessage } 
            });
        }
    }

    return (
        <AuthLayout title="INICIAR SESION">
            <form onSubmit={onSubmitButton}>
                <Grid container spacing={2} direction="column">
                    <Grid sx={{ mt: 1 }}>
                        <TextField 
                            label="Correo Electronico" 
                            placeholder="nombre@correo.com"
                            variant="outlined"
                            fullWidth
                            name="mail"
                            type="mail"
                            onChange={onInputChange}
                            value={mail}
                        />
                    </Grid>
                    <Grid>
                        <TextField 
                            label="Contraseña" 
                            type="password"
                            variant="outlined"
                            fullWidth
                            name="contraseña"
                            onChange={onInputChange}
                            value={contraseña}
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

                    {
                        errorMessageLogin && (
                            <Grid container sx={{ mt: 1 }}>
                                <Grid width={ '100%' }>
                                    <Alert severity='error'>{ errorMessageLogin }</Alert>
                                </Grid>
                            </Grid>
                        )
                    }

                    <Grid>
                        <Button
                            LinkComponent={Link}
                            to="/auth/register"
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
                </Grid>
            </form>
        </AuthLayout>
    );
}
