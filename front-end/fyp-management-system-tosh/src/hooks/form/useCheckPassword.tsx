import { FormValues } from '../../types/FormValues';

export const useCheckPassword = () => {
  const errors = {} as FormValues;

  function checkPassword(password: string, confirmPassword: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_])[a-zA-Z\d!@#$%^&*_]{8,}$/;
    if (!regex.test(password)) {
      errors.password =
        'Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 number';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    } else {
      return {} as FormValues;
    }
    return errors;
  }

  return { checkPassword };
};
