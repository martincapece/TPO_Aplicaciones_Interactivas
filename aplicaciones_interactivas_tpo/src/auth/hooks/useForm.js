import { useEffect, useState } from "react";

export const useForm = ( initialForm = {}, formValidations = {} ) => {
    
    const [formState, setFormState] = useState( initialForm );
    const [formValidation, setFormValidations] = useState({});

    useEffect(() => {
        setFormState( initialForm );
    }, [ initialForm ]);
    
    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value
        });
    }

    return {
        formState,
        onInputChange
    }
}
