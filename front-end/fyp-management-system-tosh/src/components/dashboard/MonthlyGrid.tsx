import { Grid } from '@mui/material'
import ItemCard from './ItemCard'
import '../../styles/monthlyGridStyle.css'

const MonthlyGrid = () => {
    return (
        <Grid item md={4} xs={12}>
            <h2 className="monthly-grid-h">Month here</h2>
            <Grid container spacing={4}>
                <Grid item xs={10}>
                    <ItemCard />
                </Grid>
                <Grid item xs={10}>
                    <ItemCard />
                </Grid>
                <Grid item xs={10}>
                    <ItemCard />
                </Grid>
                <Grid item xs={10}>
                    <ItemCard />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default MonthlyGrid
