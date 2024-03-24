import styled from 'styled-components'

interface inputProps {
    text: string
    disabled?: boolean
    className?: string
    type?: string
    name?: string
    id?: string
}

const InputStyle = styled.input<inputProps>`
    background-color: #ffff;
    box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.35);
    border: 0;
    margin: 15px 0px;
    padding: 15px 10px;
    color: #000000;
    width: 100%;
    border-radius: 5px;

    &:focus {
        outline: none;
    }
`
const InputBar = ({
    text,
    disabled,
    className,
    type,
    name,
    id,
}: inputProps) => {
    return (
        <>
            <label
                style={{
                    textAlign: 'left',
                }}
                htmlFor={name}
            >
                {text}
            </label>
            <InputStyle
                text={text}
                disabled={disabled}
                className={className}
                type={type}
                name={name}
                id={id}
            ></InputStyle>
        </>
    )
}

export default InputBar
