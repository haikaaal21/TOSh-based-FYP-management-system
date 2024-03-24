import ItemCard from '../ItemCard'
import LegendCard from '../LegendCard'
import '../../../styles/mainPageStyle.css'
import Grid from '@mui/material/Grid'
import { Divider } from '@mui/material'

const MainPage = () => {
    return (
        <>
            <p>Final Year Project - Batch</p>
            <h1>A123</h1>
            <h2>Upcoming Tasks and Events</h2>
            <div className="deadlines">
                <ItemCard />
                <ItemCard />
                <ItemCard />
                <ItemCard />
                <ItemCard />
                <ItemCard />
            </div>
            <h2>Timeline</h2>
            <div className="timeline">
                <p>Dropdown here</p>
                <p>Timeline here</p>
                <Divider />
                <h3 style={{ margin: '1rem 0' }}>Legend</h3>
                <Grid container spacing={1}>
                    <LegendCard />
                    <LegendCard />
                    <LegendCard />
                    <LegendCard />
                    <LegendCard />
                </Grid>
            </div>
        </>
    )
}

export default MainPage
