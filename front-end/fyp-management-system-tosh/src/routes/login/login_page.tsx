import { useEffect } from "react"
import './login_style.css';
import image from '../../assets/images/placeholder.jpeg';
import SparesLogoFull from "../../components/svgcomponents/spares_logo_full";
import InputItem from "../../components/inputItem";
import '../basic-formcss.css';

const LoginPage = () => {
    return (
        <div>
        <div className="login">
           
            <div className="item">
                <img style={{
                    aspectRatio: '3/4',
                    width: '80%',
                    borderRadius: '10px'
                }} src={image} alt="Test-Image" />
            </div>
            <div className="item">
                <div style={
                    {
                        width: "8em",
                    }
                }>
                    <SparesLogoFull />
                </div>
                <h1>Welcome Back!</h1>
                <p>Don't have an account? <a href="/register">Click here to get started.</a></p>
                <form action="">
                    <InputItem label="Email" type="email" htmlFor="email" id="email" placeholder="Email" />
                    <InputItem label="Password" type="password" htmlFor="password" id="password" placeholder="Password" />
                    <div style={
                        {
                            padding: "1rem 1rem"
                        }
                    }>
                        <button type="button">Login</button>
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