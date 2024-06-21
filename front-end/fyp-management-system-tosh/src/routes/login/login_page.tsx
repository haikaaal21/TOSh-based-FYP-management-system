import { useContext, useEffect, useState } from 'react';
import './login_style.css';
import SparesLogoFull from '../../components/svgcomponents/spares_logo_full';
import '../basic-formcss.css';
import useIsLoading from '../../hooks/ui/is_loading';
import Cookies from 'js-cookie';
import useOK from '../../hooks/auth/useOK';
import useIdentify from '../../hooks/routing/useIdentify';
import {
  Grid,
  TextField,
  Container,
  Snackbar,
  Alert,
  AlertColor,
} from '@mui/material';
import { motion } from 'framer-motion';
import AuthUser from '../../context/AuthUserContext';
import { MdLogin } from 'react-icons/md';
import Loading from '../../components/Loading';
import LoginImage from '../../assets/images/login.png';
import { Link, useLocation } from 'react-router-dom';

/**! ERRORS
 * 1. Logging in if the value is empty will cause an infinite loading button (Check the isLoading boolean)
 * 2. The error message is not being displayed properly
 * 3. Validator doesn't seem to work properly
 * 4. Layouting Issues
 */
const LoginPage = () => {

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const message = query.get('message');
  //* Validator Hooks
  useEffect(() => {
    document.title = 'Login';
  }, []);

  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const { isLoading, startLoading, stopLoading } = useIsLoading();
  const { greenFlag, redFlag } = useOK();
  const [errors, setErrors] = useState({} as { [key: string]: string });
  const { identify } = useIdentify();
  const { loginUser } = useContext(AuthUser);

  const handleChange = (e: any) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const validate = (values: any) => {
    const errors = {} as { [key: string]: string };
    // const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //TODO: Fix Regex and validation for all
    if (!values.email) {
      errors.email = 'Valid email is required';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be more than 6 characters';
    }
    return errors;
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      stopLoading();
    }
  }, [errors]);

  //* Handling Submission (API Fetcher)
  const handleSubmit = (event: any) => {
    event.preventDefault();
    startLoading();
    const previousErrors = validate(values);
    setErrors(previousErrors);

    if (Object.keys(previousErrors).length === 0) {
      fetch(`${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then((data) => {
          const token = data.accessToken;
          const refreshToken = data.refreshToken;
          Cookies.set('accessToken', token, { expires: 4 * 60 });
          Cookies.set('refreshToken', refreshToken, {
            expires: 5 * 24 * 60,
          });
          greenFlag();
          loginUser(data.user, data.role.toString());
          identify(data.role.toString()); //? This thing s the user toz the correct page
          window.location.reload();
        })
        .catch((error) => {
          if (typeof error.json == 'function') {
            error
              .json()
              .then(() => {
                setSnackbar({
                  open: true,
                  message: 'Incorrect Email or Password!',
                  severity: 'error',
                });
              })
              .catch(() => {
                setSnackbar({
                  open: true,
                  message: 'An error occured while fetching data',
                  severity: 'error',
                });
              })
          } else {
            setSnackbar({
              open: true,
              message: 'An error occured while fetching data',
              severity: 'error',
            });
          }
          redFlag();
        });
      setValues({ email: '', password: '' });
      stopLoading();
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0) {
    }
  }, [errors]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  return (
    <Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          sx={{ width: '100vh' }}
          severity={snackbar.severity as AlertColor}
          variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
      <motion.div
        initial={{ translateY: 10, opacity: 0 }}
        animate={{
          translateY: 0,
          opacity: 1,
          transition: { ease: 'easeOut' },
        }}
        exit={{ opacity: 0 }}
        className="login">
        <div className="item">
          <img
            style={{
              aspectRatio: '3/4',
              width: '80%',
              maxHeight: '800px',
              borderRadius: '10px',
            }}
            src={LoginImage}
            alt="Test-Image"
          />
        </div>
        <div className="item">
          <Grid container spacing={2}>
            <Grid item md={4} xs={12}>
              <SparesLogoFull />
            </Grid>
            <Grid item md={6} xs={12}></Grid>
          </Grid>
          <h1
            style={{
              width: '100%',
              fontSize: '35pt',
              fontWeight: '600',
            }}>
            Welcome Back!
          </h1>
          <p style={{ textAlign: 'left', width: '100%' }}>
            Don't have an account?
            <Link to="/register">&nbsp;Click here to get started.</Link>
          </p>
          <form
            style={{ padding: '35px 0' }}
            onSubmit={(event) => handleSubmit(event)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  id="email"
                  name="email"
                  error={errors.email ? true : false}
                  helperText={errors.email}
                  fullWidth
                  onChange={handleChange}
                  value={values.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={handleChange}
                  value={values.password}
                  error={errors.password ? true : false}
                  helperText={errors.password}
                  label="Password"
                  name="password"
                  type="password"
                  id="password"
                  fullWidth
                />
                <p>{errors.password}</p>
              </Grid>
              <Grid item xs={12}>
                {isLoading ? (
                  <Loading />
                ) : (
                  <button className="full-width" type="submit">
                    <MdLogin />
                    &nbsp;Log in
                  </button>
                )}
              </Grid>
            </Grid>
          </form>
          <p>Forgot your password?</p>
          {
            message? <p style={{backgroundColor:'var(--GoodGreen)', padding:'10px 5px'}}>{message}</p> : null
          }
          <Link to="/forgotPassword">Click here to reset your password</Link>
        </div>
      </motion.div>
    </Container>
  );
};

export default LoginPage;
