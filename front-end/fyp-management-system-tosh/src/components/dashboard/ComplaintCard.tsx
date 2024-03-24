import { Card, CardActionArea, Grid } from '@mui/material'

const ComplaintCard = () => {
    return (
        <Grid item xs={12}>
            <Card>
                <CardActionArea sx={{ padding: '0.5rem 1rem' }}>
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <p>
                                <i>Complaint ID</i>
                            </p>
                            <p>Notifications</p>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <h2>Complaint Title</h2>
                            <div>
                                <p>Complaint Status</p>
                            </div>
                        </div>
                    </div>
                    <p style={{ textAlign: 'justify' }}>
                        {`Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum nulla eligendi eum, unde beatae est dignissimos assumenda repellat corrupti odit velit impedit pariatur, maxime facere tenetur consequatur minima maiores suscipit.
                            Voluptatum vero dolorem amet odio dolor hic, sint, aperiam temporibus impedit expedita beatae unde cum adipisci deserunt molestias minima sed distinctio. Dignissimos iure veritatis, quo voluptates itaque temporibus? Hic, facilis.`.slice(
                            0,
                            400
                        )}
                    </p>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default ComplaintCard
