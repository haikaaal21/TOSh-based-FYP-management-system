import Grid from '@mui/material/Grid'
import '../../styles/legendCards.css'
import { CardActionArea } from '@mui/material'

interface LegendCardProps {
    coordinator: boolean
    title: string
    name: string
    desc1: string
    desc2: string
}

const LegendCard = () => {
    return (
        <Grid
            sx={{ display: 'flex', alignItems: 'flex-start' }}
            item
            xl={3}
            lg={4}
            md={6}
            sm={6}
            xs={12}
        >
            <CardActionArea>
                <Grid className="legend-content" container spacing={4}>
                    <Grid item xs={2}>
                        <div
                            style={{
                                margin: '0.3rem 0',
                                width: '2rem',
                                height: '2rem',
                                backgroundColor: 'red',
                            }}
                        ></div>
                    </Grid>
                    <Grid item xs={10}>
                        <p>
                            <b>Stuff</b>
                        </p>
                        <div className="description">
                            <p>Stuff</p>
                            <p>Stuff</p>
                            <p>Stuff</p>
                        </div>
                    </Grid>
                </Grid>
            </CardActionArea>
        </Grid>
    )
}

export default LegendCard
