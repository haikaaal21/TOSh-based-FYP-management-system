import { useEffect, useState } from "react";
import SparesLogoFull from "../../components/svgcomponents/spares_logo_full";
import image from '../../assets/images/placeholder.jpeg';
import './register_style.css';
import InputItem from "../../components/landing_page/inputItem";
import '../basic-formcss.css';

function RegisterPage() {

    const [stage, setStage] = useState(1);
    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        dob: "",
        institution: "",
        matricNumb: "",
        typeOfAccount: "",
        typeOfStaff: ""
    });
    const [formErrors, setFormErrors] = useState({} as {[key: string]: string});

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
    }, [stage]);

    const handleChange = (event:any) => {
        console.log(event.target);
        const { name, value } = event.target;
        setValues({...values, [name]: value});
    }
    

    const validatePhase1 = (values:any) => {
        let errors = {} as {[key: string]: string};
        if(values.firstName === "") {
            errors.firstName = "First Name is required";
        }
        if(values.lastName === "") {
            errors.lastName = "Last Name is required";
        }
        if(values.email === "") {
            errors.email = "Email is required";
        }
        if(values.password === "") {
            errors.password = "Password is required";
        }
        if(values.confirmPassword === "") {
            errors.confirmPassword = "Confirm Password is required";
        }
        if(values.dob === "") {
            errors.dob = "Date of Birth is required";
        }
        setFormErrors(errors);
    }
    
    const changeState = (event:any) => {
        validatePhase1(values);
        console.log(formErrors);
        if(Object.keys(formErrors).length === 0) {
            nextStage();
        }
    }

    return (
        <div>
            <div className="register">
                <div className="item">
                    <div className="flex justify-center align-middle" style={
                        {
                            width: "25em",
                        }
                    }>
                        <SparesLogoFull className="m-4 h-[3rem] "/>
                    </div>
                    <h1 className="font-bold text-2xl">Get started</h1>
                    <p>Already have an account? <a href="/login">Click here to get login.</a></p>
                    <div className="progress-bar-reg">
                        <div className="bar" id="bar-1"></div>
                        <div className="bar" id="bar-2"></div>
                        <div className="bar" id="bar-3"></div>
                    </div>
                    <form action="">
                        <div id="form-group-1"> 
                            <div className="duo-item">
                                <InputItem value={values.firstName} onChange={handleChange} label="First Name" type="text" htmlFor="firstName" id="firstName" placeholder="First Name" />
                                <InputItem value={values.lastName} onChange={handleChange} label="Last Name" type="text" htmlFor="lastName" id="lastName" placeholder="Last Name" />
                            </div>
                            <p className="text-left px-4 text-red-600 text-sm">{formErrors.errors}</p>
                            <InputItem value={values.email} onChange={handleChange} label="Email" type="email" htmlFor="email" id="email" placeholder="Email" />
                            {/* <p className="text-left px-4 text-red-600 text-sm">{formErrors.errors}</p> */}
                            <InputItem value={values.password} onChange={handleChange} label="Password" type="password" htmlFor="password" id="password" placeholder="Password" />
                            {/* <p className="text-left px-4 text-red-600 text-sm">{formErrors.errors}</p> */}
                            <InputItem value={values.confirmPassword} onChange={handleChange} label="Confirm Password" type="password" htmlFor="confirmPassword" id="confirmPassword" placeholder="Confirm Password" />
                            {/* <p className="text-left px-4 text-red-600 text-sm">{formErrors.errors}</p> */}
                            <InputItem value={values.dob} onChange={handleChange} label="Date of Birth" type="date" htmlFor="dob" id="dob" placeholder="Date of Birth" />
                            {/* <p className="text-left px-4 text-red-600 text-sm">{formErrors.errors}</p> */}
                            <div style={{padding: "1rem 1rem"}}> 
                                <button style={
                                    {
                                        backgroundColor:"var(--SparesPurple)",
                                        color: "white",
                                    }
                                } type="button" onClick={changeState}>Next</button>
                            </div>
                        </div>
                        <div id="form-group-2">
                            <div style={
                                {
                                    display: "flex",
                                    flexDirection: "column",
                                    padding: "1rem 1rem",
                                    textAlign: "left",
                                    alignItems: "flex-start",
                                }
                            }>
                                <label htmlFor="institution" style={{fontWeight: "600"}}>Institution</label>
                                <select name="institution" className="p-4" id="">
                                    <option value="Universiti Utara Malaysia">Universiti Utara Malaysia</option>
                                    <option value="Universiti Malaysia Perlis">Universiti Malaysia Perlis</option>
                                    <option value="Universiti Teknologi Malaysia">Universiti Teknologi Malaysia</option>
                                    <option value="Universiti Malaysia Sabah">Universiti Malaysia Sabah</option>
                                    <option value="Universiti Malaysia Sarawak">Universiti Malaysia Sarawak</option>
                                </select>
                            </div>
                            <InputItem value={values.matricNumb} onChange={handleChange} label="Matric Number" type="number" htmlFor="matricNumb" id="matricNumb" placeholder="000000" />
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
                                    <label htmlFor="coordinator">Coodinator</label>
                                </div>
                            </div>
                            <div style={{padding: "1rem 1rem", display:"flex"}}> 
                                <button style={{backgroundColor:"gray", color:"white"}} type="button" onClick={prevStage}>Back</button>
                                <button type="button" style={
                                    {
                                        backgroundColor:"var(--SparesPurple)",
                                        color: "white",
                                    }
                                }>Submit</button>
                            </div>
                        </div>
                        <div id="form-group-3">
                            <div style={{padding: "1rem 1rem"}}> 
                                <img  src="" alt="TestImg"  />
                                <button style={{color:"white"}} >Back to Home</button>
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