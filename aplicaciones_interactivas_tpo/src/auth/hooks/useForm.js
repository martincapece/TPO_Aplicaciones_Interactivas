import { useState } from "react";

export const useForm = ( initialForm = {}, formValidations = {} ) => {
    
    const [formState, setFormState] = useState( initialForm );
    const [formValidations, setFormValidations] = useState({});

    return (
        <>
        
        </>
    )
}
