import { useState } from 'react';
import dayjs from 'dayjs';

interface FormValues {
  [key: string]: any;
}

const useForm = (initialValues: FormValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e: any) => {
    e.target.id === ''
      ? setValues({ ...values, [e.target.name]: e.target.value })
      : setValues({ ...values, [e.target.id]: e.target.value });
  };

  const handleDateChange = (date: Date | null, id: string) => {
    const dayJsItem = dayjs(date);
    const formattedDate = dayJsItem.format('YYYY-MM-DD');
    setValues({ ...values, [id]: formattedDate });
  };

  const handleAutoCompleteChange = (e: any, newValue: string | null) => {
    const targetID = e.target.id.split('-')[0];
    setValues({ ...values, [targetID]: newValue });
  };

  return { values, handleChange, handleDateChange, handleAutoCompleteChange };
};

export default useForm;
