import { Badge, Grid } from '@mui/material';
import AuthUser from '../../../context/AuthUserContext';
import { useContext, useEffect, useState } from 'react';
import { DateCalendar, PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { FaExclamationTriangle } from 'react-icons/fa';
import useGet from '../../../hooks/api/useGet';
import Loading from '../../Loading';
import ItemCard from '../ItemCard';
import { MdBook, MdCalendarMonth, MdPeople, MdTask } from 'react-icons/md';
import { motion } from 'framer-motion';
import { IoMdDocument } from 'react-icons/io';
import TableOfShame from '../../TableOfShame';
import ErrorPanel from './ErrorPanel';

const StaffMainPage = () => {
  const { auth } = useContext(AuthUser);
  const { state, handleGet } = useGet();
  const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;

  const fetch = () => {
    const uniname = auth.user.institution.replace(/ /g, '_');
    if (auth.user.role.includes('Coordinator')) {
      handleGet(
        `${url}user/staff/coordinator/fetchItems/${auth.user.specialid}?uni=${uniname}`
      );
    } else {
      handleGet(
        `${url}user/staff/supervisor/fetchItems/${auth.user.specialid}/${auth.user.id}`
      );
    }
  };

  const [batchs, setBatchs] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch();
    setLoading(true);
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || events.length > 0) {
      highlightDays(new Date());
    }
    setLoading(false);
  }, [tasks, events]);

  useEffect(() => {
    if (state.error) {
      setError(true);
    } else if (state.data) {
      setTasks(state.data.tasks);
      setEvents(state.data.events);
      auth.user.role.includes('Coordinator')
        ? setBatchs(state.data.batches)
        : setProjects(state.data.projects);
    }
  }, [state]);

  const [highlightedDays, setHighlightedDays] = useState(
    [] as { date: number; taskid: number }[]
  );

  const [month, setMonth] = useState();

  const onChange = (event: any) => {
    setMonth(event.$d);
    highlightDays(event.$d);
  };

  const [loading, setLoading] = useState(false);

  const highlightDays = (currentMonth: Date) => {
    const highlightedDays = [];
    const month = currentMonth;
    const toDateFormat = dayjs(month).format('MMMM');
    const taskDates = tasks.map((task: any) => {
      return dayjs(task.duedate).format('MMMM');
    });
    const eventDates = events.map((event: any) => {
      return dayjs(event.eventdate).format('MMMM');
    });
    for (let i = 0; i < taskDates.length; i++) {
      if (taskDates[i] === toDateFormat) {
        highlightedDays.push({
          date: dayjs(tasks[i].duedate).date(),
          taskid: tasks[i].taskid,
        });
      }
    }
    for (let i = 0; i < eventDates.length; i++) {
      if (eventDates[i] === toDateFormat) {
        highlightedDays.push({
          date: dayjs(events[i].eventdate).date(),
          taskid: events[i].eventid,
        });
      }
    }
    setHighlightedDays(highlightedDays);
  };

  function ServerDay(
    props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
  ) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

    const isSelected =
      !props.outsideCurrentMonth &&
      highlightedDays.indexOf(props.day.date()) >= 0;

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={isSelected ? <FaExclamationTriangle /> : undefined}>
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    );
  }

  return (
    <>
      {error ? (
        <ErrorPanel />
      ) : state.data ? (
        <>
          <h3>Welcome back</h3>
          <h1>{auth.user.firstName}!</h1>
          <Grid container>
            <Grid item xs={12} md={5.5}>
              {loading ? (
                <Loading />
              ) : (
                <DateCalendar
                  readOnly
                  onMonthChange={(event) => onChange(event)}
                  slots={{
                    day: ServerDay,
                  }}
                  slotProps={{
                    day: {
                      highlightedDays: highlightedDays.map(
                        (highlight) => highlight.date
                      ),
                    } as any,
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12} md={5.5}>
              <h3>Legend</h3>
              <p style={{ margin: '5px 0' }} className="subtitle">
                {dayjs(month).format('MMMM YYYY')}
              </p>
              <div
                style={{
                  height: '100%',
                  maxHeight: '300px',
                  width: '100%',
                  overflowY: 'scroll',
                }}>
                {highlightedDays.map((highlightedDay) => {
                  const matchingTasks = tasks.filter(
                    (task) => task.taskid === highlightedDay.taskid
                  );
                  const matchingEvents = events.filter(
                    (event) => event.eventid === highlightedDay.taskid
                  );
                  return [
                    ...matchingTasks.map((task) => (
                      <motion.div
                        initial={{ x: 25, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'default',
                          borderTop: '1px solid var(--SparesOrange)',
                        }}
                        key={task.taskid}>
                        <MdTask size={28} />
                        <div style={{ margin: '5px 10px' }}>
                          <p>Task: {task.tasktitle}</p>
                          <p className="subtitle">
                            Due Date: {dayjs(task.duedate).format('DD/MM/YYYY')}
                          </p>
                        </div>
                      </motion.div>
                    )),
                    ...matchingEvents.map((event) => (
                      <motion.div
                        initial={{ x: 25, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'default',
                          borderTop: '1px solid var(--SparesOrange)',
                        }}
                        key={event.eventid}>
                        <MdCalendarMonth size={28} />
                        <div style={{ margin: '5px 10px' }}>
                          <p>Event: {event.eventtitle}</p>
                          <p className="subtitle">
                            Event Date:{' '}
                            {dayjs(event.eventdate).format('DD/MM/YYYY')}
                          </p>
                        </div>
                      </motion.div>
                    )),
                  ];
                })}
              </div>
            </Grid>
          </Grid>
          <h3>Hall of Shame</h3>
          <TableOfShame />
          <Grid sx={{ maxHeight: '800px', overflowY: 'scroll' }} container>
            <Grid item xs={12} md={6} lg={4}>
              {auth.user.role.includes('Coordinator') ? (
                <>
                  <h3
                    className="with-leading"
                    style={{
                      color: 'var(--SparesOrange)',
                      justifyContent: 'flex-start',
                    }}>
                    <MdPeople />
                    &nbsp;Batches
                  </h3>
                  <p className="subtitle">
                    Showing Batches in <b>{auth.user.institution}</b>
                  </p>
                  {batchs &&
                    batchs.map((batch) => (
                      <ItemCard
                        typeOfItem="batch"
                        itemid={batch.batchid}
                        title={batch.batchname}
                        dueDate={dayjs(batch.batchyear).format('YYYY')}
                        coordinatorDesignated={true}
                        dateFrom={
                          batch.name ===
                          auth.user.firstName + ' ' + auth.user.lastName
                            ? 'You'
                            : batch.name
                        }
                      />
                    ))}
                </>
              ) : (
                <>
                  <h3
                    className="with-leading"
                    style={{
                      color: 'var(--SparesOrange)',
                      justifyContent: 'flex-start',
                    }}>
                    <MdBook />
                    &nbsp;Your Approved Projects
                  </h3>
                  <p className="subtitle">&nbsp;</p>
                  {projects &&
                    projects.map((project) => (
                      <ItemCard
                        typeOfItem="project"
                        itemid={project.projectid}
                        title={project.projecttitle}
                        dueDate={''}
                        type={project.projecttype}
                        coordinatorDesignated={false}
                        dateFrom={'You'}
                      />
                    ))}
                </>
              )}
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <h3
                className="with-leading"
                style={{
                  color: 'var(--SparesOrange)',
                  justifyContent: 'flex-start',
                }}>
                <IoMdDocument />
                &nbsp;Your Tasks
              </h3>
              <p className="subtitle">&nbsp;</p>
              {tasks.map((task) => (
                <ItemCard
                  typeOfItem="task"
                  itemid={task.taskid}
                  title={task.tasktitle}
                  dueDate={task.duedate}
                  coordinatorDesignated={
                    auth.user.role.includes('Coordinator')
                      ? true
                      : task.iscoordinator
                  }
                  dateFrom={
                    auth.user.role.includes('Coordinator') ? 'You' : task.name
                  }
                />
              ))}
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <h3
                className="with-leading"
                style={{
                  color: 'var(--SparesOrange)',
                  justifyContent: 'flex-start',
                }}>
                <MdCalendarMonth />
                &nbsp;Events
              </h3>
              <p className="subtitle">
                Showing {auth.user.role.includes('Coordinator' ? 'all' : '')}{' '}
                Events in <b>{auth.user.institution}</b>
              </p>
              {events.map((event) => (
                <ItemCard
                  typeOfItem="event"
                  itemid={event.eventid}
                  title={event.eventtitle}
                  dueDate={event.eventdate}
                  coordinatorDesignated={
                    auth.user.role.includes('Coordinator')
                      ? true
                      : event.iscoordinator
                  }
                  dateFrom={
                    event.eventhead === auth.user.specialid ? 'You' : event.name
                  }
                />
              ))}
            </Grid>
          </Grid>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default StaffMainPage;
