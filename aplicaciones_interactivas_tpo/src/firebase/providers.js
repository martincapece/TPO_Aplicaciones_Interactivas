import { createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, TwitterAuthProvider, updateCurrentUser } from "firebase/auth";
import { FirebaseAuth } from "./config";
import { types } from "../auth/types/types";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

export const loginWithEmailPassword = async({ email, password }, dispatch) => {
    try {
        const result = await signInWithEmailAndPassword(FirebaseAuth, email, password);
        const { uid, photoURL, displayName } = result.user;

        const user = { uid, photoURL, email, password, displayName };

        // Dispatch al reducer
        dispatch({ type: types.login, payload: user });

        // Guardar en LocalStorage
        localStorage.setItem('user', JSON.stringify(user));

        return { ok: true }
        
    } catch (error) {

        return {
            ok: false,
            errorMessage: error.message
        }
    }
}

export const registerUserWithEmailPassword = async({ name, displayName, email, password }, dispatch ) => {
    try {

        const resp = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
        const { uid, photoURL } = resp.user;

        const user = { uid, photoURL, displayName, email };

        dispatch({ type: types.login, payload: user });

        localStorage.setItem('user', JSON.stringify(user));
        
        await updateCurrentUser( FirebaseAuth.currentUser, { displayName } );

        return {
            ok: true,
            uid, photoURL, name, email, password
        }

    } catch (error) {
        
        return {
            ok: false,
            errorMessage: error.message
        }
    }
}

export const singInWithFacebook = async( dispatch ) => {
    try {
        const result = await signInWithPopup(FirebaseAuth, googleProvider);
        const { uid, photoURL, displayName, email } = result.user;
        
        const user = { uid, photoURL, displayName, email };
        
        dispatch({ type: types.login, payload: user });

        localStorage.setItem('user', JSON.stringify(user));

        return {
            ok: true,
            uid, photoURL, displayName, email
        }

    } catch (error) {
        
        return {
            ok: false,
            errorMessage: error.message
        }
    }
}

export const singInWithTwitter = async() => {
    try {
        const result = await signInWithPopup(FirebaseAuth, twitterProvider);
        const { uid, photoURL, displayName, email } = result.user;
        
        return {
            ok: true,
            uid, photoURL, displayName, email
        }

    } catch (error) {
        
        return {
            ok: false,
            errorMessage: error.message
        }
    }
}

export const singInWithGoogle = async( dispatch ) => {
    try {
        const result = await signInWithPopup(FirebaseAuth, googleProvider);
        const { uid, photoURL, displayName, email } = result.user;
        
        const user = { uid, photoURL, displayName, email };
        
        dispatch({ type: types.login, payload: user });

        localStorage.setItem('user', JSON.stringify(user));

        return {
            ok: true,
            uid, photoURL, displayName, email
        }

    } catch (error) {
        
        return {
            ok: false,
            errorMessage: error.message
        }
    }
}

export const logoutFirebase = async( dispatch ) => {
    const out = await FirebaseAuth.signOut();

    dispatch({ type: types.logout });

    localStorage.removeItem('user');
    
    return out 
}