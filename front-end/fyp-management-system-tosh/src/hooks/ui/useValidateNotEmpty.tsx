import { useState } from 'react';

// ! Experimental hook, not yet used in landing page of the project
function useValidateNotEmpty(initialValue : any, inputFieldName : string) {
    const [formErrors, setFormErrors] = useState({} as string);
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState(false);

    function handleChange(e: any) {
        setValue(e.target.value);
        if(e.target.value === "") {
            setError(true);
            setFormErrors(`${inputFieldName} cannot be empty`);
        } else {
            setError(false);
            setFormErrors("");
        }
    }
    return { value, error, formErrors, handleChange };
}

export default useValidateNotEmpty;