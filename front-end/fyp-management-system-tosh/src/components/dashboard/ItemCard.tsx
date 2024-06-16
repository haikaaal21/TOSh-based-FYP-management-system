import { Card, CardActionArea } from '@mui/material';
import '../../styles/itemCardStyle.css';
import { CgFileDocument } from 'react-icons/cg';
import { FaCalendarAlt } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import ItemCardProps from '../../types/itemCardsProps';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { MdBook, MdPeople } from 'react-icons/md';

const ItemCard: React.FC<ItemCardProps> = ({ ...props }) => {
  const [itemType, setItemType] = useState<string>();
  const location = useLocation();
  const navigate = useNavigate();

  const checkType = () => {
    if (props.typeOfItem === 'event') {
      setItemType('event');
    } else if (props.typeOfItem === 'task') {
      setItemType('task');
    } else if (props.typeOfItem === 'batch') {
      setItemType('batch');
    } else if (props.typeOfItem === 'project') {
      setItemType('projects');
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
      sx={{
        margin: '1rem 0',
        maxWidth: '350px',
        color: props.submissionstatus ? 'var(--NeutralGrey)' : 'black',
      }}
      id={props.itemid.toString()}
      className="itemCard">
      <div onClick={navigateToTask}>
        <CardActionArea sx={{ height: '100%', width: '100%' }}>
          <div style={{ margin: 0 }} id="uppy">
            <IconContext.Provider value={{ size: '6em' }}>
              <span>
                {props.typeOfItem === 'event' ? (
                  <FaCalendarAlt />
                ) : props.typeOfItem === 'task' ? (
                  <CgFileDocument />
                ) : props.typeOfItem === 'batch' ? (
                  <MdPeople />
                ) : (
                  <MdBook />
                )}
              </span>
            </IconContext.Provider>
            <div style={{ backgroundColor: color }} className="boxI"></div>
          </div>
          <div style={{ margin: 0 }}>
            <h3>{props.title}</h3>
            <p>From: {props.dateFrom}</p>
            <p>
              {Number(props.dueDate).toString().length === 4
                ? props.dueDate
                : props.dueDate === ''
                  ? ''
                  : dayjs(props.dueDate).format('DD/MM/YYYY')}
            </p>
            {props.type ? <p>{props.type}</p> : null}
          </div>
          <p>{props.submissionstatus}</p>
          {props.submissionstatus ? (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'var(--GoodGreen)',
                color: 'white',
                borderRadius: '10px',
              }}>
              Done
            </div>
          ) : null}
        </CardActionArea>
      </div>
    </Card>
  );
};

export default ItemCard;
