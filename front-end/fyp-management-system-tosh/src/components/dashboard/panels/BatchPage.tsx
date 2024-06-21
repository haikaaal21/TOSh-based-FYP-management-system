import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useGet from '../../../hooks/api/useGet';
import {
  Alert,
  AlertColor,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Select,
  Slide,
  Snackbar,
  TextField,
} from '@mui/material';
import {
  MdCalendarMonth,
  MdClose,
  MdDelete,
  MdEdit,
  MdNotificationImportant,
  MdNotificationsNone,
  MdUploadFile,
} from 'react-icons/md';
import { IoPeopleCircle } from 'react-icons/io5';
import '../../../styles/panels.css';
import { DatePicker } from '@mui/x-date-pickers';
import BriefProject from '../../BriefProject';
import Repostitory from '../../repository';
import AuthUser from '../../../context/AuthUserContext';
import ItemCard from '../ItemCard';
import DocumentationPopUp from '../DocumentationPopUp';
import '../../../styles/panels.css';
import { motion } from 'framer-motion';
import Chart from 'react-google-charts';
import dayjs from 'dayjs';
import usePost from '../../../hooks/api/usePost';

const BatchPage = () => {
  const { auth } = useContext(AuthUser);
  const { batchid } = useParams();
  const { handleGet, state } = useGet();
  const [batch, setBatch] = useState() as any;
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [documentation, setDocumentation] = useState([]);
  const [unapprovedProjects, setUnapprovedProjects] = useState(0);
  const [items, setItems] = useState([]);

  const appendUnapprovedProjects = (projects: any) => {
    let count = 0;
    projects.forEach((project: any) => {
      if (!project.approvalstatus) {
        count++;
      }
    });
    setUnapprovedProjects(count + parseInt(state.data.canned));
  };

  useEffect(() => {
    handleGet(
      `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}batch/fetchDetails/${batchid}`
    );
  }, []);

  useEffect(() => {
    if (state.data) {
      setBatch(state.data.batch);
      setStudents(state.data.students);
      setSupervisors(state.data.supervisors);
      setProjects(state.data.projects);
      setItems(state.data.items);
      setDocumentation(state.data.documentation);
      setEditedBatch({
        batchname: state.data.batch.batchname,
        batchyear: state.data.batch.batchyear,
        batchstatus: state.data.batch.batchstatus,
      });
    }
  }, [state.data]);

  useEffect(() => {
    if (projects && state.data) {
      appendUnapprovedProjects(projects);
    }
  }, [projects]);

  const [edit, setEdit] = useState(false);

  const editLogicGate = () => {
    setEdit(!edit);
  };

  const goto = useNavigate();
  const [pop, setPop] = useState(false);

  const popLogic = () => {
    setPop(!pop);
  };

  const [snackInstance, setSnackInstance] = useState({
    open: false,
    message: 'Cool beans!',
    severity: 'success',
  });

  const opensnack = (message: string, severity: AlertColor) => {
    setSnackInstance({
      open: true,
      message: message,
      severity: severity,
    });
  };

  const closeSnack = () => {
    setSnackInstance({
      open: false,
      message: '',
      severity: 'success',
    });
  };

  useEffect(() => {
    if (snackInstance.open) {
      handleGet(
        `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}batch/fetchDetails/${batchid}`
      );
    }
  }, [snackInstance.open]);

  const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;
  const [popImage, setPopImage] = useState({
    open: false,
    image: '',
    title: '',
  });

  const displayImage = (e: any, imageUrl: string, title: string) => {
    e.preventDefault();
    setPopImage({
      open: true,
      image: url + imageUrl,
      title: title,
    });
  };
  
  const {handlePost: deleteBatch} = usePost();

  const sendToApiDeleteBatch = () => {
    deleteBatch(`${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}batch/delete`, {batchid: batchid});
    goto('../batch');
  }

  const [editedBatch, setEditedBatch] = useState({
    batchname: '',
    batchyear: '',
    batchstatus: '',
  });
  const [batchnameerror, setBatchNameError] = useState('');

  const validateBatch = () => {
    if (editedBatch.batchname.length === 0) {
      setBatchNameError('Batch name cannot be empty');
      return false;
    } else {
      setBatchNameError('');
      return true;
    }
  };

  const editBatch = () => {
    if (batchnameerror.length === 0) {
      postEdited(
        `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}batch/edit/${batchid}`,
        editedBatch
      );
      window.location.reload();
    }
  };

  const { handlePost: postEdited } = usePost();

  useEffect(() => {
    validateBatch();
  }, [editedBatch]);

  return (
    <>
      {pop ? (
        <DocumentationPopUp
          openSnackbar={opensnack}
          onXClick={() => popLogic()}
        />
      ) : null}
      <Dialog fullWidth maxWidth="lg" open={popImage.open}>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <h3>{popImage.title}</h3>
          <button
            style={{ backgroundColor: 'var(--IndicatorRed)' }}
            onClick={() => setPopImage({ open: false, image: '', title: '' })}>
            <MdClose size={24} />
          </button>
        </DialogTitle>
        <img
          style={{
            padding: '10px',
            borderRadius: '10px',
          }}
          src={popImage.image}
          alt="DisplayImage"
        />
      </Dialog>
      <Snackbar
        open={snackInstance.open}
        autoHideDuration={6000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={(props) => <Slide {...props} />}>
        <Alert
          sx={{ width: '100vh' }}
          severity={snackInstance.severity as AlertColor}>
          {snackInstance.message}
        </Alert>
      </Snackbar>
      {state.data && batch ? (
        <>
          {edit ? (
            <div
              style={{
                margin: '35px 0',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}>
              <TextField
                style={{ marginBottom: '15px', width: '250px' }}
                label="Batch Name"
                value={editedBatch.batchname}
                error={batchnameerror.length > 0}
                helperText={batchnameerror}
                onChange={(e) =>
                  setEditedBatch({ ...editedBatch, batchname: e.target.value })
                }
              />
              <DatePicker
                label="Batch Year"
                value={dayjs(editedBatch.batchyear)}
                views={['year']}
                sx={{ marginBottom: '15px', width: '250px' }}
                onChange={(date) =>
                  setEditedBatch({
                    ...editedBatch,
                    batchyear: dayjs(date).format('YYYY'),
                  })
                }
              />
              <Select
                value={editedBatch.batchstatus}
                onChange={(e) =>
                  setEditedBatch({
                    ...editedBatch,
                    batchstatus: e.target.value,
                  })
                }
                style={{ marginBottom: '15px', width: '250px' }}>
                <MenuItem value={'Preparation'}>Preparation</MenuItem>
                <MenuItem value={'Undergoing'}>Undergoing</MenuItem>
                <MenuItem value={'Finished'}>Finished</MenuItem>
              </Select>
              <button
                onClick={sendToApiDeleteBatch}
                style={{
                  backgroundColor: 'var(--IndicatorRed)',
                  width: '250px',
                  marginBottom: '15px',
                }}>
                <MdDelete /> Delete Batch
              </button>
              <button onClick={editBatch} style={{ width: '250px' }}>
                Change Batch
              </button>
            </div>
          ) : (
            <h1>{batch.batchname}</h1>
          )}
          <Grid container>
            <Grid item xs={12} md={6}>
              <div className="with-leading has-maxwidth">
                <MdCalendarMonth size={24} /> &nbsp; Period of Batch :{' '}
                <b>{batch.batchyear}</b>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div
                style={{
                  backgroundColor:
                    batch.batchstatus === 'Preparation'
                      ? 'var(--Preparation)'
                      : batch.batchstatus === 'Undergoing'
                        ? 'var(--IndicatorBlue)'
                        : 'var(--NeutralGrey)',
                  color: 'white',
                  borderRadius: '25px',
                  padding: '4px 8px',
                }}
                className="with-leading has-maxwidth">
                <IoPeopleCircle size={24} /> &nbsp; Current Status :
                <b>{batch.batchstatus}</b>
              </div>
            </Grid>
          </Grid>
          <button
            style={{ maxWidth: '200px', margin: '10px 0' }}
            onClick={() => editLogicGate()}
            className="buttonWithLeading">
            <MdEdit />
            &nbsp;Edit batch
          </button>
          {!edit ? (
            <>
              <Divider style={{ padding: '15px' }} />
              <h2>Important Events</h2>
              {items.length > 0 ? (
                <Chart
                  width={'100%'}
                  height={'100%'}
                  chartType="Timeline"
                  loader={<div>Loading Chart</div>}
                  data={[
                    [
                      { type: 'string', id: 'Position' },
                      { type: 'string', id: 'Name' },
                      { type: 'date', id: 'Start' },
                      { type: 'date', id: 'End' },
                    ],
                    ...items.map((item: any) => {
                      return [
                        item.type,
                        item.title,
                        item.type === 'task'
                          ? new Date()
                          : new Date(
                              new Date(item.date).setHours(
                                new Date(item.date).getHours() - 24
                              )
                            ),
                        new Date(item.date),
                      ];
                    }),
                  ]}
                  options={{
                    showRowNumber: true,
                    colors: ['#333333'],
                  }}
                  rootProps={{ 'data-testid': '1' }}
                />
              ) : (
                <p>No important events for this batch</p>
              )}
              <h2>Schedules you have created</h2>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  overflowX: 'scroll',
                  minHeight: '150px',
                  maxHeight: '400px',
                }}>
                {items.map((thisitem: any) => {
                  if (thisitem.lecturerid === auth.user.specialid) {
                    return (
                      <motion.div
                        style={{ margin: '10px' }}
                        initial={{ opacity: 0, translateY: 50 }}
                        animate={{ opacity: 1, translateY: 0 }}>
                        <ItemCard
                          typeOfItem={thisitem.type}
                          itemid={thisitem.id}
                          title={thisitem.title}
                          dateFrom="You"
                          dueDate={thisitem.enddate}
                          coordinatorDesignated={thisitem.coordinator}
                        />
                      </motion.div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
              <Grid
                gap={2}
                sx={{ width: '100%', justifyContent: 'space-between' }}
                container>
                <Grid item xs={12} md={8}>
                  <h2>Projects</h2>
                </Grid>
                <Grid item xs={12} md={2}>
                  <button
                    className="buttonWithLeading"
                    onClick={() => goto(`../projects/approval/${batchid}`)}>
                    {' '}
                    {unapprovedProjects > 0 ? (
                      <MdNotificationImportant />
                    ) : (
                      <MdNotificationsNone />
                    )}{' '}
                    &nbsp;Unapproved Projects
                  </button>
                  <p className="subtitle">
                    There are {unapprovedProjects} unapproved projects
                  </p>
                </Grid>
              </Grid>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  overflowX: 'scroll',
                  minHeight: '150px',
                }}>
                {projects.map((project: any) =>
                  project.approvalstatus ? (
                    <BriefProject
                      key={project.projectid}
                      title={project.projecttitle}
                      name={project.supervisorname}
                      typeOfProject={project.projecttype}
                      imageUrl={project.projectimage}
                      id={project.projectid}
                    />
                  ) : null
                )}
              </div>
              <Divider
                sx={{
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              />
            </>
          ) : (
            <Divider
              sx={{
                height: '50px',
                display: 'flex',
                alignItems: 'center',
              }}
            />
          )}
          <h2>People involved</h2>
          <Grid container gap={0.5} sx={{ justifyContent: 'space-evenly' }}>
            <Grid item xs={12} md={5.75}>
              <h3>Students</h3>
              <p className="subtitle">
                There are {students.length} students involved in this batch.
              </p>
              <Repostitory
                add={false}
                buttonClick={() => {}}
                items={students.map((student: any) => {
                  return {
                    id: student.studentid,
                    name: student.name,
                    image: student.profilepic,
                  };
                })}
                staff={false}
                hidden={true}
              />
            </Grid>
            <Grid item xs={12} md={5.75}>
              <h3>Supervisors</h3>
              <p className="subtitle">
                There are {supervisors.length} supervisors involved in this
                project.
              </p>
              <Repostitory
                add={false}
                buttonClick={() => {}}
                items={supervisors.map((supervisor: any) => {
                  return {
                    id: supervisor.staffid,
                    name: supervisor.name,
                    image: supervisor.profilepic,
                  };
                })}
                staff={true}
                hidden={true}
              />
            </Grid>
          </Grid>
          <h2 style={{ paddingTop: '20px' }}>Documentation</h2>
          <button onClick={() => popLogic()} className="buttonWithLeading">
            <MdUploadFile />
            &nbsp;Upload a documentation
          </button>
          <Grid
            style={{
              paddingTop: '25px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            gap={1}
            container>
            {documentation.length > 0 ? (
              documentation.map((image: any) => (
                <>
                  <Grid item xs={12} md={3.6}>
                    <div
                      onClick={(e) =>
                        displayImage(
                          e,
                          image.batchdocumentation,
                          image.documentationtitle
                        )
                      }
                      className="clickable">
                      <Card>
                        <CardMedia
                          component="img"
                          image={url + image.batchdocumentation}
                          alt={image.id}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            aspectRatio: '4/3',
                            objectFit: 'cover',
                          }}
                        />
                      </Card>
                      <h3>{image.documentationtitle}</h3>
                    </div>
                  </Grid>
                </>
              ))
            ) : (
              <Grid
                style={{
                  height: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
                item
                xs={12}>
                <p>There are no documentation for this batch.</p>
                <button
                  onClick={() => popLogic()}
                  style={{ maxWidth: '250px' }}
                  className="buttonWithLeading">
                  <MdUploadFile />
                  &nbsp;Upload one now
                </button>
              </Grid>
            )}
          </Grid>
        </>
      ) : null}
    </>
  );
};

export default BatchPage;
