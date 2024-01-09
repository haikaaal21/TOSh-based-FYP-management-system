import styled from "styled-components";
import SparesLogoFull from "../svgcomponents/spares_logo_full";
import SparesFilledButton from "../SparesFilledButton";
import * as Unicons from '@iconscout/react-unicons';


const CustomNav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;

    li a {
        color: white;
        text-decoration: none;
        transition: 0.3s ease-in-out;
    }

    @media (min-width: 768px) {
        li a:hover {
            color: yellow;
            letter-spacing: 1.5px;
        }
    }

    ul li {
        padding: 0 1rem;
    }
`;

const CustomButton = styled.button`
    width: 120px;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover * {
        transition: 0.3s ease-out;
        fill: yellow;
    }
`;

const Header = styled.header`
    @media (max-width: 768px) {
        #web {
            display: none;
        }
    }

    @media (min-width: 768px) {

        #mobile {
            display: none;
        }
    }
`

//! Do this!
function openNav() {
    console.log("Opening Nav!");
    const mobileSideNav = document.getElementById("#mobile-sideNav");
    if (mobileSideNav) {
        mobileSideNav.style.height = "100%";
    }
}

const Navbar = () => {

    return (
        <Header>
        <CustomNav id="mobile">
            <CustomButton >
                    <SparesLogoFull fill2="white" fill="white" />
            </CustomButton>
            <button onClick={openNav}>
                <Unicons.UilBars size="30" color="white" />
            </button>
        </CustomNav>
        <CustomNav id="web">
            <CustomButton >
                <SparesLogoFull fill2="white" fill="white" />
            </CustomButton>
            <ul
                style={{
                    display: "flex",
                    listStyleType: "none",
                    justifyContent: "space-around",
                    padding: "0 2rem",
                }}
            >
                <li>
                    <a href="#about">
                        About
                    </a>
                </li>
                <li>
                    <a href="#hall-of-shame">
                        Hall of Shame
                    </a>
                </li>
                <li>
                    <a href="#contact">
                        Contact
                    </a>
                </li>
            </ul>
            <SparesFilledButton
                text="Get Started"
                clickFunct={() => console.log("Clicked")}
                color="var(--SparesPurple)"
                backgroundColor="white"
            />
        </CustomNav>
        </Header>
    );
};

export default Navbar;