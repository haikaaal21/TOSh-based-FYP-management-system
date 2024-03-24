import { Grid } from '@mui/material'
import MonthlyGrid from '../MonthlyGrid'

const EventsPage = () => {
    return (
        <>
            <h1>Upcoming Events</h1>
            <div>
                <Grid sx={{ padding: '25px 0' }} container spacing={4}>
                    <MonthlyGrid />
                    <MonthlyGrid />
                    <MonthlyGrid />
                </Grid>
            </div>
        </>
    )
}

export default EventsPage
