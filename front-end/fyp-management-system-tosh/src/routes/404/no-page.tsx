import anime from 'animejs/lib/anime.es.js';
import { useEffect } from "react";
import Navbar from '../../components/landing_page/navbar';
import image from "../../assets/images/placeholder.jpeg";



const url = window.location.href;


const Custom404 = () => {
    useEffect(() => {
        anime({
            targets: '.content *',
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
                backgroundColor: "var(--SparesIndigo)",
                height:'100vh',
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                padding: "0 1rem",
            }
        }>
            <Navbar />
            <div className='content'>
                <img style={
                    {
                        aspectRatio: "1/1",
                        width: "100%",
                    }
                } src={image} alt="" />
                <h1>404</h1>
                <p>The URL {url} does not exist</p>
                <p>Click <a href="/" style={{color:"white"}}>here</a> to go back to the home page</p>
            </div>
        </div>
    )
}

export default Custom404;