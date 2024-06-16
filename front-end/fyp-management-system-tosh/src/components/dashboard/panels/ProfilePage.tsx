import {
  Autocomplete,
  Card,
  CardActionArea,
  CardMedia,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  TextField,
} from '@mui/material';
import AuthUser from '../../../context/AuthUserContext';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs';
import useGet from '../../../hooks/api/useGet';
import { MdEdit, MdLogout, MdSave, MdUpload, MdWarning } from 'react-icons/md';
import Cookies from 'js-cookie';
import Popup from '../Popup';
import { DateField } from '@mui/x-date-pickers';
import DefaultImage from '../../../assets/images/default/PFP.png';
import ErrorPanel from './ErrorPanel';
import Loading from '../../Loading';
import DefaultProjectImage from '../../../assets/images/default/Project.png';
import usePost from '../../../hooks/api/usePost';

const ProfilePage = () => {
  const { auth, logoutUser } = useContext(AuthUser);
  const { handleGet, state } = useGet();
  const { handleGet: institutionGet, state: institutionState } = useGet();
  const { id } = useParams();
  const [userData, setUserData] = useState<any>({});
  const [detailsData, setDetailsData] = useState<any>(null);
  const [openPop, setOpenpop] = useState(false);
  const navigate = useNavigate();
  const [editingProfile, setEditingProfile] = useState(false);
  const [institution, setInstitution] = useState([]);

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
      setProfileData({
        image: {} as File,
        firstname: state.data.user[0].name.split(' ')[0],
        lastname: state.data.user[0].name.split(' ')[1],
        email: state.data.user[0].email,
        institution: state.data.user[0].institution,
        password: '',
        dateofbirth: dayjs(state.data.user[0].dob),
      });
      console.log(state.data);
    }
  }, [state.data]);

  const togglePop = () => {
    setOpenpop(!openPop);
  };

  const fetchInstitution = () => {
    institutionGet(
      `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}university/fetch`
    );
  };

  useEffect(() => {
    if (institutionState.data) {
      const uniData = institutionState.data.data.map(
        (uniItem: any) => uniItem.uniname
      );
      setInstitution(uniData);
    }
  }, [institutionState.data]);

  const editProfile = () => {
    setEditingProfile(!editingProfile);
  };

  const logout = () => {
    Cookies.set('accessToken', '', { expires: 0 });
    Cookies.set('refreshToken', '', { expires: 0 });
    localStorage.removeItem('Auth');
    logoutUser();
    navigate('/');
  };

  //? Edit Profile

  const [profileData, setProfileData] = useState({
    image: {} as File,
    firstname: '',
    lastname: '',
    email: '',
    institution: '',
    password: '',
    dateofbirth: dayjs(),
  });

  const handleChange = (e: any) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const [crucial, setCrucial] = useState(false);

  const uploadImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = (e: any) => {
      setProfileData({
        ...profileData,
        image: e.target.files[0],
      });
    };
  };
  
  const [errors, setErrors] = useState({} as { [key: string]: string });

  const validate = () => {
    let prevErrors = {} as { [key: string]: string };
    if (crucial) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (profileData.email === '') {
        prevErrors = { ...prevErrors, email: 'Email cannot be empty' };
      } else if (!profileData.email.includes('@')) {
        prevErrors = { ...prevErrors, email: 'Invalid email' };
      }
      if (profileData.password === '') {
        prevErrors = { ...prevErrors, password: 'Password cannot be empty' };
      } else if (profileData.password.length < 6) {
        prevErrors = {
          ...prevErrors,
          password: 'Password must be at least 6 characters',
        };
      } else if(passwordRegex.test(profileData.password) === false) {
        prevErrors = {
          ...prevErrors,
          password: 'Password must contain at least one number, one uppercase and one lowercase letter',
        };
      }
    } 
    if(profileData.firstname === '' || profileData.firstname.length < 3) {
      prevErrors = { ...prevErrors, firstname: 'First Name must at least be 3 characters' };
    }
    if(profileData.lastname === '' || profileData.lastname.length < 3) {
      prevErrors = { ...prevErrors, lastname: 'Last Name must at least be 3 characters' };
    }
    if(profileData.institution === '' || profileData.institution === null) {
      prevErrors = { ...prevErrors, institution: 'Institution cannot be empty' };
    }
    if(!dayjs(profileData.dateofbirth).isValid()) {
      prevErrors = { ...prevErrors, dateofbirth: 'Invalid Date' };
    } else if(dayjs(profileData.dateofbirth).isAfter(dayjs())) {
      prevErrors = { ...prevErrors, dateofbirth: 'Date of Birth cannot be after today' };
    }
    return prevErrors;
  }

  useEffect(() => {
    setErrors(validate());
  }, [profileData, crucial])

  const {state:postState, handlePost} = usePost();

  const submitProfileChanges = () => {
    const data = new FormData();
    data.append('name', profileData.firstname + ' ' + profileData.lastname);
    if(crucial) {
      data.append('email', profileData.email);
      data.append('password', profileData.password);
    }
    data.append('institution', profileData.institution);
    data.append('dob', profileData.dateofbirth.toString());
    data.append('image', profileData.image);
    if(crucial) {
      handlePost(import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + 'user/editprofile/'+userData[0].userid+'?crucial=true', data);
    } else {
      handlePost(import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + 'user/editprofile/'+userData[0].userid, data);
    }
  };

  useEffect(() => {
    if(postState.data){
      logout();
    }
  }, [postState])

  return (
    <>
      {state.error ? (
        <>
          <ErrorPanel isItProfile={true} logout={logout} />
        </>
      ) : (
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
                    {auth.user.id.toString() === id ? (
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
                    ) : null}

                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '50px',
                      }}>
                      <CardMedia
                        sx={{
                          borderRadius: '100%',
                          height: '300px',
                          width: '300px',
                        }}
                        component="img"
                        image={
                        profileData.image.name ? URL.createObjectURL(profileData.image) : state.data && state.data.user[0].profilepic ?  import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
                        state.data.user[0].profilepic : DefaultImage
                        }
                      />
                      {editingProfile ? (
                        <button
                          onClick={uploadImage}
                          style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            backgroundColor: 'var(--IndicatorBlue)',
                            borderRadius: '150px',
                            padding: '5px 10px',
                            color: 'white',
                            width: '60px',
                            aspectRatio: '1/1',
                          }}>
                          <MdUpload />
                        </button>
                      ) : null}
                    </div>
                    {!editingProfile ? (
                      <>
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
                              {userData[0].isstudent
                                ? 'Student'
                                : 'Academic Staff'}
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
                            <p>
                              {dayjs(userData[0].dob).format('DD MMMM, YYYY')}
                            </p>
                          </Grid>
                          <Grid item xs={6}>
                            <a href={`mailto:${userData[0].email}`}>
                              {userData[0].email}
                            </a>
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <form>
                        <FormControl
                          sx={{
                            padding: '5px 0',
                          }}
                          fullWidth>
                          <FormLabel>First Name</FormLabel>
                          <TextField
                            name="firstname"
                            value={profileData.firstname}
                            onChange={(event) => handleChange(event)}
                            error={errors.firstname !== ''}
                            helperText={errors.firstname}
                          />
                        </FormControl>
                        <FormControl
                          sx={{
                            padding: '5px 0',
                          }}
                          fullWidth>
                          <FormLabel>Last Name</FormLabel>
                          <TextField
                            name="lastname"
                            error={errors.lastname !== ''}
                            helperText={errors.lastname}
                            value={profileData.lastname}
                            onChange={(event) => handleChange(event)}
                          />
                        </FormControl>
                        <FormControl
                          sx={{
                            padding: '5px 0',
                          }}
                          fullWidth>
                          <FormLabel>Email</FormLabel>
                          <TextField
                            name="email"
                            error={errors.email !== ''}
                            helperText={errors.email}
                            value={profileData.email}
                            onChange={(event) => {
                              handleChange(event)
                              setCrucial(true);
                            }}
                          />
                        </FormControl>
                        <FormControl
                          sx={{
                            padding: '5px 0',
                          }}
                          fullWidth>
                          <FormLabel>Institution</FormLabel>
                          <Autocomplete
                            onFocus={fetchInstitution}
                            value={profileData.institution ?? ''}
                            onChange={(event, value) =>
                              setProfileData({
                                ...profileData,
                                institution: value ?? '',
                              })
                            }
                            options={institution ? institution : []}
                            renderInput={(params) => <TextField {...params} />}
                            fullWidth
                          />
                          <FormHelperText error>
                            {errors.institution}
                          </FormHelperText>
                        </FormControl>
                        <FormControl
                          sx={{
                            padding: '5px 0',
                          }}
                          fullWidth>
                          <FormLabel>Password</FormLabel>
                          <TextField
                            type="password"
                            name="password"
                            error={errors.password !== ''}
                            helperText={errors.password}
                            onChange={(event) => {
                              handleChange(event)
                              setCrucial(true);
                            }}
                            value={profileData.password}
                          />
                        </FormControl>
                        <FormControl
                          sx={{
                            padding: '5px 0',
                          }}
                          fullWidth>
                          <FormLabel>Date of Birth</FormLabel>
                          <DateField
                            required
                            onChange={(value) =>
                              setProfileData({
                                ...profileData,
                                dateofbirth: dayjs(value),
                              })
                            }
                            value={profileData.dateofbirth}
                          />
                          <FormHelperText error>
                            {errors.dateofbirth}
                          </FormHelperText>
                        </FormControl>
                      </form>
                    )}
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
                    {
                      crucial ?
                        <p style={{
                          display:'flex',
                          alignItems:'center',
                          justifyContent:'center',
                          textAlign:'center',
                          fontWeight:'bold',
                          color:'white',
                          padding:'10px',
                          backgroundColor:'var(--SparesRed)'
                        }}><MdWarning />&nbsp;A verification email will be sent after you've saved these changes</p> : null
                    }
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {auth.user.id.toString() === id ? (
                        <button
                          onClick={
                            editingProfile ? submitProfileChanges : editProfile
                          }
                          style={{
                            borderRadius: '8px',
                            margin: '25px 0',
                            maxWidth: '35%',
                            backgroundColor: 'var(--IndicatorBlue',
                          }}>
                          <span>
                            {editingProfile ? <MdSave /> : <MdEdit />}
                          </span>{' '}
                          &nbsp;
                          {editingProfile ? 'Save Changes' : 'Edit Profile'}
                        </button>
                      ) : null}
                      {editingProfile ? (
                        <button
                          onClick={editProfile}
                          style={{
                            borderRadius: '8px',
                            margin: '25px 10px',
                            maxWidth: '35%',
                            backgroundColor: 'var(--NeutralGrey)',
                          }}>
                          Discard Changes
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
                            <p>{detailsData[0].projecttype}</p>
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
                                  image={
                                    detailsData[0].projectimage
                                      ? import.meta.env
                                          .VITE_APPLICATION_TEST_SERVER_URL +
                                        detailsData[0].projectimage
                                      : DefaultProjectImage
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <p
                                  style={{
                                    fontSize: '12pt',
                                    height: '12rem',
                                    overflow: 'clip',
                                    fontWeight: '500',
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
                                src={
                                  detailsData[0].profilepic
                                    ? import.meta.env
                                        .VITE_APPLICATION_TEST_SERVER_URL +
                                      detailsData[0].profilepic
                                    : DefaultImage
                                }
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
            <Loading />
          )}
        </>
      )}
    </>
  );
};

export default ProfilePage;
