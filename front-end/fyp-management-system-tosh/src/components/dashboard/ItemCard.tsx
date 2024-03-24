import { Card, CardActionArea } from '@mui/material'
import '../../styles/itemCardStyle.css'
import { CgFileDocument } from 'react-icons/cg'
import { FaCalendarAlt } from 'react-icons/fa'
import { IconContext } from 'react-icons'

interface ItemCardProps {
    typeOfItem: string
    title: string
    dateFrom: string
    dueDate: string
    coordinatorDesignated: boolean
}

const ItemCard = () => {
    let coordinatorDesignated = true
    const color = coordinatorDesignated ? 'red' : 'var(--SparesIndigo)'

    const typeOfItem = 'event'

    return (
        <Card className="itemCard">
            <CardActionArea>
                <div style={{ margin: 0 }} id="uppy">
                    <IconContext.Provider value={{ size: '6em' }}>
                        <span>
                            {typeOfItem === 'event' ? (
                                <FaCalendarAlt />
                            ) : (
                                <CgFileDocument />
                            )}
                        </span>
                    </IconContext.Provider>
                    <div
                        style={{ backgroundColor: color }}
                        className="boxI"
                    ></div>
                </div>
                <div style={{ margin: 0 }}>
                    <h3>TaskTitle</h3>
                    <p>From: date</p>
                    <p>Due: date</p>
                </div>
            </CardActionArea>
        </Card>
    )
}

export default ItemCard
