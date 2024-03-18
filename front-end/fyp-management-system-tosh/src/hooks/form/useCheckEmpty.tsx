import { FormValues } from "../../types/FormValues";

export const useCheckEmpty = () => {
    let errors = {} as FormValues;
    
    function checkEmpty(initialValues: FormValues) {
        for (const key in initialValues) {
            if (initialValues[key] === '' || initialValues[key] === null) {
                errors[key] = "This field cannot be empty";
            } else if(initialValues[key].length <3){
                errors[key] = "This field must be at least 3 characters long";
            }
        }
        return errors;
    }

    return { checkEmpty };
};