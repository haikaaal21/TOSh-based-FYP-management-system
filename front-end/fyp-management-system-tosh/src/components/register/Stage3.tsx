import { Button } from "@mui/material";
import image from '../../assets/images/placeholder.jpeg';

const Stage3 = () => {
    return (
        <div style={{
            justifyContent: "center",
        }} className="stage" id="stage-3">
           <img src={image} 
           style={{aspectRatio: '1/1', width: '70%', margin:'1rem 0'}} 
           alt="" />
           <Button variant="contained" color="primary" fullWidth>
             Back to home
           </Button>
        </div>
    )
}

export default Stage3;