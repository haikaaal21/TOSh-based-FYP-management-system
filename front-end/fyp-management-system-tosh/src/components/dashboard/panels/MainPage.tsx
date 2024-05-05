import ItemCard from '../ItemCard'
import LegendCard from '../LegendCard'
import '../../../styles/mainPageStyle.css'
import Grid from '@mui/material/Grid'
import { Divider } from '@mui/material'
import useGet from '../../../hooks/api/useGet'
import { useContext, useEffect, useState } from 'react'
import ItemCardProps from '../../../types/itemCardsProps'
import AuthUser from '../../../context/AuthUserContext'

const MainPage = () => {
    /**
     * TODO:
     * - Add logic to display upcoming tasks and events
     * - Add logic to fetch the user's name and batch
     */

    const { handleGet, state } = useGet()
    const { auth } = useContext(AuthUser)

    useEffect(() => {
        handleGet(
            import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
                'items/' +
                auth.user.id +
                '/0'
        )
    }, [])

    const [data, setData] = useState<any>(null)

    useEffect(() => {
        if (state.data !== null) {
            setData(state.data)
        }
    }, [state.data])

    return (
        <>
            <p>Final Year Project - Batch</p>
            <h1>A123</h1>
            <h2>Hall of Shame</h2>
            <p>Table would be here</p> {/**? Don't forget to add the table comp */}
            <h2>Upcoming Tasks and Events</h2>
            <div className="deadlines">
                {data ? (
                    data.length > 0 ? (
                        data.map((item: ItemCardProps) => {
                            return <ItemCard {...item} />
                        })
                    ) : data.length === 0 ? (
                        <p>No upcoming tasks or events</p>
                    ) : (
                        <p>Loading</p>
                    )
                ) : (
                    <p>Error, could not fetch Datas!</p>
                )}
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
                    <LegendCard />
                    <LegendCard />
                    <LegendCard />
                </Grid>
            </div>
        </>
    )
}

export default MainPage
