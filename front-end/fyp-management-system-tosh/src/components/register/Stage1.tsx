import { TextField, Button, Grid } from "@mui/material";
import './stagesStyle.css';

//TODO: Data passing between child and parent, and vice versa
const Stage1 = () => {
    
    return (
        <div className="stage" id="stage-1">
            <div >
                <h2 className="lefty" style={{margin:'0px 0 15px'}}>Fill in your personal information here</h2>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField id="first-name" label="First Name" variant="outlined" fullWidth required />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField id="last-name" label="Last Name" variant="outlined" fullWidth required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="email" label="Email" variant="outlined" fullWidth required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="password" label="Password" type="password" variant="outlined" fullWidth required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField id="confirm-password" label="Confirm Password" type="password" variant="outlined" fullWidth required />
                        </Grid>
                    </Grid>
                    <Grid sx={{paddingTop:3}} item xs={12}>
                        <Button variant="contained" color="primary" fullWidth>
                            Next
                        </Button>
                    </Grid>
            </div>
        </div>
    )
}

export default Stage1;