import { useEffect } from "react"
import './login_style.css';
import SparesFilledButton from "../../components/SparesFilledButton";
import image from '../../assets/images/placeholder.jpeg';
import SparesLogoFull from "../../components/svgcomponents/spares_logo_full";
import Navbar from "../../components/landing_page/navbar";

const LoginPage = () => {
    return (
        <div>
        <div className="login">
           
            <div className="item">
                <img src={image} alt="Test-Image" />
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
                    <div className="inputItem">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="Email" />
                    </div>
                    <div className="inputItem">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="Password" />
                    </div>
                    <div style={
                        {
                            padding: "1rem 1rem"
                        }
                    }>
                    <SparesFilledButton text="Login" backgroundColor="var(--SparesIndigo)" clickFunct={() => {}} />
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