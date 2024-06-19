import {
  Avatar,
  AvatarGroup,
  Card,
  Divider,
  Grid,
  Tooltip,
} from '@mui/material';
import '../../../styles/yourFYP.css';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import useGet from '../../../hooks/api/useGet';
import { MdEdit, MdPerson } from 'react-icons/md';
import { FaFolder } from 'react-icons/fa';
import AuthUser from '../../../context/AuthUserContext';
import usePost from '../../../hooks/api/usePost';
import MDEditor from '@uiw/react-md-editor';
import { IoMdEye } from 'react-icons/io';
import DefaultImage from '../../../assets/images/default/PFP.png';
import DefaultProjectImage from '../../../assets/images/default/Project.png';

const YourProjectPage = () => {
  const { projectid } = useParams<{ projectid: string }>();
  const { handleGet, state } = useGet();
  const { auth } = useContext(AuthUser);
  const [project, setProject] = useState<any>(null);
  const [check, setCheck] = useState<any>(null);
  const { handlePost } = usePost();
  useEffect(() => {
    handleGet(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
        `project/getProject/${projectid}/${auth.user.specialid}`
    );
  }, []);

  useEffect(() => {
    if (state.data !== null) {
      setProject(state.data.project);
      setCheck(state.data.check.length > 0 ? true : false);
      getMarkDown();
    }
  }, [state.data]);

  const getMarkDown = async () => {
    const markdownurl =
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + '/assets' +
      state.data.project.intromarkdown;
    fetch(markdownurl)
      .then((response) => response.text())
      .then((text) => setMarkdown(text));
  };

  const requestForProject = async () => {
    handlePost(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
        'project/requestToPartake',
      {
        studentid: auth.user.specialid,
        projectid: projectid,
      }
    );
    window.location.reload();
  };

  const goto = useNavigate();


  const editProject = async () => {
    const jsonItem = JSON.stringify({
      title: project.projecttitle,
      description: project.projectdescription,
      type: project.projecttype,
      batch: '',
      markdown: markdown,
      image: null,
    });
    sessionStorage.setItem('project', jsonItem);

    goto('../projects/create?edit=true&projectid=' + projectid);
  };

  const [markdown, setMarkdown] = useState('');


  return (
    <>
      {project && state.data !== null ? (
        <>
          {state.data.check[0] && state.data.check[0].requeststatus ? (
            <Navigate to="../MyProject" />
          ) : null}
          <div style={{ height: '25px' }} />
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
                Supervisor:<b> {project.supervisorname}</b>
              </p>
              <p>
                <span>
                  <FaFolder />
                </span>{' '}
                Type of Project: <b>{project.projecttype}</b>
              </p>
              <div>
                <Tooltip
                  title={
                    project.students && project.students.length > 0
                      ? `${project.students[0].name} ${project.students.length > 1 ? `and ${project.students.length - 1} others are participating in this project` : 'is participating in this project'}`
                      : null
                  }>
                  <AvatarGroup
                    style={{ width: 'fit-content' }}
                    max={5}
                    spacing="small">
                    {project.students.map((student: any) => (
                      <Avatar
                        alt={student.name}
                        src={
                          student.profilepic
                            ? import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + '/assets' +
                              student.profilepic
                            : DefaultImage
                        }
                      />
                    ))}
                  </AvatarGroup>
                </Tooltip>
              </div>
            </div>
            <img
              src={
                state.data.project.projectimage
                  ? import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + '/assets' +
                  state.data.project.projectimage
                  : DefaultProjectImage
              }
              alt=""
              className="hero-container"
            />
          </Card>
          <div style={{ height: '25px' }} />

          {/** MyProjectSection */}
          {check > 0 && check.requeststatus ? (
            <Grid style={{ padding: '15px 0' }} container spacing={3}>
              <Grid item xs={12} sm={6}>
                <h3 style={{ fontWeight: '500' }}>Tasks</h3>
                <div
                  style={{
                    width: '60%',
                    padding: '10px 0',
                  }}></div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <h3 style={{ fontWeight: '500' }}>Events</h3>
              </Grid>
            </Grid>
          ) : (
            <>
              {auth.user.role === 'Student' ? (
               auth.user.projectid && auth.user.requeststatus === true ? (
               <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:'var(--NeutralGrey)',
                  color:'white',
                  padding:'4px 0'
               }}>
                <p>You already have a project</p>
               </div>
               ) : (
                <button
                className="full-width"
                onClick={requestForProject}
                disabled={check || !project.recruitment}>
                {check
                  ? 'You already have requested to partake in this project'
                  : project.recruitment
                    ? 'Request to partake project'
                    : 'Recruitment is closed'}
              </button>
               )
              ) : auth.user.specialid === project.supervisorid && project.batchstatus === 'Preparation' ? (
                <Grid gap={1} container>
                  <Grid item xs={12} md={5.5}>
                    <button
                      onClick={() => {
                        goto('./requests');
                      }}
                      className="buttonWithLeading">
                      <IoMdEye />
                      &nbsp;Show Requests
                    </button>
                  </Grid>
                  <Grid item xs={12} md={5.5}>
                        <button
                      onClick={editProject}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <MdEdit />
                      &nbsp;Edit Project
                    </button>
                  </Grid>
                </Grid>
              ) : null}
              {state.data.project.intromarkdown ? (
                <Grid>
                  <h3
                    style={{
                      fontWeight: '500',
                      padding: '15px 0',
                    }}>
                    More about this project
                  </h3>
                  <Divider />
                  <div
                    style={{
                      height: '80vh',
                      overflowY: 'scroll',
                      padding: '10px',
                      border: '1px solid var(--NeutralGrey)',
                    }}
                    data-color-mode="light">
                    <div
                      style={{
                        position: 'sticky',
                        top: '0',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 0',
                      }}>
                      <p className="subtitle">README.md</p>
                    </div>
                    <MDEditor.Markdown source={markdown} />
                  </div>
                </Grid>
              ) : null}
            </>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default YourProjectPage;
