import { useEffect, useReducer } from "react";
import { authReducer } from "./authReducer";
import { AuthContext } from "./AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import { types } from "../types/types";
import { FirebaseAuth } from "../../firebase/config";

export const AuthProvider = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, { logged: false, user: null, checking: false });

    useEffect(() => {
        dispatch({ type: types.checking });
        
        const unsubscribe = onAuthStateChanged(FirebaseAuth, async(user) => {
            if (!user) {
                dispatch({ type: types.logout });
                return;
            }

            const role = (user.email === 'administrador@apis.com') ? 'admin' : 'user';

            dispatch({
                type: types.login,
                payload: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    role
                }
            });
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ authState, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
