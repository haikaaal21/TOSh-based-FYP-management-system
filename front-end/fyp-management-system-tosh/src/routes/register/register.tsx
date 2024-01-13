import { useEffect } from "react";
import SparesLogoFull from "../../components/svgcomponents/spares_logo_full";
import image from '../../assets/images/placeholder.jpeg';
import './register_style.css';
import InputItem from "../../components/inputItem";
import '../basic-formcss.css';

let stage = 1;


function registerPage() {
    useEffect(() => {
        if(stage == 1) {
            document.getElementById("bar-1")?.style.setProperty("background-color", "var(--SparesIndigo)");
            document.getElementById("form-group-2")?.style.setProperty("display", "none");
            document.getElementById("form-group-3")?.style.setProperty("display", "none");
        } else if(stage == 2) {
            document.getElementById("bar-1")?.style.setProperty("background-color", "var(--SparesIndigo)");
            document.getElementById("bar-2")?.style.setProperty("background-color", "var(--SparesIndigo)");
            document.getElementById("form-group-1")?.style.setProperty("display", "none");
            document.getElementById("form-group-3")?.style.setProperty("display", "none");
        } else if(stage == 3) {
            document.getElementById("bar-1")?.style.setProperty("background-color", "var(--SparesIndigo)");
            document.getElementById("bar-2")?.style.setProperty("background-color", "var(--SparesIndigo)");
            document.getElementById("bar-3")?.style.setProperty("background-color", "var(--SparesIndigo)");
            document.getElementById("form-group-1")?.style.setProperty("display", "none");
            document.getElementById("form-group-2")?.style.setProperty("display", "none");
        }
    }, []);

    function nextStage() {
        stage++;
        console.log(stage);
    }

    function prevStage() {
        stage--;
        console.log(stage);
    }

    return (

        <div>
            <div className="register">
                <div className="item">
                    <div style={
                        {
                            width: "8em",
                        }
                    }>
                        <SparesLogoFull />
                    </div>
                    <h1>Get started</h1>
                    <p>Already have an account? <a href="/register">Click here to get login.</a></p>
                    <div className="progress-bar-reg">
                        <div className="bar" id="bar-1"></div>
                        <div className="bar" id="bar-2"></div>
                        <div className="bar" id="bar-3"></div>
                    </div>
                    <form action="">
                        <div id="form-group-1"> 
                            <div className="duo-item">
                                <InputItem label="First Name" type="text" htmlFor="firstName" id="firstName" placeholder="First Name" />
                                <InputItem label="Last Name" type="text" htmlFor="lastName" id="lastName" placeholder="Last Name" />
                            </div>
                            <InputItem label="Email" type="email" htmlFor="email" id="email" placeholder="Email" />
                            <InputItem label="Password" type="password" htmlFor="password" id="password" placeholder="Password" />
                            <InputItem label="Confirm Password" type="password" htmlFor="confirmPassword" id="confirmPassword" placeholder="Confirm Password" />
                            <InputItem label="Date of Birth" type="date" htmlFor="dob" id="dob" placeholder="Date of Birth" />
                            <div style={{padding: "1rem 1rem"}}> 
                            <button type="button">Next</button>
                             </div>
                        </div>
                        <div id="form-group-2">
                            <div style={{padding: "1rem 1rem", display:"flex"}}> 
                            <button style={{backgroundColor:"gray"}}>Back</button>
                            <button>Submit</button>
                            </div>
                        </div>
                        <div id="form-group-3">
                            <div style={{padding: "1rem 1rem"}}> 
                            <button>Back to Home</button>
                            </div>
                        </div>

                    </form>
                    <p>Forgot your password?</p>
                    <a href="/forgotPassword">Click here to reset your password</a>
                </div>
                <div className="item">
                <img style={{
                    aspectRatio: '3/4',
                    width: '80%',
                    borderRadius: '10px'
                }} src={image} alt="Test-Image" />
                </div>
            </div>
        </div>
    )
}

export default registerPage;