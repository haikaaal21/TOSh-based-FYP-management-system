import { useContext, useEffect, useState } from 'react';
import useGet from '../../../hooks/api/useGet';
import AuthUser from '../../../context/AuthUserContext';
import { MdAdd } from 'react-icons/md';
import { Divider, Grid, InputAdornment, TextField } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import { BiSearch } from 'react-icons/bi';
import ProjectCard from '../ProjectCard';
import { IoMdClock, IoMdThumbsUp } from 'react-icons/io';
import Loading from '../../Loading';
import ErrorPanel from './ErrorPanel';

const MyProjectsPage = () => {
  const { state, handleGet } = useGet();
  const [projects, setProjects] = useState([]);
  const [onDeletion, setOnDeletion] = useState([]);
  const { auth } = useContext(AuthUser);
  const { pathname } = useLocation();
  const goto = useNavigate();

  const navigateToCreate = (event: any) => {
    event.preventDefault();
    goto(pathname + '/create');
  };

  useEffect(() => {
    handleGet(
      `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}project/fetchstaffs/${auth.user.specialid}`
    );
  }, []);

  useEffect(() => {
    if (state.data) {
      setProjects(state.data.projects);
      setOnDeletion(state.data.onDeletion);
    }
  }, [state.data]);

  return (
    <>
      {state.error ? (
        <ErrorPanel />
      ) : (
        <>
          <h1>My Projects</h1>
          <form
            style={{
              display: 'flex',
              padding: '10px 0px',
            }}>
            <TextField
              id="search"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <BiSearch />
                  </InputAdornment>
                ),
              }}
            />
          </form>
          <button
            onClick={(event) => navigateToCreate(event)}
            style={{
              maxWidth: '250px',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}>
            <MdAdd />
            &nbsp;Create a new project
          </button>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              height: '80vh',
              padding: '10px 15px',
            }}>
            {state.data ? (
              projects?.length > 0 ? (
                // Make a list of projects whether it has been approved or not
                <>
                  <h2>
                    <IoMdThumbsUp /> Approved Projects
                  </h2>
                  <Grid sx={{ minHeight: '500px' }} container>
                    {projects.map((project: any) => {
                      return project.approvalstatus ? (
                        <ProjectCard
                          key={project.projectid}
                          projectid={project.projectid}
                          projectimg={project.projectimage}
                          projecttitle={project.projecttitle}
                          projectdescription={project.projectdescription}
                          supervisorname="You"
                          typeofproject={project.projecttype}
                          projectBatch={project.batchname}
                          projectNotification={project.pendingrequests}
                        />
                      ) : null;
                    })}
                  </Grid>
                  <Divider
                    sx={{
                      height: '30px',
                    }}
                  />
                  <h2>
                    <IoMdClock /> Pending for approval Projects
                  </h2>
                  <Grid sx={{ minHeight: '500px' }} gap={2} container>
                    {projects.map((project: any) => {
                      return !project.approvalstatus ? (
                        <ProjectCard
                          key={project.projectid}
                          projectid={project.projectid}
                          projectimg={project.projectimage}
                          projecttitle={project.projecttitle}
                          projectdescription={project.projectdescription}
                          supervisorname="You"
                          typeofproject={project.projecttype}
                          projectBatch={project.batchname}
                        />
                      ) : null;
                    }
                    )}
                    {
                      onDeletion.map((project: any) => {
                        return (
                          <ProjectCard
                            key={project.projectid}
                            projectid={project.projectid}
                            projectimg={project.projectimage}
                            projecttitle={project.projecttitle}
                            projectdescription={project.projectdescription}
                            supervisorname="You"
                            typeofproject={project.projecttype}
                            projectBatch={project.batchname}
                            projectNotification={project.pendingrequests}
                            pendingForDeletion={true}
                          />
                        );
                      }
                      )
                    }
                  </Grid>
                </>
              ) : (
                <>
                  <h2>You have no projects</h2>
                  <button
                    onClick={(event) => navigateToCreate(event)}
                    style={{
                      maxWidth: '250px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                    }}>
                    <MdAdd />
                    &nbsp;Create a new project
                  </button>
                </>
              )
            ) : (
              <Loading />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default MyProjectsPage;
