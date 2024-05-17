import { Grid } from '@mui/material';
import AuthUser from '../../../context/AuthUserContext';
import { useContext } from 'react';

const StaffMainPage = () => {
  const { auth } = useContext(AuthUser);

  return (
    <>
      <p>Welcome Back</p>
      <h1>{auth.firstname}</h1>
      <p>Events</p>
      <p>Grid here with the calendar</p>
      <Grid container>
        <Grid item xs={12} md={6} lg={4}>
          <h3>Your Batches</h3>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <h3>Your Tasks</h3>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <h3>Your Events</h3>
        </Grid>
      </Grid>
    </>
  );
};

export default StaffMainPage;
