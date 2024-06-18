import { Container, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { MdChangeCircle, MdWarning } from "react-icons/md";
import '../styles/landingStuff.css'
import SparesLogoFull from "../components/svgcomponents/spares_logo_full";
import ForgotPassImage from '../assets/images/forgot_pass.png';
import usePost from "../hooks/api/usePost";
import { useNavigate } from "react-router";

const ForgotPassword = () => {

    const [toBeInput, setToBeInput] = useState({
        email: '',
        newpass: ''
    });

    const goto = useNavigate();

    const [errors, setErrors] = useState({} as { [key: string]: string });
    
    const onChange = (event : any) => {
        setToBeInput({
            ...toBeInput,
            [event.target.name]: event.target.value
        });
    }

    const {state, handlePost} = usePost();

    const sendRequest = () => {
        if(Object.keys(errors).length === 0){
            handlePost(`${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}user/forgotPass`, toBeInput);
        }
    }

    useEffect(() => {
        if(state.data) {goto('./login')}
    }, [state])
 
    useEffect(() => {
        setErrors(validate());
    },[toBeInput])

    const validate = () => {
        const errors = {} as { [key: string]: string };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{6,20}$/;
        if(!toBeInput.email || !emailRegex.test(toBeInput.email)){
            errors.email = 'Valid email is required';
        } 
        if(!toBeInput.newpass || !passwordRegex.test(toBeInput.newpass)){
            errors.newpass = 'Password must be 6-20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter, and one special character';
        }
        return errors;
    }

    return (
        <Container maxWidth="lg">
            <div style={{
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                height:'100vh'
            }}>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <img className="not-mobile" src={ForgotPassImage}
                        style={{
                            aspectRatio: '3/4',
                            width: '80%',
                            maxHeight: '800px',
                            borderRadius: '10px',
                          }}
                        alt="Forgot Password" />
                    </Grid>
                    <Grid style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start'}} item xs={12} md={6}>
                        <SparesLogoFull style={{width:'160px', marginBottom:'0.5rem'}} />
                        <h2 style={{marginBottom:'0.8rem', textAlign:'center'}}>Forgot your password?</h2>
                        <TextField
                        style={{marginBottom:'15px'}}
                            value={toBeInput.email}
                            onChange={(event) => onChange(event)}
                            label="Email"
                            variant="outlined"
                            name="email"
                            fullWidth
                            required
                            error={errors.email ? true : false}
                            helperText={errors.email}
                        />    
                        <TextField
                        style={{marginBottom:'15px'}}
                            value={toBeInput.newpass}
                            onChange={(event) => onChange(event)}
                            label="New Password"
                            variant="outlined"
                            name="newpass"
                            type="password"
                            fullWidth
                            required
                            error={errors.newpass ? true : false}
                            helperText={errors.newpass}
                        />    
                        <p style={{textAlign:'center'}} className="subtitle with-leading"><MdWarning />&nbsp;After clicking the button below a verification email will be sent to verify your new password</p>
                        <button onClick={sendRequest} style={{marginBottom:'25px'}} className="full-width buttonWithLeading"><MdChangeCircle />&nbsp;Change Password</button>
                        <div style={{display:'flex', width:'100%', flexDirection:'column'}}>
                        <p>Changed your mind?</p>
                        <a href="../login">Login by clicking here</a>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </Container>
    );
}

export default ForgotPassword;