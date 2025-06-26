import { useReducer } from "react";
import { authReducer } from "./authReducer";
import { AuthContext } from "./AuthContext";
import { types } from "../types/types";

export const AuthProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, { logged: false, user: null, checking: false, errorMessage: null });

    const login = async({ mail, contraseña }) => {
        try {
            console.log("Intentando iniciar sesión con:", { mail, contraseña });
            if (mail.trim().length <= 0 || contraseña.trim().length <= 0) {
                throw new Error("Los campos son obligatorios");
            }

            dispatch({ type: types.checking });
    
            const resp = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ mail, contraseña })
            });
            
            const data = await resp.json();
    
            if (!resp.ok) {
                throw new Error(data.message || "Error al iniciar sesión");
            }        

            dispatch({ 
                type: types.login, 
                payload: {
                    mail: mail,
                    contraseña: contraseña,
                    token: data.jwt,
                    idUsuario: data.idUsuario,
                    rol: data.role
                } 
            });
            
            return { ok: true };
            
        } catch (error) {
    
            return { 
                ok: false, 
                errorMessage: error.message 
            };
        }     

    }

    const register = async({ nombreCompleto, usuario, mail, contraseña }) => {
        try {
            if (nombreCompleto.trim().length <= 0 || usuario.trim().length <= 0 || mail.trim().length <= 0 || contraseña.trim().length <= 0) {
                throw new Error("Los campos son obligatorios");
            }

            dispatch({ type: types.checking });

            const resp = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombreCompleto, usuario, mail, contraseña })
            });

            if (!resp.ok) {
                const errorData = await resp.json();
                throw new Error(errorData.message || "Error al iniciar sesión");
            }

            login({ mail, contraseña });

        } catch (error) {
            
            return {
                ok: false,
                errorMessage: error.message
            }
        }
    }

    const logout = () => {
        dispatch({ type: 'logout' });
    }

    const setError = (errorMessage) => {
        dispatch({ type: 'error', payload: { errorMessage } });
    }

    return (
        <AuthContext.Provider 
        value={{ 
            authState, 
            dispatch, 
            login,
            register,
            logout,
            setError
        }}>
            {children}
        </AuthContext.Provider>
    );
};
