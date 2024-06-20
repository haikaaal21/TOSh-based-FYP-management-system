import { useContext, useEffect, useState } from 'react';
import AuthUser from '../../../context/AuthUserContext';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router';
import { Grid } from '@mui/material';
import useGet from '../../../hooks/api/useGet';
import ItemCard from '../ItemCard';
import Loading from '../../Loading';
import ErrorPanel from './ErrorPanel';

const StaffDeadlinesPage = () => {
  const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;
  const { auth } = useContext(AuthUser);
  const goto = useNavigate();

  const { state, handleGet } = useGet();

  const [tasks, setTasks] = useState([] as any);
  const [ownTasks, setOwnTasks] = useState([] as any);

  const fetch = (supervisor: boolean) => {
    if (supervisor) {
      handleGet(
        `${url}task/fetchStaffTasks/${auth.user.id}/${auth.user.specialid}/false`
      );
    } else {
      handleGet(
        `${url}task/fetchStaffTasks/${auth.user.id}/${auth.user.specialid}/true`
      );
    }
  };

  useEffect(() => {
    fetch(auth.user.role.includes('Supervisor'));
  }, []);

  useEffect(() => {
    if (state.data) {
      auth.user.role.includes('Supervisor') ? setTasks(state.data.tasks) : null;
      setOwnTasks(state.data.createdTask);
    }
  }, [state]);

  return (
    <>
      {state.error ? (
        <ErrorPanel />
      ) : state.data ? (
        <>
          <h1>Deadlines</h1>
          {auth.user.role.includes('Supervisor') ? (
            <>
              <h3>Tasks to finish</h3>
              <Grid container>
                {tasks.map((task: any) => {
                  return (
                    <Grid item xs={12} md={4}>
                      <ItemCard
                        typeOfItem="task"
                        itemid={task.taskid}
                        title={task.tasktitle}
                        dateFrom={task.name}
                        dueDate={task.duedate}
                        coordinatorDesignated={task.iscoordinator}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </>
          ) : null}
          <Grid container>
            <Grid item xs={12} md={6}>
              <h3>Tasks you've created</h3>
            </Grid>
            <Grid item xs={12} md={6}>
              <button
                onClick={() => goto('../create?type=Task')}
                className="buttonWithLeading">
                <MdAdd />
                &nbsp;Create a new Task
              </button>
            </Grid>
          </Grid>
          <Grid container>
            {ownTasks.map((task: any) => {
              return (
                <Grid item xs={12} md={4}>
                  <ItemCard
                    typeOfItem="task"
                    itemid={task.taskid}
                    title={task.tasktitle}
                    dateFrom="You"
                    dueDate={task.duedate}
                    coordinatorDesignated={
                      auth.user.role.includes('Coordinator') ? true : false
                    }
                  />
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default StaffDeadlinesPage;
