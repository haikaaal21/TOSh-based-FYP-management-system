import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
} from '@mui/material'

const ProjectCard = () => {
    return (
        <Grid item xs={12} sm={6} lg={4}>
            <Card sx={{ borderRadius: '15px' }}>
                <CardActionArea>
                    <div style={{ padding: '10px' }}>
                        <CardMedia
                            component="img"
                            image="https://via.placeholder.com/150"
                            sx={{ aspectRatio: '4/2', borderRadius: '10px' }}
                        />
                    </div>
                    <CardContent>
                        <h3>Project Title</h3>
                        <b>
                            <span>Icon Here&nbsp;</span>
                            Supervisor : Whom??
                        </b>
                        <br />
                        <b>
                            <span>Icon Here&nbsp;</span>
                            Type : What??
                        </b>
                        <p
                            style={{
                                textAlign: 'justify',
                                fontWeight: '200',
                                fontSize: '12pt',
                            }}
                        >
                            {`Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum nulla eligendi eum, unde beatae est dignissimos assumenda repellat corrupti odit velit impedit pariatur, maxime facere tenetur consequatur minima maiores suscipit.
                            Voluptatum vero dolorem amet odio dolor hic, sint, aperiam temporibus impedit expedita beatae unde cum adipisci deserunt molestias minima sed distinctio. Dignissimos iure veritatis, quo voluptates itaque temporibus? Hic, facilis.`.slice(
                                0,
                                150
                            )}
                        </p>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default ProjectCard
