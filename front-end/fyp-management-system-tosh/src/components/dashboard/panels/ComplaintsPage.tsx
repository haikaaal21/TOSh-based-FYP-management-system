import { Grid, Pagination } from '@mui/material'
import ComplaintCard from '../ComplaintCard'

const ComplaintsPage = () => {
    return (
        <>
            <h1>Complaints</h1>
            <Grid sx={{ padding: '25px 0' }} container spacing={2}>
                <ComplaintCard />
                <ComplaintCard />
                <ComplaintCard />
                <ComplaintCard />
                <ComplaintCard />
            </Grid>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    height: '80px',
                    alignItems: 'center',
                }}
            >
                <Pagination count={25} color="primary" variant="outlined" />
            </div>
        </>
    )
}

export default ComplaintsPage
