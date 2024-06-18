import { Card, CardActions, CardMedia, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormHelperText, Grid,  IconButton, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useGet from '../../../hooks/api/useGet';
import '../../../styles/panels.css';
import { IoMdClock } from 'react-icons/io';
import {
  MdCalendarMonth,
  MdClose,
  MdDelete,
  MdEdit,
  MdLocationPin,
  MdPeople,
  MdPerson,
} from 'react-icons/md';
import dayjs from 'dayjs';
import SpeakerCard from '../SpeakerCard';
import FileCard from '../FileCard';
import defaultImage from '../../../assets/images/default/Event.png';
import AuthUser from '../../../context/AuthUserContext';
import usePost from '../../../hooks/api/usePost';
import Popup from '../Popup';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';

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
      setEditEventItems({
        eventitle: state.data.eventtitle,
        eventdate: dayjs(state.data.eventdate),
        eventtime: dayjs(state.data.eventtime),
        eventdescription: state.data.eventdescription,
        gmapembed: state.data.gmapembed,
      });
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

  const [over, setOver] = useState(false);

  const wordBuilder = (timeDiff: any) => {
    const eventDate = dayjs(eventItem.eventdate);
    const today = dayjs();
    if (eventDate.isBefore(today)) {
      setWord('Event is done!');
      setOver(true);
      return;
    }
    let word = '';
    if (
      timeDiff.yearDiff === 0 &&
      timeDiff.monthDiff === 0 &&
      timeDiff.dayDiff === 0
    ) {
      word += 'Today';
    }
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

  const { auth } = useContext(AuthUser);
  const { state: postState, handlePost } = usePost();
  const goto = useNavigate();

  const deleteEvent = async () => {
    handlePost(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + 'event/deleteEvent',
      { eventid: eventItem.eventid }
    );
    goto('../events');
  };

  const [openDialog, setOpenDialog] = useState(false);
  

  useEffect(() => {
    if (postState.data !== null) {
      window.location.reload();
    }
  }, [postState]);

  const [openPopup, setOpenPopup] = useState(false);

  const [editEventItems, setEditEventItems] = useState({
    eventitle: '',
    eventdate: dayjs(),
    eventtime: dayjs(),
    eventdescription: '',
    gmapembed: '' as string,
  })

  const [editErrors, setEditErrors] = useState({
    eventitle: '',
    dateitems: '',
    eventdescription: '',
    gmapembed: '',
  });

  const poplogic = () => {
    setOpenPopup(!openPopup);
  };

  useEffect(() => {
    if (openDialog) {
      setEditErrors(validate());
    }
  }, [editEventItems])

  const validate = () => {
    const errors: any = {};
    const timeMerge = dayjs(editEventItems.eventdate).format('YYYY-MM-DD') + 'T' + dayjs(editEventItems.eventtime).format('HH:mm');
      if (editEventItems.eventitle === '') {
        errors.eventitle = 'Event title is required';
      } else if (editEventItems.eventitle.length < 3) {
        errors.eventitle = 'Event title must be more than 3 characters';
      }
      if (editEventItems.eventdescription === '') {
        errors.eventdescription = 'Event description is required';
      } else if (editEventItems.eventdescription.length < 5) {
        errors.eventdescription = 'Event description must be more than 5 characters';
      }
      if (editEventItems.gmapembed === '') {
        errors.gmapembed = 'Event Location URL is required';
      } else if (editEventItems.gmapembed.length < 5) {
        errors.gmapembed = 'Event Location URL must be more than 5 characters';
      }
      if(!dayjs(timeMerge).isValid()){
        errors.dateitems = 'Invalid Date or Time';
      } else if (dayjs(timeMerge).isBefore(dayjs()) || dayjs(timeMerge).isSame(dayjs())) {
        errors.dateitems = 'Event Date must be after today';
      } else {
        errors.dateitems = '';
      }
      return errors;
    }

    const { handlePost:eventEdit } = usePost();

    const updateEvent = (e: any) => {
      e.preventDefault();
      if(Object.keys(editErrors).length > 0){
        eventEdit(import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + `event/editEvent/${eventItem.eventid}`,{
          eventtitle: editEventItems.eventitle,
          eventdate: dayjs(editEventItems.eventdate).format('YYYY-MM-DD'),
          eventtime: dayjs(editEventItems.eventtime).format('HH:mm'),
          eventdescription: editEventItems.eventdescription,
          gmapembed: editEventItems.gmapembed,
        })
        window.location.reload();
      }
    }    
    
    function navigateToAttendanceList() {
      goto('./attendance')
    }

  return (
    <>
      {eventItem ? (
        <>
        <Dialog maxWidth="md" open={openDialog}>
          <DialogTitle
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <div>
              <MdEdit /> Edit Event
            </div>
            <IconButton onClick={() => setOpenDialog(false)} >
              <MdClose />
            </IconButton>
          </DialogTitle>
          <DialogContent style={{minHeight:'450px', display:'flex',alignItems:'center'}}>
            <form onSubmit={(event) => updateEvent(event)}>
              <TextField
                label="Event Title"
                sx={{ marginBottom: '10px' }}
                error={editErrors.eventitle !== undefined}
                helperText={editErrors.eventitle}
                fullWidth
                value={editEventItems.eventitle}
                onChange={(e) => setEditEventItems({...editEventItems, eventitle: e.target.value})}
              />
              <Grid style={{justifyContent:'space-between'}} gap={1} container>
                <Grid item xs={12} md={5.5}>
                  <FormControl fullWidth>
                    <DatePicker 
                      label="Event Date"
                      sx={{ marginBottom: '10px' }}
                      value={editEventItems.eventdate}
                      onChange={(date) => setEditEventItems({...editEventItems, eventdate: dayjs(date)})}
                    />
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={5.5}>
                  <FormControl fullWidth>
                  <TimePicker 
                    label="Event Time"
                    sx={{ marginBottom: '10px' }}
                    value={editEventItems.eventtime}
                    onChange={(time) => setEditEventItems({...editEventItems, eventtime: dayjs(time)})}
                  />
                  </FormControl>
                </Grid>
              </Grid>
              <FormHelperText style={{marginBottom:'15px'}} error>{editErrors.dateitems}</FormHelperText>
              <TextField
                sx={{ marginBottom: '10px' }}
                label="Event Description"
                fullWidth
                error={editErrors.eventdescription !== undefined}
                helperText={editErrors.eventdescription}
                value={editEventItems.eventdescription}
                onChange={(e) => setEditEventItems({...editEventItems, eventdescription: e.target.value})}
              />
              <TextField
                label="Event Location Link"
                sx={{ marginBottom: '10px' }}
                fullWidth
                error={editErrors.gmapembed !== undefined}
                helperText={editErrors.gmapembed}
                value={editEventItems.gmapembed}
                onChange={(e) => setEditEventItems({...editEventItems, gmapembed: e.target.value})}
              />
              <button type='submit' className='buttonWithLeading full-width'><MdEdit />&nbsp;Edit Event</button>
            </form>
          </DialogContent>
        </Dialog>
          {openPopup ? (
            <Popup
              title="Delete Event"
              content="Are you sure you want to delete this event?"
              button1="Yes"
              button2="No"
              yesClicked={deleteEvent}
              noClicked={poplogic}
            />
          ) : null}
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
                    eventItem.eventimage
                      ? import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
                        eventItem.eventimage
                      : defaultImage
                  }
                  alt={eventItem.title}
                />
                <CardActions
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 25px',
                  }}>
                  <button
                    className="full-width"
                    onClick={() => {
                      window.open(eventItem.gmapembed, '_blank');
                    }}>
                    <MdLocationPin size={32} />
                    Location URL
                  </button>
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
              {eventItem.eventhead === auth.user.specialid &&
              auth.user.role.includes('Staff') ? (
                <>
                <p style={{display:'flex', alignItems:'center'}}><MdPerson />&nbsp;Staff Section</p>
                <Grid container>
                  <Grid item xs={12} md={4}>
                  <button onClick={() => setOpenDialog(true)} className="buttonWithLeading">
                    <MdEdit />
                    &nbsp;Edit Event
                  </button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                  <button
                    onClick={poplogic}
                    className="buttonWithLeading"
                    style={{ backgroundColor: 'var(--IndicatorRed)' }}>
                    <MdDelete />
                    &nbsp;Delete Event
                  </button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <button onClick={navigateToAttendanceList} className='buttonWithLeading'>
                      <MdPeople />&nbsp;
                      Attendance list
                    </button>
                  </Grid>
                </Grid>
                </>
              ) : null}
              <h1 style={{ margin: '15px 0' }}>{eventItem.eventtitle}</h1>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'var(--SparesOrange)',
                  color: 'white',
                  padding: '5px 10px',
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
                  backgroundColor: over
                    ? 'var(--SparesIndigo)'
                    : 'var(--DarkBlue)',
                  color: 'white',
                  padding: '5px 10px',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <p>
                  {word} {over ? '' : 'to go before the event starts!'}
                </p>{' '}
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
