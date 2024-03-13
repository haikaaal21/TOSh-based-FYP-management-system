import { FormValues } from "../../types/FormValues";

export const useCheckPassword = () => {
    let errors = {} as FormValues;

    function checkPassword(password: string, confirmPassword: string) {
        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
        if (!regex.test(password)) {
            errors.password = "Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number";
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        return errors;
    }

    return { checkPassword };
}