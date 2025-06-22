import { types } from "../types/types";

export const authReducer = (state = {}, action) => {
    switch (action.type) {
        case types.checking:
            return {
                ...state,
                checking: true,
                errorMessage: null
            };

        case types.login:
            return {
                ...state,
                logged: true,
                user: action.payload,
                checking: false,
                errorMessage: null
            };

        case types.logout:
            return {
                logged: false,
                user: null,
                checking: false,
                errorMessage: null
            };
        
        case types.error:
            return {
                ...state,
                checking: false,
                errorMessageLogin: action.payload.errorMessageLogin || null,
                errorMessageRegister: action.payload.errorMessageRegister || null
            };

        default:
            return state;
    }
    };