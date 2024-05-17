import { Card, CardActions, CardMedia, Divider, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useGet from '../../../hooks/api/useGet';
import '../../../styles/panels.css';
import { IoMdClock } from 'react-icons/io';
import { MdCalendarMonth, MdLocationPin } from 'react-icons/md';
import dayjs from 'dayjs';
import SpeakerCard from '../SpeakerCard';
import FileCard from '../FileCard';

const EventPage = () => {
  const { eventid } = useParams();
  const { state, handleGet } = useGet();
  const [eventItem, setEventItem] = useState<any>();
  const [word, setWord] = useState<string>('');

  useEffect(() => {
    handleGet(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + 'event/' + eventid
    );
  }, []);

  useEffect(() => {
    if (state.data !== null) {
      setEventItem(state.data);
    }
  }, [state.data]);

  useEffect(() => {
    if (eventItem) {
      const timeDiff = makeTimeDiff(eventItem.eventdate);
      wordBuilder(timeDiff);
    }
  }, [eventItem]);

  const makeTimeDiff = (date: string) => {
    let eventDate = dayjs(date);
    const currentDate = dayjs();
    const yearDiff = eventDate.diff(currentDate, 'year');
    eventDate = eventDate.subtract(yearDiff, 'year');
    const monthDiff = eventDate.diff(currentDate, 'month');
    eventDate = eventDate.subtract(monthDiff, 'month');
    const dayDiff = eventDate.diff(currentDate, 'day');
    return { yearDiff, monthDiff, dayDiff };
  };

  const wordBuilder = (timeDiff: any) => {
    let word = '';
    if (timeDiff.yearDiff > 0) {
      word += `${timeDiff.yearDiff} year(s) `;
    }
    if (timeDiff.monthDiff > 0) {
      word += `${timeDiff.monthDiff} month(s) `;
    }
    if (timeDiff.dayDiff > 0) {
      word += `${timeDiff.dayDiff} day(s) `;
    }
    setWord(word);
  };

  return (
    <>
      {eventItem ? (
        <>
          <Grid
            sx={{
              minHeight: '600px',
            }}
            gap={4}
            container>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  minHeight: '500px',
                  position: 'relative',
                }}>
                <CardMedia
                  sx={{
                    zIndex: 0,
                    position: 'relative',
                    height: '100%',
                  }}
                  component="img"
                  image={
                    import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
                    eventItem.eventimage
                  }
                  alt={eventItem.title}
                />
                <CardActions
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 25px',
                  }}>
                  <a
                    href={eventItem.gmapembed}
                    target="_blank"
                    className="card-bottom-button">
                    <MdLocationPin size={32} />
                  </a>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <p
                style={{
                  color: 'grey',
                }}>
                Event#{eventItem.eventid}
              </p>
              <h1 style={{ margin: '15px 0' }}>{eventItem.eventtitle}</h1>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'var(--SparesOrange)',
                  color: 'white',
                  padding: '5px 10px',
                  width: '100%',
                  justifyContent: 'space-between',
                }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <span style={{ display: 'flex' }}>
                    <MdCalendarMonth size={32} />
                  </span>{' '}
                  <p>{dayjs(eventItem.eventdate).format('DD MMMM YYYY')}</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <span style={{ display: 'flex' }}>
                    <IoMdClock size={32} />
                  </span>{' '}
                  <p>{eventItem.eventtime}</p>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: 'var(--DarkBlue)',
                  color: 'white',
                  padding: '5px 10px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <p>{word} to go before the event starts!</p>{' '}
              </div>
              <p
                style={{
                  marginTop: '10px',
                  textAlign: 'justify',
                }}>
                {eventItem.eventdescription}
              </p>
              <h2>Speakers</h2>
              <div
                style={{
                  display: 'flex',
                  overflowX: 'scroll',
                  padding: '10px',
                  gap: '15px',
                }}>
                {eventItem.speakers.map((speaker: any) => {
                  return (
                    <SpeakerCard key={speaker.eventspeakerid} {...speaker} />
                  );
                })}
              </div>
            </Grid>
          </Grid>
          {eventItem.documents.length > 0 ? (
            <>
              <Divider sx={{ margin: '25px 0 10px 0' }} />
              <h2>Workshop Downloadable Contents</h2>
              <div
                style={{
                  display: 'flex',
                  overflowX: 'scroll',
                  padding: '10px',
                  gap: '15px',
                }}>
                {eventItem.documents.map((file: any) => {
                  return (
                    <FileCard
                      key={file.eventfileid}
                      fileName={file.eventfilename}
                      fileurl={file.eventfile}
                      typeOfFile={file.filetype}
                    />
                  );
                })}
              </div>
            </>
          ) : null}
        </>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default EventPage;
