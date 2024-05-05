import { Grid } from '@mui/material'
import MonthlyGrid from '../MonthlyGrid'
import { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import useGet from '../../../hooks/api/useGet'
import ItemCardProps from '../../../types/itemCardsProps'
import AuthUser from '../../../context/AuthUserContext'

const EventsPage = () => {
    const { handleGet, state } = useGet()
    const { auth } = useContext(AuthUser)

    useEffect(() => {
        handleGet(
            import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
                'event/' +
                auth.user.id +
                '/0'
        )
    }, [])

    const groupByMonth = (data: any) => {
        let groupedData: { [month: string]: ItemCardProps[] } = {}
        data.forEach((event: any) => {
            let month = dayjs(event.eventdate).format('MMMM')
            if (groupedData[month] === undefined) {
                groupedData[month] = []
            }
            // Map the properties from the JSON data to ItemCardProps
            const itemCardProps: ItemCardProps = {
                title: event.eventtitle,
                typeOfItem: 'event',
                itemid: event.eventid,
                dateFrom: event.eventhead,
                dueDate: event.eventdate,
                coordinatorDesignated: event.iscoordinator,
            }
            groupedData[month].push(itemCardProps)
        })
        return groupedData
    }

    const [groupedData, setGroupedData] = useState<any>(null)

    useEffect(() => {
        if (state.data !== null) {
            setGroupedData(groupByMonth(state.data))
        }
        if (groupedData !== null) {
            Object.keys(groupedData).slice(0, 3)
            console.log(groupedData)
        }
    }, [state.data])

    return (
        <>
            <h1>Upcoming Events</h1>
            <div>
                <Grid sx={{ padding: '25px 25px' }} container spacing={4}>
                    {state.data ? (
                        state.data > 0 ? (
                            Object.keys(groupedData).map((event: any) => {
                                return (
                                    <MonthlyGrid
                                        currentMonth={event}
                                        items={groupedData[event]}
                                    />
                                )
                            })
                        ) : state.data.length === 0 ? (
                            <p>No upcoming events ahead</p>
                        ) : (
                            <p>Loading</p>
                        )
                    ) : (
                        <p>Error retrieving datas from the server!</p>
                    )}
                </Grid>
            </div>
        </>
    )
}

export default EventsPage
