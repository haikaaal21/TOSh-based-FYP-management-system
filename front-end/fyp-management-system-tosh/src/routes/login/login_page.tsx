import { useEffect, useState } from "react"
import './login_style.css';
import image from '../../assets/images/placeholder.jpeg';
import SparesLogoFull from "../../components/svgcomponents/spares_logo_full";
import InputItem from "../../components/landing_page/inputItem";
import '../basic-formcss.css';
import useIsLoading from "../../hooks/ui/is_loading";
import Cookies from 'js-cookie';


const LoginPage = () => {

    useEffect(() => {
        document.title = "Login";
    }, []);

    const [values, setValues] = useState({
        email: "",
        password: ""
    })

    const {isLoading, startLoading, stopLoading} = useIsLoading();

    const [errors, setErrors] = useState ({} as {[key: string]: string});

    const handleChange = (e: any) => {
        setValues({...values, [e.target.name]: e.target.value});
        console.log(values);
    }

    const validate = (values: any) => {
        let errors = {} as {[key: string]: string};
        // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!values.email) {
            errors.email = "Valid email is required";
        } 
        if(!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 6) {
            errors.password = "Password must be more than 6 characters";
        }
        console.log(errors);
        return errors;
    }

    const handleSubmit = (event:any) => {
        startLoading();        
        event.preventDefault();
        let previousErrors = validate(values);
        setErrors(previousErrors);

        if(Object.keys(previousErrors).length === 0) {
            fetch('http://localhost:4000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            }).then((response) => {
                if(response.ok) {
                    return response.json();
                }
                throw response;
            }).then((data) => {
                let token = data.accessToken;                
                let is_student = data.is_student;
                Cookies.set('authToken', token, {expires: 3});
                Cookies.set('studentAccount', is_student, {expires: 3});
                stopLoading();
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    useEffect(() => {
        console.log(errors);
        if(Object.keys(errors).length === 0) {
            
        }
    },[errors]);

    return (
        <div>
        <div className="login">
            
            <div className="item">
                <img style={{
                    aspectRatio: '3/4',
                    width: '80%',
                    maxHeight: '800px',
                    borderRadius: '10px'
                }} src={image} alt="Test-Image" />
            </div>
            <div className="item">
                <div style={
                    {
                        margin: "1rem",
                        width: "15em",
                    }
                }>
                    <SparesLogoFull />
                </div>
                <h1 className="font-bold text-2xl">Welcome Back!</h1>
                <p>Don't have an account? <a href="/register">Click here to get started.</a></p>
                <form onSubmit={handleSubmit}>
                    <InputItem onChange={handleChange} value={values.email} label="Email" type="email" htmlFor="email" id="email" placeholder="Email" />
                    <p className="mx-4 text-[12pt] font-md text-red-600">{errors.email}</p>
                    <InputItem onChange={handleChange} value={values.password} label="Password" type="password" htmlFor="password" id="password" placeholder="Password" />
                    <p className="mx-4 text-[12pt] font-md text-red-600">{errors.password}</p>
                    <div style={
                        {
                            padding: "1rem 1rem"
                        }
                    }>
                        {isLoading ? 
                        <button style={{backgroundColor:"var(--SparesPurple)", color:"white"}} type="submit" disabled>Loading</button> :
                        <button style={{backgroundColor:"var(--SparesPurple)", color:"white"}} type="submit">Login</button> 
                        }
                        
                   </div>
                </form>
                <p>Forgot your password?</p>
                <a href="/forgotPassword">Click here to reset your password</a>
            </div>
        </div>
        </div>
    );
}

export default LoginPage;