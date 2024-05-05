import { Card, Grid } from "@mui/material"
import '../../../styles/yourFYP.css'
import ItemCard from "../ItemCard"
import { useParams } from "react-router"
import { useContext, useEffect, useState } from "react"
import useGet from "../../../hooks/api/useGet"
import { MdPerson } from "react-icons/md"
import { FaFolder } from "react-icons/fa"
import AuthUser from "../../../context/AuthUserContext"

//!TODO: FINISH THIS SKELETON

const YourProjectPage = () => {

    const { projectid } = useParams<{ projectid: string }>();
    const { handleGet, state } = useGet();
    const { auth } = useContext(AuthUser);
    const [project, setProject] = useState<any>(null);
    useEffect(()=> {
        handleGet(import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + `project/getProject/${projectid}/${auth.user.specialid}`)  
    }, [])

    useEffect(()=> {
        if(state.data!==null)
        setProject(state.data.project[0]);
        
    }, [state.data])

    return (
        <>
            {project && state.data !== null ?
            (<>
            <div style={{ height: '25px' }} />
            <Card className="project-hero" sx={{borderRadius:'20px'}}>
                <div className="hero-container">
                    <p>PID#{project.projectid}</p>
                    <h2 style={{lineHeight:'1.3', fontSize:'28pt'}}>{project.projecttitle}</h2>
                    <p style={{height:'60px', overflow:'clip'}}>{project.projectdescription}</p>
                    <p><span><MdPerson /> </span> Supervisor:<b> {project.supervisorname}</b></p>
                    <p><span><FaFolder /></span>  Type of Project: <b>{project.projecttype}</b></p>
                </div>
                <img src="https://via.placeholder.com/150" alt="" className="hero-container" />
            </Card>
            <div style={{ height: '25px' }} />

            
            {/** MyProjectSection */}
            {state.data.check.length > 0 ?
            (<Grid style={{padding:'15px 0'}} container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <h3 style={{fontWeight:'500'}}>Tasks</h3>
                    <div style={{width:'60%', padding:'10px 0'}}>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <h3 style={{fontWeight:'500'}}>Events</h3>
                </Grid>
            </Grid>)
            :
            <> 
            <button>Request to partake project</button>
                <Grid>
                    <h3 style={{fontWeight:'500', padding:'15px 0'}}>More about this project</h3>
                    <p>MD reader here</p>
                </Grid>
            </>
            }
            </>
            )
            :
            (<p>Loading...</p>)    
        }
        </>
    )
}

export default YourProjectPage
