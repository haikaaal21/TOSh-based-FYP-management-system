import { Grid, TextField, Autocomplete, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useOK from "../../hooks/auth/useOK";
// import useForm from "../../hooks/form/useForm";

const Stage2 = ({ setStage }: { setStage: (stage: number) => void }) => {
    const { OK, greenFlag, redFlag } = useOK();
    const [typeOfStaff, setTypeOfAcccount] = useState('');
    // const {initialValues, setInitialValues} = useForm(
    //     {academicInfo: ''},
    // )
    
    function backStage() {
        setStage(1);
    }

    useEffect(() => {
        if(typeOfStaff === 'Staff') {
            greenFlag();
        } else {
            redFlag();
        }
    }, [typeOfStaff])

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
                <Grid item xs={12}>
                    <Autocomplete
                        id="university"
                        options={['Universiti Utara Malaysia']}
                        renderInput={(params) => <TextField {...params} label="University" required />}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                      id="matricNumber"
                      label="Matric Number/Student ID"
                      fullWidth
                      required
                    />
                </Grid>
                <Grid item xs={12}>
                    {/* Add how the radio button works */}
                    <FormControl fullWidth component="fieldset" required>
                    <FormLabel component="legend">Type of Account</FormLabel>
                      <RadioGroup onChange={(e)=>{setTypeOfAcccount(e.target.value)}} defaultValue={"Student"} aria-label="" name="typeOfAccount" row sx={{justifyContent:'space-around'}} >
                            <FormControlLabel value="Student" control={<Radio />} label="Student" />
                            <FormControlLabel value="Staff" control={<Radio />} label="Staff" />
                      </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                {OK? 
                <motion.div 
                initial={{opacity:0, translateY:10}} 
                animate={{opacity:1, translateY:0, transition: { ease: "easeOut" }}}>
                    <FormControl  fullWidth component="fieldset">
                        <FormLabel component="legend">Type of Staff</FormLabel>
                        <RadioGroup defaultValue={"Coordinator"} aria-label="" name="typeOfStaff" row sx={{justifyContent:'space-around'}} >
                                <FormControlLabel value="Coordinator" control={<Radio />} label="Coordinator" />
                                <FormControlLabel value="Supervisor" control={<Radio />} label="Supervisor" />
                        </RadioGroup>
                    </FormControl>
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
                            <Button type="submit" variant="contained" color="primary" fullWidth>
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