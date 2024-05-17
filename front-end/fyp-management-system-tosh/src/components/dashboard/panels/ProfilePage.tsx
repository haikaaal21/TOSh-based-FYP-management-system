import { Card, CardActionArea, CardMedia, Divider, Grid } from '@mui/material';
import AuthUser from '../../../context/AuthUserContext';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs';
import useGet from '../../../hooks/api/useGet';
import { MdEdit, MdLogout } from 'react-icons/md';
import Cookies from 'js-cookie';
import Popup from '../Popup';

const ProfilePage = () => {
  const { auth } = useContext(AuthUser);
  const { handleGet, state } = useGet();
  const { id } = useParams();
  const [userData, setUserData] = useState<any>({});
  const [detailsData, setDetailsData] = useState<any>(null);
  const [openPop, setOpenpop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    handleGet(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
        'user/fetchprofile/' +
        id
    );
  }, [id]);

  useEffect(() => {
    if (state.data !== null) {
      setUserData(state.data.user);
      setDetailsData(state.data.project);
      console.log(state.data);
    }
  }, [state.data]);

  const togglePop = () => {
    setOpenpop(!openPop);
  };

  const logout = () => {
    Cookies.set('accessToken', '', { expires: 0 });
    Cookies.set('refreshToken', '', { expires: 0 });
    localStorage.removeItem('Auth');
    navigate('/');
  };

  return (
    <>
      <h1>Profile</h1>
      {userData[0] !== undefined ? (
        <>
          {openPop ? (
            <Popup
              title="Logout"
              content="Are you sure you want to logout?"
              yesClicked={logout}
              noClicked={togglePop}
              button1="Yes"
              button2="No"
            />
          ) : null}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  padding: '10px 35px',
                  borderRadius: '20px',
                }}>
                <button
                  onClick={togglePop}
                  style={{
                    borderRadius: '8px',
                    margin: '5px 0',
                    maxWidth: '50px',
                    backgroundColor: 'var(--IndicatorRed)',
                  }}>
                  <span>
                    <MdLogout />
                  </span>
                </button>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '50px',
                  }}>
                  <CardMedia
                    sx={{
                      borderRadius: '100%',
                      maxHeight: '300px',
                      maxWidth: '300px',
                    }}
                    component="img"
                    image="https://via.placeholder.com/150"
                  />
                </div>
                <Grid
                  sx={{
                    padding: '10px 0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  container
                  spacing={0}>
                  <Grid item xs={6}>
                    <h2>{userData[0].name}</h2>
                  </Grid>
                  <Grid item xs={6}>
                    <p>{userData[0].matricnumber}</p>
                  </Grid>
                </Grid>
                <Divider />
                <Grid
                  sx={{
                    padding: '10px 0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  container
                  spacing={0}>
                  <Grid item xs={6}>
                    <p>
                      {userData[0].isstudent ? 'Student' : 'Academic Staff'}
                    </p>
                  </Grid>
                  <Grid item xs={6}>
                    <p>{userData[0].institution}</p>
                  </Grid>
                </Grid>
                <Divider />
                <Grid
                  sx={{
                    padding: '10px 0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  container
                  spacing={0}>
                  <Grid item xs={6}>
                    <p>{dayjs(userData[0].dob).format('DD MMMM, YYYY')}</p>
                  </Grid>
                  <Grid item xs={6}>
                    <a href={`mailto:${userData[0].email}`}>
                      {userData[0].email}
                    </a>
                  </Grid>
                </Grid>
                <Divider />
                <Grid
                  sx={{
                    padding: '10px 5px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'orange',
                  }}
                  container
                  spacing={0}>
                  <Grid item xs={6}>
                    <p>Close to due tasks</p>
                  </Grid>
                  <Grid item xs={6}>
                    <p>{userData[0].yellowtasks + userData[0].redtasks}</p>
                  </Grid>
                  <Grid item xs={6}></Grid>
                </Grid>
                <Divider />
                <Grid
                  sx={{
                    padding: '10px 5px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'red',
                  }}
                  container
                  spacing={0}>
                  <Grid item xs={6}>
                    <p>Past due tasks</p>
                  </Grid>
                  <Grid item xs={6}>
                    <p>{userData[0].pastduetasks}</p>
                  </Grid>
                  <Grid item xs={6}></Grid>
                </Grid>
                <Divider />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {auth.user.id.toString() === id ? (
                    <button
                      style={{
                        borderRadius: '8px',
                        margin: '25px 0',
                        maxWidth: '35%',
                        backgroundColor: 'var(--IndicatorBlue',
                      }}>
                      <span>
                        <MdEdit />{' '}
                      </span>
                      Edit profile
                    </button>
                  ) : null}
                </div>
              </Card>
            </Grid>

            {Object.keys(detailsData).length > 0 &&
            userData[0].isstudent &&
            detailsData[0].requeststatus ? (
              <Grid item xs={12} md={6}>
                {/*? Current Project Card */}
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: '20px' }}>
                      <CardActionArea
                        href={`../project/${detailsData[0].projectid}`}
                        sx={{ padding: '10px 15px' }}>
                        <p>Current Project</p>
                        <h2>{detailsData[0].projecttitle}</h2>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <CardMedia
                              sx={{
                                borderRadius: '20px',
                                height: '12rem',
                                objectFit: 'cover',
                              }}
                              component="img"
                              image="https://via.placeholder.com/150"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <p
                              style={{
                                fontSize: '12pt',
                                height: '12rem',
                                overflow: 'clip',
                              }}>
                              {detailsData[0].projectdescription}
                            </p>
                          </Grid>
                        </Grid>
                      </CardActionArea>
                    </Card>
                  </Grid>

                  {/*? Lead thingy Card */}
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: '20px' }}>
                      <CardActionArea
                        onClick={() => {
                          navigate(`../profile/${detailsData[0].userid}`);
                        }}
                        sx={{ padding: '10px 15px' }}>
                        <div
                          style={{
                            padding: '15px 0',
                            height: '200px',
                          }}>
                          <img
                            src="https://via.placeholder.com/150"
                            style={{
                              position: 'absolute',
                              zIndex: '5',
                              borderRadius: '100%',
                              height: '200px',
                              width: '200px',
                              objectFit: 'cover',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: 50,
                              right: '0',
                              zIndex: '0',
                              backgroundColor: 'var(--SparesIndigo)',
                              width: '80%',
                              height: '150px',
                            }}
                          />
                        </div>
                        <h2>{detailsData[0].name}</h2>
                        <p>{detailsData[0].email}</p>
                        <p>{detailsData[0].institution}</p>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            ) : userData[0].isstaff ? null : (
              <p>This student has not undertaken a project</p>
            )}
          </Grid>
          <div style={{ height: '25px' }} />
        </>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default ProfilePage;
