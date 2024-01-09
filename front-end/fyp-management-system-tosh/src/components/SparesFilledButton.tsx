import styled from "styled-components";

interface ButtonProps {
    text: string;
    clickFunct: () => void;
    disabled?: boolean;
    className?: string;
    color?: string;
    backgroundColor?: string;
}


const SparesFilledButton = ({ text, clickFunct, disabled, className, color, backgroundColor }: ButtonProps) => {
    
    const StyledButton = styled.button<ButtonProps>`
    font-size: 0.9rem;
    font-family: 'Inter', sans-serif;
    padding: 0.5rem 1rem;
    color: ${color};
    background-color: ${backgroundColor};
    transition: 0.3s ease-out;
    border: none;
    &:hover {
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.25);
    }

    $:active {
        background-color: var(--DarkBlue);
        color: white;
    }
    `;

    return (
        <StyledButton 
            text={text}
            clickFunct={clickFunct}
            disabled={disabled}
            className={className}
        >
            {text}
        </StyledButton>
    )
}

export default SparesFilledButton;
