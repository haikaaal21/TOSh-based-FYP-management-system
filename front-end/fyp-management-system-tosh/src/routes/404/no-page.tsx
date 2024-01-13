import anime from 'animejs/lib/anime.es.js';
import { useEffect } from "react";
import Navbar from '../../components/landing_page/navbar';



const url = window.location.href;


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
        <div style={
            {
                backgroundColor: '--var(SparesIndigo)',
                color: 'black',
            }
        }>
            <Navbar />
            <h1>404</h1>
            <p>The URL {url} does not exist</p>
            <p>Click <a href="/">here</a> to go back to the home page</p>
        </div>
    )
}

export default Custom404;