import { Alert, Button, Grid, TextField } from "@mui/material"
import { AuthLayout } from "../layout"
import { Link } from "react-router-dom";
import { useForm } from "../hooks";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { types } from "../types/types";

const formDate = {
    nombreCompleto: '',
    usuario: '',
    mail: '',
    contraseña: ''
}

const formValidations = {
    nombreCompleto: [ 
        (value) => value.trim().length >= 10, 
        'El nombre completo debe tener al menos 10 caracteres.'
    ],
    usuario: [ 
        (value) => value.trim().length >= 4 && !value.includes(' '),
        'El nombre de usuario debe tener al menos 4 caracteres y no contener espacios.'
    ],
    mail: [ 
        (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        'El correo electrónico no es válido.'
    ],
    contraseña: [
        (value) => {
            const hasLength = value.length >= 8;
            const hasUpper = /[A-Z]/.test(value);
            const hasLower = /[a-z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
            return hasLength && hasUpper && hasLower && hasNumber && hasSpecial;
        },
        'Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.'
    ]
};


export const RegisterPage = () => {
    
    const { dispatch, authState, register } = useContext(AuthContext);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const { 
        onInputChange, formState, isFormValid, 
        nombreCompletoValid, usuarioValid, mailValid, contraseñaValid
    } = useForm( formDate, formValidations );

    const { nombreCompleto, usuario, mail, contraseña } = formState;
    const { errorMessageRegister } = authState;

    const onSubmitButton = async( event ) => {
        event.preventDefault();
        setFormSubmitted(true);
        
        if (!isFormValid) return;

        const result = await register({ nombreCompleto, usuario, mail, contraseña });

        if (!result.ok){
            return dispatch({ 
                type: types.error, 
                payload: { errorMessageRegister: result.errorMessage } 
            });
        }
    }

    return (
        <AuthLayout title={'CREAR CUENTA'}>
            <form onSubmit={ onSubmitButton }>
                <Grid container spacing={ 2 } direction="column">
                    <Grid sx={{ mt: 1 }}>
                        <TextField 
                            label="Nombre Completo" 
                            placeholder="Jeremias Fernandez"
                            variant="outlined"
                            fullWidth
                            name="nombreCompleto"
                            type="text"
                            onChange={ onInputChange }
                            value={ nombreCompleto }
                            error={ formSubmitted && !!nombreCompletoValid }
                            helperText={ nombreCompletoValid }
                        />
                    </Grid>
                    <Grid>
                        <TextField 
                            label="Usuario" 
                            placeholder="Jerefer22"
                            variant="outlined"
                            fullWidth
                            name="usuario"
                            type="text"
                            onChange={ onInputChange }
                            value={ usuario }
                            error={ formSubmitted && !!usuarioValid }
                            helperText={ usuarioValid }
                        />
                    </Grid>
                    <Grid>
                        <TextField 
                            label="Correo Electronico" 
                            variant="outlined"
                            placeholder="nombre@correo.com"
                            fullWidth
                            autoComplete="undefined"
                            name="mail"
                            type="mail"
                            onChange={ onInputChange }
                            value={ mail }
                            error={ formSubmitted && !!mailValid }
                            helperText={ mailValid }
                        />
                    </Grid>
                    <Grid>
                        <TextField 
                            label="Contraseña" 
                            type="contraseña"
                            variant="outlined"
                            fullWidth
                            name="contraseña"
                            onChange={ onInputChange }
                            value={ contraseña }
                            error={ formSubmitted && !!contraseñaValid }
                            helperText={ contraseñaValid }
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
                        errorMessageRegister && (
                            <Grid container sx={{ mt: 1 }}>
                                <Grid width={ '100%' }>
                                    <Alert severity='error'>{ errorMessageRegister }</Alert>
                                </Grid>
                            </Grid>
                        )
                    }

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
                </Grid>
            </form>
        </AuthLayout>
    )
}
