import { Grid, TextField, Autocomplete, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button } from "@mui/material";

const Stage2 = () => {
    return (
        <div className="stage" id="stage-2">
            <h2 className="lefty" style={{margin:'0px 0 15px'}}>Fill in your academic information here</h2>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Autocomplete
                        id="university"
                        options={['UniUtama']}
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
                    <FormControl fullWidth component="fieldset" required>
                    <FormLabel component="legend">Type of Account</FormLabel>
                      <RadioGroup aria-label="" name="typeOfAccount" row sx={{justifyContent:'space-around'}} >
                            <FormControlLabel value="Undergraduate" control={<Radio />} label="Student" />
                            <FormControlLabel value="Postgraduate" control={<Radio />} label="Staff" />
                      </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                <FormControl fullWidth component="fieldset">
                    <FormLabel component="legend">Type of Staff</FormLabel>
                      <RadioGroup aria-label="" name="typeOfStaff" row sx={{justifyContent:'space-around'}} >
                            <FormControlLabel value="Undergraduate" control={<Radio />} label="Coordinator" />
                            <FormControlLabel value="Postgraduate" control={<Radio />} label="Supervisor" />
                      </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid sx={{paddingTop:3}} item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <Button variant="contained" color="secondary" fullWidth>
                                Back
                            </Button>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Button variant="contained" color="primary" fullWidth>
                                Next
                            </Button>
                        </Grid>
                    </Grid>
                 </Grid>
            </Grid>
        </div>
    )
}

export default Stage2;