import { Grid, TextField, Autocomplete, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, FormHelperText, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useContext, useState} from "react";
import { useCheckEmpty } from "../../hooks/form/useCheckEmpty";
import useErrors from "../../hooks/form/useErrors";
import useOK from "../../hooks/auth/useOK";
import useForm from "../../hooks/form/useForm";
import AccountContext from "../../context/AccountContext";
import useGet from "../../hooks/api/useGet";


const Stage2 = ({ setStage }: { setStage: (stage: number) => void }) => {
    const { OK:staff, greenFlag, redFlag } = useOK();
    const { state, handleGet } = useGet();

    const objects = {
        'institution': '',
        'matricNumber': '',
        'typeOfAccount': '',
        'typeOfStaff': ''
    }
    const {checkEmpty} = useCheckEmpty();
    const {appendAccount} = useContext(AccountContext);


    const [uniOptions, setUniOptions] = useState([]);
    const {values, handleChange, handleAutoCompleteChange} = useForm(objects);
    const {errors, setErrors} = useErrors(objects);
    
    function backStage() {
        setStage(1);
    }
    function incrementStage() { setStage(3);}

    useEffect(() => {
        handleGet('http://localhost:4000/university/fetch');
    }, [])

    useEffect(() => {
        if (state.data) {
            const uniData = state.data.data.map(
                (uniItem: any) => uniItem.uniname
            );
            setUniOptions(uniData);
        } else if (state.error) {
            setTimeout(() => {
                handleGet('http://localhost:4000/university/fetch');
            }, 30000);
        }
    }, [state.data, state.error]);

    useEffect(() => {
        if(values.typeOfAccount === 'Staff') {
            greenFlag();
        } else {
            redFlag();
        }
    }, [values.typeOfAccount])

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const previousErrors = checkEmpty(values);
        setErrors(previousErrors);
        if (Object.keys(previousErrors).length === 0) {
            appendAccount(values);
            incrementStage();
        } else if (!staff && previousErrors.typeOfStaff && Object.keys(previousErrors).length === 1) {
            appendAccount(values);
            incrementStage();
        }
    }


    return (
        <motion.div 
        className="stage" 
        id="stage-2" 
        initial={{ opacity:0 }} 
        animate={{  opacity:1, 
            transition: { ease: "easeOut" } }} 
        exit={{ opacity: 0 }}>
            <h2 className="lefty" style={{margin:'0px 0 15px'}}>Fill in your academic information here</h2>
            <Grid container spacing={3}>
                { uniOptions.length >0 ?
                    <Grid item xs={12}>
                        <Autocomplete
                            id="institution"
                            value={values.institution}
                            onChange={handleAutoCompleteChange}
                            options={uniOptions}
                            renderInput={(params) => <TextField {...params} label="Institution/University" required />}
                            fullWidth
                        />
                        {errors.institution? <FormHelperText>{errors.institution}</FormHelperText> : null}
                    </Grid>
                    : state.error ? <Grid item xs={12}> <p>There was an error fetching the University Data, retrying 30 seconds</p> </Grid>
                    : <Grid item xs={12}> <CircularProgress /> <p>Fetching University Datas</p> </Grid>
                }
                <Grid item xs={12}>
                    <TextField
                      id="matricNumber"
                      label="Matric Number/Student ID"
                      fullWidth
                      value={values.matricNumber}
                      onChange={handleChange}
                      type="number"
                      required
                    />
                    {errors.matricNumber? <FormHelperText>{errors.matricNumber}</FormHelperText> : null}
                </Grid>
                <Grid item xs={12}>
                    {/* Add how the radio button works */}
                    <FormControl fullWidth component="fieldset" required>
                    <FormLabel component="legend">Type of Account</FormLabel>
                      <RadioGroup onChange={handleChange} aria-label="" name="typeOfAccount" row sx={{justifyContent:'space-around'}} >
                            <FormControlLabel value="Student" control={<Radio />} label="Student" />
                            <FormControlLabel value="Staff" control={<Radio />} label="Staff" />
                      </RadioGroup>
                    </FormControl>
                    {errors.typeOfAccount? <FormHelperText>{errors.typeOfAccount}</FormHelperText> : null}
                </Grid>
                <Grid item xs={12}>
                {staff? 
                <motion.div 
                initial={{opacity:0, translateY:10}} 
                animate={{opacity:1, translateY:0, transition: { ease: "easeOut" }}}>
                    <FormControl  fullWidth component="fieldset">
                        <FormLabel component="legend">Type of Staff</FormLabel>
                        <RadioGroup onChange={handleChange} aria-label="" name="typeOfStaff" row sx={{justifyContent:'space-around'}} >
                                <FormControlLabel value="Coordinator" control={<Radio />} label="Coordinator" />
                                <FormControlLabel value="Supervisor" control={<Radio />} label="Supervisor" />
                        </RadioGroup>
                    </FormControl>
                    {errors.typeOfStaff? <FormHelperText>{errors.typeOfStaff}</FormHelperText> : null}
                </motion.div> 
                : null
                }
                </Grid>
                <Grid sx={{paddingTop:3}} item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <Button onClick={backStage} variant="contained" color="secondary" fullWidth>
                                Back
                            </Button>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Button 
                            onClick={handleSubmit}
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            fullWidth>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                 </Grid>
            </Grid>
        </motion.div>
    )
}

export default Stage2;