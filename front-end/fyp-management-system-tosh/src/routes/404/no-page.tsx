import styled from "styled-components";
import Navbar from "../../components/landing_page/navbar";
import anime from 'animejs/lib/anime.es.js';
import { useEffect } from "react";



const url = window.location.href;
const CustomSection = styled.section`
    background-color: var(--SparesPurple);
    color: white;
    display flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;

    h1 {
        font-size: 6rem;
    }
    
    @media screen and (min-width: 768px) {
        h1 {
            font-size: 8rem;
        }

    }

    p {
        max-width: 800px;
    }
    
`;

const Custom404 = () => {
    useEffect(() => {
        anime({
            targets: 'section *',
            opacity: [0, 1],
            translateY: [50, 0],
            delay: anime.stagger(100),
            easing: 'easeInOutQuad',
            duration: 2000,
        });
    }, []);

    return (
        <>
            <Navbar />
            <CustomSection>
                {/*Custom Image here*/}
                <h1>
                    <span>4</span>
                    <span>0</span>
                    <span>4</span>
                </h1>
                <h3>The URL you requested does not exist!</h3>
                <p>The URL you requested <i>{url}</i> does not exist, please double check whether there are any typos or misinputs </p>
            </CustomSection>
        </>
    )
}

export default Custom404;