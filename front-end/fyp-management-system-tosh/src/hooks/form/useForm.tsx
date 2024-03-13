import { useState } from "react";
import dayjs from "dayjs";

interface FormValues{
    [key: string]: any;
}

const useForm = (initialValues : FormValues) => {
    const [values, setValues] = useState(initialValues);

    const handleChange = (e: any) => {
        setValues({...values, [e.target.id]: e.target.value});
        console.log(values);
    }

    const handleDateChange = (date: Date | null, id: string) => {
        const dayJsItem = dayjs(date);
        const formattedDate = dayJsItem.format('YYYY-MM-DD');
        setValues({...values, [id]: formattedDate});
    }

    return {values, handleChange, handleDateChange};
}

export default useForm;