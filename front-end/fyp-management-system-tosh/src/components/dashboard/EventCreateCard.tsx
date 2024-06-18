import { useContext } from 'react';
import EventContext from '../../context/EventContext';
import { Card } from '@mui/material';
import { motion } from 'framer-motion';
import { MdCalendarMonth, MdPeople } from 'react-icons/md';
import dayjs from 'dayjs';
import { IoMdClock } from 'react-icons/io';
import { IoDocument } from 'react-icons/io5';
import { FaLocationPin } from 'react-icons/fa6';

const EventCreateCard = () => {
  const { eventItem } = useContext(EventContext);
  const dateItem = dayjs(eventItem.date).format('DD MMMM YYYY');
  const hourItem = dayjs(eventItem.time).format('HH:mm');

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0 }}>
      <Card sx={{ padding: '10px 15px' }}>
        <p className="subtitle">Event#xxxxx</p>
        <h3>{eventItem.title}</h3>
        <p>{eventItem.description}</p>
        <p>
          <MdCalendarMonth />
          &nbsp;{dateItem !== 'Invalid Date' ? dateItem : ''}
        </p>
        <p>
          <IoMdClock />
          {hourItem !== 'Invalid Date' ? hourItem : ''}
        </p>
        <div
          style={{
            width: '100%',
            overflow: 'scroll',
            maxHeight: '250px',
          }}>
          {eventItem.location ? (
            <button>
              <a
                className="with-leading"
                style={{ color: 'white' }}
                href={eventItem.location}
                target="_blank" rel="noreferrer">
                <FaLocationPin />
                &nbsp;Click to be directed to the location
              </a>
            </button>
          ) : null}
        </div>
        <p style={{ justifyContent: 'flex-start' }} className="with-leading">
          <IoDocument />
          &nbsp;Files: {eventItem.files.length}
        </p>
        <p>
          {eventItem.image.name
            ? 'This event has a cover image'
            : 'This event does not have a cover image'}
        </p>
        <p>
          <MdPeople /> Attendants : {eventItem.attendees.length}
        </p>
      </Card>
    </motion.div>
  );
};

export default EventCreateCard;
