import { Grid } from '@mui/material';
import ComplaintCard from '../ComplaintCard';
import AuthUser from '../../../context/AuthUserContext';
import { useContext, useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router';
import useGet from '../../../hooks/api/useGet';
import ErrorPanel from './ErrorPanel';

const ComplaintsPage = () => {
  const { state, handleGet } = useGet();
  const { auth } = useContext(AuthUser);
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchItem();
  }, []);

  const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;

  const fetchItem = () => {
    if (auth.user.role === 'Student') {
      handleGet(url + 'complaint/fetchmine/' + auth.user.specialid);
    } else {
      const institution = auth.user.institution.replace(/ /g, '_');
      handleGet(url + 'complaint/fetch/' + institution);
    }
  };

  useEffect(() => {
    if (state.data) {
      state.data.status === 200 ? setComplaints(state.data.complaints) : null;
    }
  }, [state.data]);


  return (
    <>
      {state.error ? (
        <ErrorPanel />
      ) : (
        <>
          <h1>Complaints</h1>
          {auth.user.role === 'Student' ? (
            <button
              onClick={() => {
                navigate(currentLocation.pathname + '/create');
              }}
              style={{
                maxWidth: '200px',
                marginTop: '15px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
              }}>
              <MdAdd size={24} />
              &nbsp;Create a new issue
            </button>
          ) : null}

          <Grid sx={{ padding: '25px 0' }} container spacing={2}>
            {complaints ? (
              complaints.map((complaint: any) => {
                return <ComplaintCard {...complaint} />;
              })
            ) : state.error ? (
              <p>Error!</p>
            ) : (
              <p>Loading...</p>
            )}
          </Grid>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              height: '80px',
              alignItems: 'center',
            }}></div>
        </>
      )}
    </>
  );
};

export default ComplaintsPage;
