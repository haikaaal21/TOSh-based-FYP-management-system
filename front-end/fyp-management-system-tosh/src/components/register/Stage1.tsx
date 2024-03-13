import { motion } from "framer-motion";
import { TextField, Button, Grid, FormHelperText } from "@mui/material";
import './stagesStyle.css';
import { DateField } from "@mui/x-date-pickers";
import useForm from "../../hooks/form/useForm";
import useErrors from "../../hooks/form/useErrors";
import { useCheckEmpty } from "../../hooks/form/useCheckEmpty";
import { useCheckEmail } from "../../hooks/form/useCheckEmail";
import { useCheckPassword } from "../../hooks/form/useCheckPassword";


const Stage1 = ({ setStage }: { setStage: (stage: number) => void }) => {
    
    function incrementStage() {
        setStage(2);
    };

    const objects = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: ''
    };

    const {values, handleChange, handleDateChange} = useForm(objects);
    const {errors, setErrors} = useErrors(objects);
    const {checkEmpty} = useCheckEmpty();
    const {checkEmail} = useCheckEmail();
    const {checkPassword} = useCheckPassword();

    const handleNext = () => { 
        const emptyError = checkEmpty(values);
        const emailError = 
            !emptyError.email ? checkEmail({ email: values.email }) 
            : null;
        const passwordError = 
            !emptyError.password ? checkPassword(values.password, values.confirmPassword) 
            : null;
        const previousErrors = { ...emptyError, ...emailError, ...passwordError };
        setErrors(previousErrors);
        if (Object.keys(previousErrors).length === 0) {
            incrementStage();
        }
    }


    return (
        <motion.div 
        className="stage" 
        id="stage-1" 
        initial={{ opacity:0 }} 
        animate={{  opacity:1, 
            transition: { ease: "easeOut" } }} 
        exit={{ opacity: 0 }}>
            <div>
                <h2 className="lefty" style={{margin:'0px 0 15px'}}>Fill in your personal information here</h2>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField value={values.firstName} onChange={handleChange} id="firstName" label="First Name" variant="outlined" fullWidth required />
                            {errors.firstName && <FormHelperText>{errors.firstName}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField value={values.lastName} onChange={handleChange} id="lastName" label="Last Name" variant="outlined" fullWidth required />
                            {errors.lastName && <FormHelperText>{errors.lastName}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField value={values.email} onChange={handleChange} id="email" label="Email" variant="outlined" fullWidth required />
                            {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField value={values.password} onChange={handleChange} id="password" label="Password" type="password" variant="outlined" fullWidth required />
                            {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField value={values.confirmPassword} onChange={handleChange} id="confirmPassword" label="Confirm Password" type="password" variant="outlined" fullWidth required />
                            {errors.confirmPassword && <FormHelperText>{errors.confirmPassword}</FormHelperText>}
                        </Grid>
                        <Grid item xs={12}>
                            <DateField value={values.dob} 
                            onChange={(date: any) => handleDateChange(date, 'dateOfBirth')} 
                            label="Date of Birth" fullWidth required />
                            {errors.dateOfBirth && <FormHelperText>{errors.dateOfBirth}</FormHelperText>}
                        </Grid>
                    </Grid>
                    <Grid sx={{paddingTop:3}} item xs={12}>
                        <Button onClick={handleNext} variant="contained" color="primary" fullWidth>
                            Next
                        </Button>
                    </Grid>
            </div>
        </motion.div>
    );
}

export default Stage1;