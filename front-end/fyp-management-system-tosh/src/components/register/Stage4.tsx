import { Button, CircularProgress, Container, Stack } from '@mui/material';
import image from '../../assets/images/placeholder.jpeg';
import AccountContext from '../../context/AccountContext';
import { useContext, useEffect, useState } from 'react';
import usePost from '../../hooks/api/usePost';
import { motion } from 'framer-motion';

const Stage4 = () => {
  //TODO : Fix the error academic staff registration (Object didn't finalize properly);

  const { account } = useContext(AccountContext);
  const { state, handlePost } = usePost();
  const [url, setUrl] = useState('');

  const setURL = () => {
    let url = 'http://localhost:4000/user/signup/';
    account.typeOfStaff === undefined ? (url += 'student') : (url += 'staff');
    setUrl(url);
  };

  useEffect(() => {
    setURL();
  }, []);

  useEffect(() => {
    if (url !== '') {
      handlePost(url, account);
    }
  }, [url]);

  return (
    <Container>
      <div
        style={{
          justifyContent: 'center',
        }}
        className="stage"
        id="stage-3">
        <img
          src={image}
          style={{
            aspectRatio: '1/1',
            width: '70%',
            margin: '1rem 0',
          }}
          alt=""
        />
        <Container
          sx={{
            margin: '0 0 1em 0',
          }}>
          {state.error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <h3>There was an error creating your account</h3>
              <p>Please try again later</p>
            </motion.div>
          ) : state.data ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <h3>Account creation successful</h3>
              <p>Click the button below to go back to the home page</p>
            </motion.div>
          ) : state.loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <h3>Creating account</h3>
              <CircularProgress />
            </motion.div>
          ) : (
            <div>
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                spacing={4}>
                <h3 style={{ textAlign: 'left' }}>Packaging Application</h3>{' '}
                <CircularProgress />
              </Stack>
            </div>
          )}
        </Container>
        {state.data ? (
          <Button
            onClick={() => (window.location.href = '/')}
            variant="contained"
            color="primary"
            fullWidth>
            Back to home
          </Button>
        ) : null}
      </div>
    </Container>
  );
};

export default Stage4;
