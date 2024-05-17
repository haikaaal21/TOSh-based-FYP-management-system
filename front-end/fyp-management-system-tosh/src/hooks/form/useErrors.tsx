import { useState } from 'react';
import { FormValues } from '../../types/FormValues';

const useErrors = (initialValues: FormValues) => {
  const [errors, setErrors] = useState(initialValues);

  function resetErrors() {
    setErrors(initialValues);
  }

  return { errors, setErrors, resetErrors };
};

export default useErrors;
