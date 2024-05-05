import { Grid } from '@mui/material'
import MonthlyGrid from '../MonthlyGrid'
import dayjs from 'dayjs'
import ItemCardProps from '../../../types/itemCardsProps'
import { useContext, useEffect, useState } from 'react'
import useGet from '../../../hooks/api/useGet'
import AuthUser from '../../../context/AuthUserContext'

const DeadlinesPage = () => {
    const { handleGet, state } = useGet()
    const { auth } = useContext(AuthUser)

    useEffect(() => {
        handleGet(
            import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
                'task/' +
                auth.user.id +
                '/0'
        )
    }, [])

    const groupByMonth = (data: any) => {
        let groupedData: { [month: string]: ItemCardProps[] } = {}
        data.forEach((task: any) => {
            let month = dayjs(task.duedate).format('MMMM')
            if (groupedData[month] === undefined) {
                groupedData[month] = []
            }
            // Map the properties from the JSON data to ItemCardProps
            const itemCardProps: ItemCardProps = {
                title: task.tasktitle,
                typeOfItem: 'task',
                itemid: task.taskid,
                dateFrom: task.name,
                dueDate: task.duedate,
                coordinatorDesignated: task.iscoordinator,
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
        }
    }, [state.data])

    return (
        <>
            <h1>Tasks you are assigned</h1>
            <div>
                <Grid sx={{ padding: '25px 0' }} container spacing={4}>
                    {state.data ? (
                        state.data.length > 0 ? (
                            Object.keys(groupedData).map((task: any) => {
                                return (
                                    <MonthlyGrid
                                        currentMonth={task}
                                        items={groupedData[task]}
                                    />
                                )
                            })
                        ) : state.data.length === 0 ? (
                            <p>No Upcoming Tasks ahead!</p>
                        ) : (
                            <p>Loading</p>
                        )
                    ) : (
                        <p>Error, could not fetch Datas from the server!</p>
                    )}
                </Grid>
            </div>
        </>
    )
}

export default DeadlinesPage
