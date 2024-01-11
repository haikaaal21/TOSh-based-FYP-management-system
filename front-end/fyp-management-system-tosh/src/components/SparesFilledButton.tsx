import styled from "styled-components";
import './component-css.css';

interface ButtonProps {
    text: string;
    clickFunct: () => void;
    disabled?: boolean;
    className?: string;
    color?: string;
    backgroundColor?: string;
}


const SparesFilledButton = ({ text, clickFunct, disabled, className, color, backgroundColor }: ButtonProps) => {
    
    //!! Refactor the CSS so it can be used globally
    const StyledButton = styled.button<ButtonProps>`

    color: ${color};
    background-color: ${backgroundColor};
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
