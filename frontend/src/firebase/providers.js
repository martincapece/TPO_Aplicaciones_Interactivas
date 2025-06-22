import { FirebaseAuth } from "./config";
import { types } from "../auth/types/types";

export const logoutFirebase = async( dispatch ) => {
    await FirebaseAuth.signOut();

    dispatch({ type: types.logout });

    // borra cosas no relacionadas al auth
    localStorage.removeItem('cart');
    
}