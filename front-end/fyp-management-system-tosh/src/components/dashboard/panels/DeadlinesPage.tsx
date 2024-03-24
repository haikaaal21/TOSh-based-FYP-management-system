import { Grid } from '@mui/material'
import MonthlyGrid from '../MonthlyGrid'

const DeadlinesPage = () => {
    return (
        <>
            <h1>Tasks you are assigned</h1>
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

export default DeadlinesPage
