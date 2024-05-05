import { Card, CardActionArea } from '@mui/material'
import '../../styles/itemCardStyle.css'
import { CgFileDocument } from 'react-icons/cg'
import { FaCalendarAlt } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import ItemCardProps from '../../types/itemCardsProps'
import dayjs from 'dayjs'

const ItemCard: React.FC<ItemCardProps> = ({ ...props }) => {
    const color = props.coordinatorDesignated ? 'red' : 'var(--SparesIndigo)'
    return (
        <Card
            sx={{ margin: '1rem 0' }}
            id={props.itemid.toString()}
            className="itemCard"
        >
            <CardActionArea sx={{ height: '100%' }}>
                <div style={{ margin: 0 }} id="uppy">
                    <IconContext.Provider value={{ size: '6em' }}>
                        <span>
                            {props.typeOfItem === 'event' ? (
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
                    <h3>{props.title}</h3>
                    <p>From: {props.dateFrom}</p>
                    <p>Due: {dayjs(props.dueDate).format('DD/MM/YYYY')}</p>
                </div>
            </CardActionArea>
        </Card>
    )
}

export default ItemCard
