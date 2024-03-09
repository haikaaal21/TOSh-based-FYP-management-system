import { useEffect, useState } from "react"
import useAuth from "../../hooks/auth/useAuth";
import './login_style.css';
import image from '../../assets/images/placeholder.jpeg';
import SparesLogoFull from "../../components/svgcomponents/spares_logo_full";
import InputItem from "../../components/landing_page/inputItem";
import '../basic-formcss.css';
import useIsLoading from "../../hooks/ui/is_loading";
import Cookies from 'js-cookie';
import useOK from "../../hooks/auth/useOK";
import useIdentify from "../../hooks/routing/useIdentify";


const LoginPage = () => {
    const { setAuth } = useAuth();
    
    //* Validator Hooks
    useEffect(() => {
        document.title = "Login";
    }, []);

    const [values, setValues] = useState({
        email: "",
        password: ""
    })

    const { isLoading, startLoading, stopLoading } = useIsLoading();
    const { OK, greenFlag, redFlag } = useOK();
    const [errors, setErrors] = useState({} as { [key: string]: string });
    const [errorFetching, setErrorsFetching] = useState<string>();
    const { identify } = useIdentify();

    const handleChange = (e: any) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }


    const validate = (values: any) => {
        let errors = {} as { [key: string]: string };
        // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //TODO: Fix Regex and validation for all
        if (!values.email) {
            errors.email = "Valid email is required";
        }
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 6) {
            errors.password = "Password must be more than 6 characters";
        }
        return errors;
    }

    //* Handling Submission (API Fetcher)
    const handleSubmit = (event: any) => {
        event.preventDefault();
        startLoading();
        let previousErrors = validate(values);
        setErrors(previousErrors);

        if (Object.keys(previousErrors).length === 0) {
            fetch('http://localhost:4000/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw response;
            }).then((data) => {
                let token = data.accessToken;
                Cookies.set('authToken', token, { expires: 3, sameSite:'strict' });
                greenFlag();
                setAuth(data);
                identify(data.role.toString());
            }).catch((error) => {       
                // TODO: Put error per status of the server!
                // TODO: Make an attempt counter and lock the user out after 3 attempts
                redFlag();
                if (error.status === 401) {
                    setErrorsFetching("Invalid email or password!");
                } else if(error.status === 500) {
                    setErrorsFetching("Server Error, please try again later. (ERR CODE: 500)");
                } else if (error.status === 400) {
                    setErrorsFetching("Bad Request to the server, please try again later. (ERR CODE: 400)");
                }
            });
            setValues({ email: "", password: "" });
            stopLoading();
        }
    }

    useEffect(() => {
        if (Object.keys(errors).length === 0) {

        }
    }, [errors]);

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
                                <button style={{ backgroundColor: "var(--SparesPurple)", color: "white" }} type="submit" disabled>Loading</button> :
                                <button style={{ backgroundColor: "var(--SparesPurple)", color: "white" }} type="submit">Login</button>
                            }
                            {OK ? <></> : <p className="text-center text-red-600">{errorFetching}</p>}
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