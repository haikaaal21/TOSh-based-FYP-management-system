import {
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ProjectCard from '../ProjectCard';
import ProjectCardProps from '../../../types/ProjectCardProps';
import { useContext, useEffect, useState } from 'react';
import useGet from '../../../hooks/api/useGet';
import { BiSearch } from 'react-icons/bi';
import AuthUser from '../../../context/AuthUserContext';

const ProjectsPage = () => {
  const goto = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { auth } = useContext(AuthUser);

  const handleNavigate = () => {
    goto(pathname + '/yourproject');
  };

  const { handleGet, state } = useGet();
  const [datas, setDatas] = useState<ProjectCardProps[]>();
  const [offset, setOffset] = useState(0);

  const updateDatas = (data: any) => {
    const projectCards: ProjectCardProps[] = [];
    data.forEach((project: any) => {
      const projectCard: ProjectCardProps = {
        projectid: project.projectid,
        projectimg: project.projectimage,
        projecttitle: project.projecttitle,
        supervisorname: project.supervisorname,
        typeofproject: project.projecttype,
        projectdescription: project.projectdescription,
      };
      projectCards.push(projectCard);
    });
    setDatas(projectCards);
  };

  useEffect(() => {
    handleGet(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
        `project/fetchall/${auth.user.id}/${auth.user.batchid}/` +
        offset
    );
  }, []);

  useEffect(() => {});

  useEffect(() => {
    if (state.data !== null) {
      updateDatas(state.data.projects);
    }
  }, [state.data]);

  //!! Revise Data fetching!
  const changePage = () => {
    setOffset(offset + 6);
    handleGet(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
        `project/fetchall/${auth.user.id}/${auth.user.batchid}/` +
        offset
    );
  };

  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event: any) => {
    setSearchValue(event.target.value);
  };

  //? Search Items
  const handleSearch = (event: any) => {
    if (event.key === 'Enter') {
      fetchProject(event);
    }
  };

  const fetchProject = (event: any) => {
    event.preventDefault();
    let endQuery = '?';
    if (searchValue !== '') {
      endQuery += `search=${searchValue}&`;
    }
    if (filter !== '') {
      endQuery += `filter=${filter}&`;
    }
    handleGet(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
        `project/fetchall/${auth.user.id}/${auth.user.batchid}/` +
        offset +
        endQuery
    );
    console.log(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
        `project/fetchall/${auth.user.id}/${auth.user.batchid}/` +
        offset +
        endQuery
    );
  };

  useEffect(() => {
    console.log('datas', datas);
  });

  //? Filter Items
  const [filter, setFilter] = useState('');
  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
    fetchProject(event);
  };

  return (
    <>
      <Grid
        sx={{ display: 'flex', alignItems: 'center' }}
        container
        spacing={0}>
        <Grid item lg={10} sm={8} xs={12}>
          <h1>Projects</h1>
        </Grid>
        {auth.user.projectid ? (
          <Grid item lg={2} sm={4} xs={12}>
            <button onClick={handleNavigate}>Your Project</button>
          </Grid>
        ) : null}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} lg={10}>
          <p>
            <b>Search for a Project</b>
          </p>
          <TextField
            value={searchValue}
            onChange={(event) => handleSearchChange(event)}
            onKeyDown={(event) => handleSearch(event)}
            id="search"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <BiSearch />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={2}>
          <p>
            <b>Filter</b>
          </p>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter}
            label="Age"
            fullWidth
            onChange={(event) => handleFilterChange(event)}>
            <MenuItem value={''}>
              <p>All</p>
            </MenuItem>
            {state.data &&
              state.data.tagItems?.map((tag: any) => {
                return (
                  <MenuItem value={tag.tagname}>
                    <p>{tag.tagname}</p>
                  </MenuItem>
                );
              })}
          </Select>
        </Grid>
      </Grid>
      <Grid sx={{ width: '100%', padding: '1rem 0' }} container spacing={2}>
        {datas && state.data ? (
          state.data.projects.length > 0 ? (
            datas.map((project: ProjectCardProps) => {
              return <ProjectCard {...project} />;
            })
          ) : state.data.projects.length === 0 ? (
            <p>No projects available</p>
          ) : (
            <p>Loading</p>
          )
        ) : (
          <p>Error, could not retrieve datas!</p>
        )}
      </Grid>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80px',
        }}>
        {state.data && state.data.length / 6 > 1 ? (
          <Pagination
            className="pagination"
            count={state.data !== null ? Math.round(state.data.length / 6) : 1}
            color="primary"
            variant="outlined"
            onClick={changePage}
          />
        ) : null}
      </div>
    </>
  );
};

export default ProjectsPage;
