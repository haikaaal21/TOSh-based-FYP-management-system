import { Grid, InputAdornment, Pagination, TextField } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import ProjectCard from '../ProjectCard'

const ProjectsPage = () => {
    const goto = useNavigate()
    const location = useLocation()
    const pathname = location.pathname

    const handleNavigate = () => {
        goto(pathname + '/yourproject')
    }

    return (
        <>
            <Grid
                sx={{ display: 'flex', alignItems: 'center' }}
                container
                spacing={0}
            >
                <Grid item lg={10} sm={8} xs={12}>
                    <h1>Projects</h1>
                </Grid>
                <Grid item lg={2} sm={4} xs={12}>
                    <button onClick={handleNavigate}>Your Project</button>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8} lg={10}>
                    <p>
                        <b>Search for a Project</b>
                    </p>
                    <TextField
                        id="search"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    kg
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={4} lg={2}>
                    <p>
                        <b>Filter</b>
                    </p>
                </Grid>
            </Grid>
            <Grid
                sx={{ width: '100%', padding: '1rem 0' }}
                container
                spacing={2}
            >
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
            </Grid>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '80px',
                }}
            >
                <Pagination count={25} color="primary" variant="outlined" />
            </div>
        </>
    )
}

export default ProjectsPage
