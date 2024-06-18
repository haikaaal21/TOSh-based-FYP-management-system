import { FormValues } from '../../types/FormValues';

export const useCheckEmail = () => {
  const errors = {} as FormValues;

  function checkEmail(valuesToCheck: FormValues) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    for (const key in valuesToCheck) {
      if (!regex.test(valuesToCheck[key])) {
        errors[key] = 'Invalid email';
      }
    }
    return errors;
  }

  return { checkEmail };
};
