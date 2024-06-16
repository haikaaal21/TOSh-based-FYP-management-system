import { Grid } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router';
import AuthUser from '../../../context/AuthUserContext';
import useGet from '../../../hooks/api/useGet';
import ItemCard from '../ItemCard';
import ErrorPanel from './ErrorPanel';

const StaffEventsPage = () => {
  const goto = useNavigate();
  const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;
  const { auth } = useContext(AuthUser);
  const { state, handleGet } = useGet();

  const [events, setEvents] = useState([] as any);
  const [ownEvents, setOwnEvents] = useState([] as any);

  useEffect(() => {
    fetch();
  }, []);

  function fetch() {
    const institution = auth.user.institution.replace(/ /g, '_');
    if (auth.user.role.includes('Supervisor')) {
      handleGet(
        `${url}event/fetchsuperevent/${auth.user.specialid}/${auth.user.id}`
      );
    } else {
      handleGet(
        `${url}event/fetchcoorevent/${institution}?staffid=${auth.user.specialid}`
      );
    }
  }

  useEffect(() => {
    if (state.data) {
      setEvents(state.data.allEvents);
      setOwnEvents(state.data.ownEvents);
    }
  }, [state]);


  return (
    <>
      {state.error ? (
        <ErrorPanel />
      ) : (
        <div>
          <h1>Events</h1>
          <h2>
            Events{' '}
            {auth.user.role.includes('Supervisor')
              ? 'you need to attend'
              : 'in this institution'}
          </h2>
          <Grid sx={{ minHeight: '200px' }} container>
            {events.map((event: any) => {
              return (
                <Grid key={event.eventid} item xs={12} md={4}>
                  <ItemCard
                    typeOfItem="event"
                    itemid={event.eventid}
                    title={event.eventtitle}
                    dueDate={event.eventdate}
                    dateFrom={
                      event.eventhead === auth.user.specialid
                        ? 'You'
                        : event.name
                    }
                    coordinatorDesignated={
                      auth.user.role.includes('Coordinator') ? true : event.iscoordinator
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
          <Grid
            sx={{ minHeight: '200px', maxHeight: '650px', overflowY: 'scroll' }}
            container>
            <Grid item xs={12} md={6}>
              <h2>Events you created</h2>
            </Grid>
            <Grid item xs={12} md={6}>
              <button
                onClick={() => goto('../create?type=Event')}
                className="buttonWithLeading">
                <MdAdd />
                &nbsp;Create a new event
              </button>
            </Grid>
          </Grid>
          <Grid
            sx={{ minHeight: '200px', maxHeight: '650px', overflowY: 'scroll' }}
            container>
            {ownEvents.map((event: any) => {
              return (
                <Grid key={event.eventid} item xs={12} md={4}>
                  <ItemCard
                    typeOfItem="event"
                    itemid={event.eventid}
                    title={event.eventtitle}
                    dueDate={event.eventdate}
                    dateFrom={'You'}
                    coordinatorDesignated={
                      auth.user.role.includes('Coordinator') ? true : false
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        </div>
      )}
    </>
  );
};

export default StaffEventsPage;
