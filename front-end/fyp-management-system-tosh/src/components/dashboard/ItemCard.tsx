import { Card, CardActionArea } from '@mui/material';
import '../../styles/itemCardStyle.css';
import { CgFileDocument } from 'react-icons/cg';
import { FaCalendarAlt } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import ItemCardProps from '../../types/itemCardsProps';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const ItemCard: React.FC<ItemCardProps> = ({ ...props }) => {
  const [itemType, setItemType] = useState<string>();
  const location = useLocation();
  const navigate = useNavigate();

  const checkType = () => {
    if (props.typeOfItem === 'event') {
      setItemType('event');
    } else if (props.typeOfItem === 'task') {
      setItemType('task');
    }
  };

  const navigateToTask = () => {
    let url = location.pathname.split('/')[1];
    navigate(`/${url}/${itemType}/${props.itemid}`);
  };

  useEffect(() => {
    checkType();
  }, []);

  const color = props.coordinatorDesignated ? 'red' : 'var(--SparesIndigo)';
  return (
    <Card
      key={props.itemid.toString()}
      sx={{ margin: '1rem 0' }}
      id={props.itemid.toString()}
      className="itemCard">
      <div onClick={navigateToTask}>
        <CardActionArea sx={{ height: '100%', width: '100%' }}>
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
            <div style={{ backgroundColor: color }} className="boxI"></div>
          </div>
          <div style={{ margin: 0 }}>
            <h3>{props.title}</h3>
            <p>From: {props.dateFrom}</p>
            <p>Due: {dayjs(props.dueDate).format('DD/MM/YYYY')}</p>
          </div>
        </CardActionArea>
      </div>
    </Card>
  );
};

export default ItemCard;
