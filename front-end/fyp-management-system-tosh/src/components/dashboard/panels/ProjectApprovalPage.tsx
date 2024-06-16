import { useEffect, useState } from 'react';
import useGet from '../../../hooks/api/useGet';
import { useParams } from 'react-router';
import ProjectApprovalCard from '../ProjectApprovalCard';
import {
  Grid,
  Snackbar,
  TextField,
  Alert,
  AlertColor,
  Slide,
} from '@mui/material';
import { MdCreate, MdDelete } from 'react-icons/md';

const ProjectApprovalPage = () => {
  const { state, handleGet } = useGet();
  const { batchid } = useParams();

  const [projects, setProjects] = useState([]);
  const [onDelete, setOnDelete] = useState([]);

  useEffect(() => {
    handleGet(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
        'project/fetch/unapproved/' +
        batchid
    );
  }, []);

  useEffect(() => {
    if (state.data !== null) {
      setProjects(state.data.projects);
      setOnDelete(state.data.onDeletion);
    }
  }, [state.data]);

  useEffect(() => {
    if (projects.length > 0) {
      filterProjects();
    }
  }, [projects]);

  const [search, setSearch] = useState('');

  const onChange = (e: any) => {
    setSearch(e.target.value);
  };

  const [filteredProjects, setFilteredProjects] = useState([]);

  const filterProjects = () => {
    setFilteredProjects(
      projects.filter((project: any) => {
        return project.projecttitle
          .toLowerCase()
          .includes(search.toLowerCase());
      })
    );
  };

  useEffect(() => {
    if (projects.length > 0) {
      filterProjects();
    } else setFilteredProjects([]);
  }, [search]);

  const [snackState, setSnackState] = useState({
    open: false,
    message: '',
    severity: 'success' as AlertColor,
  });

  const openSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackState({
      open: true,
      message: message,
      severity: severity,
    });
  };

  const closeSnackbar = () => {
    setSnackState({
      open: false,
      message: '',
      severity: 'success',
    });
  };

  useEffect(() => {
    if (state.data) {
      if (snackState.open) {
        handleGet(
          import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
            'project/fetch/unapproved/' +
            batchid
        );
      }
    }
  }, [snackState.open]);

  return (
    <div>
      <Snackbar
        open={snackState.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}>
        <Alert
          sx={{ width: '100vh' }}
          severity={snackState.severity as AlertColor}>
          {snackState.message}
        </Alert>
      </Snackbar>
      <h1>Project title requests</h1>
      <TextField
        onChange={onChange}
        name="search"
        value={search}
        sx={{ margin: '10px 0' }}
        fullWidth
        label="Search for a project"
        variant="outlined"
      />
      <h3 style={{justifyContent:'flex-start', color:'var(--GoodGreen)'}} className='with-leading'><MdCreate />&nbsp;Creation/Modification</h3>
      <Grid style={{marginBottom:'10px'}} container spacing={2}>
        {state.data
          ? filteredProjects.map((project: any) => {
              return (
                <Grid item xs={12}>
                  <ProjectApprovalCard
                    openSnackbar={openSnackbar}
                    id={project.projectid}
                    title={project.projecttitle}
                    supervisor={project.name}
                    type={project.projecttype}
                    description={project.projectdescription}
                    imageUrl={project.projectimage}
                  />
                </Grid>
              );
            })
          : null}
      </Grid>
      <h3 style={{justifyContent:'flex-start', color:'var(--IndicatorRed)'}} className='with-leading'><MdDelete />&nbsp;Deletion</h3>
      <Grid style={{marginBottom:'10px'}} container spacing={2}>
            {
              state.data ?
              onDelete.map((project: any) => {
                return (
                  <Grid item xs={12}>
                    <ProjectApprovalCard
                      openSnackbar={openSnackbar}
                      id={project.projectid}
                      title={project.projecttitle}
                      supervisor={project.name}
                      type={project.projecttype}
                      description={project.projectdescription}
                      imageUrl={project.projectimage}
                      forDeletion={true}
                    />
                  </Grid>
                );
              }) : null
            }
      </Grid>
    </div>
  );
};

export default ProjectApprovalPage;
