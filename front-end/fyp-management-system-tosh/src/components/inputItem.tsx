import React from 'react';

interface InputItemProps {
    type: string;
    htmlFor: string;
    id: string;
    placeholder: string;
    label: string;
}

const InputItem: React.FC<InputItemProps> = ({ type, htmlFor, id, placeholder, label }) => {
    return (
        <div className="inputItem">
            <label htmlFor={htmlFor}>{label}</label>
            <input type={type} name={htmlFor} id={id} placeholder={placeholder} />
        </div>
    );
};

export default InputItem;
