import styled from "styled-components";
import SparesLogoFull from "../svgcomponents/spares_logo_full";
import SparesFilledButton from "../SparesFilledButton";
import * as Unicons from '@iconscout/react-unicons';

//!! Make the Props!!

const CustomNav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    padding: 0% 5%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

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

const CustomA = styled.a`
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

const CustomHeader = styled.header`
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
        <CustomHeader>
        <CustomNav id="mobile">
            <CustomA href="/" >
                    <SparesLogoFull fill2="white" fill="white" />
            </CustomA>
            <button onClick={openNav}>
                <Unicons.UilBars size="30" color="white" />
            </button>
        </CustomNav>
        <CustomNav id="web">
            <CustomA href="/" >
                <SparesLogoFull fill2="white" fill="white" />
            </CustomA>
            <ul
                style={{
                    display: "flex",
                    listStyleType: "none",
                    justifyContent: "space-around",
                    padding: "0 2rem",
                }}
            >
                <li>
                    <a href="/#about">
                        About
                    </a>
                </li>
                <li>
                    <a href="/#hall-of-shame">
                        Hall of Shame
                    </a>
                </li>
                <li>
                    <a href="/#contact">
                        Contact
                    </a>
                </li>
            </ul>
            <div>
                <SparesFilledButton
                    text="Get Started"
                    clickFunct={() => console.log("Clicked")}
                    color="var(--SparesPurple)"
                    backgroundColor="white"
                />
            </div>
        </CustomNav>
        </CustomHeader>
    );
};

export default Navbar;