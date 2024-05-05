import { Grid, InputAdornment, Pagination, TextField } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import ProjectCard from '../ProjectCard'
import ProjectCardProps from '../../../types/ProjectCardProps'
import { useContext, useEffect, useState } from 'react'
import useGet from '../../../hooks/api/useGet'
import { BiSearch } from 'react-icons/bi'
import AuthUser from '../../../context/AuthUserContext'

const ProjectsPage = () => {
    const goto = useNavigate()
    const location = useLocation()
    const pathname = location.pathname
    const { auth } = useContext(AuthUser)

    const handleNavigate = () => {
        goto(pathname + '/yourproject')
    }

    const { handleGet, state } = useGet()
    const [datas, setDatas] = useState<ProjectCardProps[]>()
    const [offset, setOffset] = useState(0)
    const [myProject, setMyProject] = useState<any>(null)

    const updateDatas = (data: any) => {
        let projectCards: ProjectCardProps[] = []
        data.forEach((project: any) => {
            const projectCard: ProjectCardProps = {
                projectid: project.projectid,
                projectimg: project.projectimage,
                projecttitle: project.projecttitle,
                supervisorname: project.supervisorname,
                typeofproject: project.projecttype,
                projectdescription: project.projectdescription,
            }
            projectCards.push(projectCard)
        })
        setDatas(projectCards)
    }

    useEffect(() => {
        handleGet(
            import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
                `project/fetchall/${auth.user.id}/${auth.user.batchid}/` +
                offset
        )
    }, [])

    useEffect(() => {

    })

    useEffect(() => {
        if (state.data !== null) {
            updateDatas(state.data)
        }
    }, [state.data])

    //!! Revise Data fetching!
    const changePage = () => {
        handleGet(
            import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
                'project/fetchall/4/' +
                offset
        )
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
                                    <BiSearch />
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
                {datas ? (
                    state.data.length > 0 ? (
                        datas.map((project: ProjectCardProps) => {
                            return <ProjectCard {...project} />
                        })
                    ) : state.data.length === 0 ? (
                        <p>No projects available</p>
                    ) : (
                        <p>Loading</p>
                    )
                ) : (
                    <p>Error, could not retrieve datas!</p>
                )}
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
                <Pagination
                    className="pagination"
                    count={
                        state.data !== null
                            ? Math.round(state.data.length / 6)
                            : 1
                    }
                    color="primary"
                    variant="outlined"
                    onClick={changePage}
                />
            </div>
        </>
    )
}

export default ProjectsPage
