import { FormValues } from '../../types/FormValues';

export const useCheckLength = () => {
  const errors = {} as FormValues;

  function checkLength(
    initialValues: FormValues,
    minChar: number,
    maxChar: number
  ) {
    for (const key in initialValues) {
      console.log(initialValues[key].length, minChar, maxChar);
      if (initialValues[key].length < minChar)
        errors[key] =
          'This field must be at least ' + minChar + ' characters long';
      if (initialValues[key].length > maxChar)
        errors[key] =
          'This field must be at most ' + maxChar + ' characters long';
    }
    return errors;
  }

  return { checkLength };
};
