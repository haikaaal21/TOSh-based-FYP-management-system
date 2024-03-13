import { useEffect, useState } from "react";
import SparesLogoFull from "../../components/svgcomponents/spares_logo_full";
import image from '../../assets/images/placeholder.jpeg';
import Stage1 from "../../components/register/Stage1";
import Stage2 from "../../components/register/Stage2";
import './register_style.css';
import { Container, Grid } from "@mui/material";
import Stage3 from "../../components/register/Stage3";
import { motion } from "framer-motion";

function RegisterPage() {
    /**
     * TODO:
     * 3. Custom Validator hooks of all fields
     * 4. API Submit creation
     * 5. Make the University field fetch the uni data from API
     */
    useEffect(() => {
        document.title = "Get Started";
    })

    const [stage, setStage] = useState(1);

    useEffect(() => {
        document.getElementById(`bar-${stage}`)?.classList.add('activeBar');
        if(stage === 1) {
            document.getElementById('bar-2')?.classList.remove('activeBar');
            document.getElementById('bar-3')?.classList.remove('activeBar');
        }
    },[stage]);

    return(
        <motion.div 
        id="register" 
        initial={{translateY:10 ,opacity:0 }} 
        animate={{translateY:0,  opacity:1, 
            transition: { ease: "easeOut" } }} 
        exit={{ opacity: 0 }}>
            <Container sx={{padding:6}} fixed>
                <Grid container spacing={2}>
                    <Grid sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }} item xs={12} md={6}> 
                        <Grid container spacing={2}>
                            <Grid item md={4} xs={12}>
                                <SparesLogoFull />
                            </Grid>
                            <Grid item md={4} xs={0}>
                            </Grid>
                        </Grid>
                        <h1 style={{
                            width: "100%",
                            fontSize: "3rem",
                            fontWeight: 600,
                            textAlign: "left"
                        }}>Get Started</h1>
                        <p className="lefty">
                            Already have an account?&nbsp;
                            <a href="/login">
                                Sign in here
                            </a>
                        </p>
                        <div style={
                            {
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                padding: "1rem 0"
                            }
                        }>
                            <div id="bar-1" className="bar"></div>
                            <div id="bar-2" className="bar"></div>
                            <div id="bar-3" className="bar"></div>
                        </div>
                        <form action="" autoComplete="false" autoCorrect="false">
                            {stage === 1 && <Stage1 setStage={setStage}  />}
                            {stage === 2 && <Stage2 setStage={setStage}/>}
                            {stage === 3 && <Stage3 />}
                        </form>
                    </Grid>
                    <Grid
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            "@media (max-width: 600px)": {
                                display: "none"
                            }
                        }}
                        item
                        xs={12}
                        md={6}
                    >
                        <img style={{
                            aspectRatio: "3/4",
                            width: "80%",
                            borderRadius: "20px"
                        
                        }} src={image} alt="" />
                    </Grid>
                </Grid>
            </Container>
        </motion.div>
    )
}

export default RegisterPage;