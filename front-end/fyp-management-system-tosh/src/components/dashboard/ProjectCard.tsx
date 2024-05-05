import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
} from '@mui/material'
import ProjectCardProps from '../../types/ProjectCardProps'

const ProjectCard: React.FC<ProjectCardProps> = ({ ...props }) => {

    const currentUrl = window.location.href;

    return (
        <Grid item xs={12} sm={6} lg={4}>
            <Card id={props.projectid.toString()} sx={{ borderRadius: '15px' }}>
                <CardActionArea href={`${currentUrl}/${props.projectid}`}>
                    <div style={{ padding: '10px' }}>
                        <CardMedia
                            component="img"
                            image={
                                import.meta.env
                                    .VITE_APPLICATION_TEST_SERVER_URL +
                                props.projectimg
                            }
                            sx={{ aspectRatio: '4/2', borderRadius: '10px' }}
                        />
                    </div>
                    <CardContent>
                        <h3>{props.projecttitle}</h3>
                        <b>
                            <span>Icon Here&nbsp;</span>
                            Supervisor : {props.supervisorname}
                        </b>
                        <br />
                        <b>
                            <span>Icon Here&nbsp;</span>
                            Type : {props.typeofproject}
                        </b>
                        <p
                            style={{
                                textAlign: 'justify',
                                fontWeight: '200',
                                fontSize: '12pt',
                            }}
                        >
                            {props.projectdescription.slice(0, 150)}
                        </p>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default ProjectCard
