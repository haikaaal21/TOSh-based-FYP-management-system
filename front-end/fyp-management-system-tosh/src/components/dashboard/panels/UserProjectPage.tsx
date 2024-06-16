import { useContext, useEffect, useState } from 'react';
import useGet from '../../../hooks/api/useGet';
import AuthUser from '../../../context/AuthUserContext';
import ErrorPanel from './ErrorPanel';
import { Card, Grid } from '@mui/material';
import { MdCalendarMonth, MdPerson } from 'react-icons/md';
import { FaFolder } from 'react-icons/fa';
import Loading from '../../Loading';
import Chart from 'react-google-charts';
import DefaultImage from '../../../assets/images/default/Project.png';
import ItemCard from '../ItemCard';
import { IoMdDocument } from 'react-icons/io';

const UserProject = () => {
  const { auth } = useContext(AuthUser);
  const { state, handleGet } = useGet();
  const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;
  const [project, setProject] = useState<any>();
  const [tasks, setTasks] = useState<any>([]);
  const [events, setEvents] = useState<any>([]);

  useEffect(() => {
    handleGet(
      `${url}project/getMine/${auth.user.specialid}?userid=${auth.user.id}`
    );
  }, []);

  useEffect(() => {
    if (state.data) {
      setProject(state.data.project[0]);
      setTasks(state.data.tasks);
      setEvents(state.data.events);
    }
  }, [state.data]);

  useEffect(() => {
    console.log(state.data);
  })

  return (
    <>
      {state.error ? (
        <ErrorPanel />
      ) : state.data && project ? (
        <>
          <Card className="project-hero" sx={{ borderRadius: '20px' }}>
            <div className="hero-container">
              <p>PID#{project.projectid}</p>
              <h2 style={{ lineHeight: '1.3', fontSize: '28pt' }}>
                {project.projecttitle}
              </h2>
              <p style={{ height: '60px', overflow: 'clip' }}>
                {project.projectdescription}
              </p>
              <p>
                <span>
                  <MdPerson />{' '}
                </span>{' '}
                Supervisor:<b> {project.name}</b>
              </p>
              <p>
                <span>
                  <FaFolder />
                </span>{' '}
                Type of Project: <b>{project.projecttype}</b>
              </p>
              <div></div>
            </div>
            <img
              src={
                state.data.project[0].projectimage
                  ? import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
                  state.data.project[0].projectimage
                  : DefaultImage
              }
              alt={DefaultImage}
              className="hero-container"
            />
          </Card>
          <h3 style={{
            marginTop:'20px'
          }}><IoMdDocument /> Tasks</h3>
          <div style={{display:'flex', alignItems:'center', overflowX:'scroll'}}>
            {
              tasks.length > 0 ? (
                tasks.map((task: any) => (
                  <div style={{marginRight:'15px'}}>
                  <ItemCard
                    itemid={task.taskid}
                    typeOfItem="task"
                    title={task.tasktitle}
                    dateFrom={project.name}
                    dueDate={task.duedate}
                    coordinatorDesignated={false}
                  />
                  </div>
                ))
              ) : (
                <p>No tasks available</p>
              )
            }
          </div>
          <h3><MdCalendarMonth/> Events</h3>
          <div style={{display:'flex', alignItems:'center', overflowX:'scroll'}}>
            {
              events.length > 0 ? (
                events.map((event: any) => (
                  <div style={{marginRight:'15px'}}>
                  <ItemCard
                    itemid={event.eventid}
                    typeOfItem="event"
                    title={event.eventtitle}
                    dateFrom={project.name}
                    dueDate={event.eventdate}
                    coordinatorDesignated={false}
                  />
                  </div>
                ))
              ) : (
                <p>No events available</p>
              )
            }
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default UserProject;
