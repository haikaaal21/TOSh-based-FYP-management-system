import React, { ChangeEvent } from 'react';

interface InputItemProps {
    type: string;
    htmlFor: string;
    id: string;
    placeholder: string;
    label: string;
    value: any;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputItem: React.FC<InputItemProps> = ({ type, htmlFor, id, placeholder, label, onChange, value }) => {
    return (
        <div className="inputItem">
            <label htmlFor={htmlFor}>{label}</label>
            <input type={type} name={htmlFor} id={id} value={value} placeholder={placeholder} onChange={onChange} />
        </div>
    );
};

export default InputItem;
