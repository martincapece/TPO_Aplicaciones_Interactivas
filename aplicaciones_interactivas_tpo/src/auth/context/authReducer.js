import { types } from "../types/types";

export const authReducer = ( state = {}, action ) => {
    
    switch ( action.type ) {
        case types.checking:
            return {
                ...state,
                checking: true
            }

        case types.login:
            return {
                ...state,
                logged: true,
                user: action.payload,
                checking: false
            }

        case types.logout:
            return {
                logged: false,
                user: null,
                checking: false
            }

        default:
            return state;
    }
}
