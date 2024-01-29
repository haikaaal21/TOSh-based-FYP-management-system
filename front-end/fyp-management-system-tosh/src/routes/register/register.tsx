import { useEffect, useState } from "react";
import SparesLogoFull from "../../components/svgcomponents/spares_logo_full";
import image from '../../assets/images/placeholder.jpeg';
import './register_style.css';
import InputItem from "../../components/inputItem";
import '../basic-formcss.css';

function RegisterPage() {
    const [stage, setStage] = useState(1);

    function nextStage() {
        if(stage === 3) return;
        setStage(stage + 1);
        
        //! DEBUG PURPOSES, REMOVE ON PUBLISH
        console.log(stage);
    }

    function prevStage() {
        if(stage === 1) return;
        setStage(stage - 1);

        //! DEBUG PURPOSES, REMOVE ON PUBLISH
        console.log(stage);
    }

    useEffect(() => {
        const bar1 = document.getElementById("bar-1");
        const bar2 = document.getElementById("bar-2");
        const bar3 = document.getElementById("bar-3");
        const form1 = document.getElementById("form-group-1");
        const form2 = document.getElementById("form-group-2");
        const form3 = document.getElementById("form-group-3");
        if(stage === 1) {
            bar1?.style.setProperty("background-color", "var(--SparesPurple)");
            bar2?.style.setProperty("background-color", "Grey");
            form1?.style.setProperty("display", "block");
            form2?.style.setProperty("display", "none");
            form3?.style.setProperty("display", "none");
        } else if(stage === 2) {
            bar2?.style.setProperty("background-color", "var(--SparesPurple)");
            form1?.style.setProperty("display", "none");
            form2?.style.setProperty("display", "block");
            form3?.style.setProperty("display", "none");
        } else if(stage === 3) {
            bar3?.style.setProperty("background-color", "var(--SparesPurple)");
            form1?.style.setProperty("display", "none");
            form2?.style.setProperty("display", "none");
            form3?.style.setProperty("display", "block");
        }
    }, [stage])
    

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
                    <p>Already have an account? <a href="/login">Click here to get login.</a></p>
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
                                <button type="button" onClick={nextStage}>Next</button>
                            </div>
                        </div>
                        <div id="form-group-2">
                            <h3>Dropdown Button Here</h3>
                            <InputItem label="Matric Number" type="number" htmlFor="matricNumb" id="matricNumb" placeholder="000000" />
                            <p style={{fontWeight:"600", fontSize:"12pt", textAlign:"left", marginLeft:"12pt"}}>Type of Account</p>
                            <div style={{display:"flex", alignItems:"center", justifyContent:"space-evenly"}}>
                                <div>
                                    <input type="radio" name="typeOfAccount" id="student" />
                                    <label htmlFor="student">Student</label>
                                </div>
                                <div>
                                    <input type="radio" name="typeOfAccount" id="staff" />
                                    <label htmlFor="staff">Staff</label>
                                </div>
                            </div>
                            <p style={{fontWeight:"600", fontSize:"12pt", textAlign:"left", marginLeft:"12pt"}}>Type of Staff</p>
                            <div style={{display:"flex", alignItems:"center", justifyContent:"space-evenly"}}>
                                <div>
                                    <input type="radio" name="typeOfStaff" id="supervisor" />
                                    <label htmlFor="supervisor">Supervisor</label>
                                </div>
                                <div>
                                    <input type="radio" name="typeOfStaff" id="coordinator" />
                                    <label htmlFor="supervisor">Coodinator</label>
                                </div>
                            </div>
                            <div style={{padding: "1rem 1rem", display:"flex"}}> 
                                <button style={{backgroundColor:"gray"}} type="button" onClick={prevStage}>Back</button>
                                <button type="button" onClick={nextStage}>Submit</button>
                            </div>
                        </div>
                        <div id="form-group-3">
                            <div style={{padding: "1rem 1rem"}}> 
                                <img src="" alt="TestImg"  />
                                <button >Back to Home</button>
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
                        maxHeight: '800px',
                        borderRadius: '10px'
                    }} src={image} alt="Test-Image" />
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;
