import {
  Alert,
  Card,
  CardContent,
  Divider,
  Grid,
  Snackbar,
  IconButton,
  AlertColor,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  TextField,
  ToggleButton,
  DialogTitle,
  DialogContent,
  FormControl,
  FormHelperText,
} from '@mui/material';
import '../../../styles/panels.css';
import { useNavigate, useParams } from 'react-router';
import useGet from '../../../hooks/api/useGet';
import { useCallback, useContext, useEffect, useState } from 'react';
// import FileCard from '../FileCard';
import dayjs from 'dayjs';
import { IoMdClock, IoMdWarning } from 'react-icons/io';
import usePost from '../../../hooks/api/usePost';
import UploadedFileCard from '../UploadedFileCard';
import FileCard from '../FileCard';
import { useDropzone } from 'react-dropzone';
import AuthUser from '../../../context/AuthUserContext';
import Popup from '../Popup';
import useOK from '../../../hooks/auth/useOK';
import Dropper from '../Dropper';
import {
  MdCheck,
  MdClose,
  MdDelete,
  MdEdit,
  MdMail,
  MdWarning,
  MdWarningAmber,
} from 'react-icons/md';
import { BiSolidSmile } from 'react-icons/bi';
import { motion } from 'framer-motion';
import DefaultImage from '../../../assets/images/default/PFP.png';
import { FaSadCry } from 'react-icons/fa';
import { IoReload } from 'react-icons/io5';
import { Circles } from 'react-loader-spinner';
import { DateField } from '@mui/x-date-pickers';
import { BsLockFill, BsUnlock } from 'react-icons/bs';

const TaskPage = () => {
  const [task, setTask] = useState<any>(null);
  const [taskFiles, setTaskFiles] = useState<any>(null);
  const { taskid } = useParams();
  const { state, handleGet } = useGet();
  const [color, setColor] = useState<string>('');
  const [word, setWord] = useState<string>('');
  const [uploadedfiles, setUploadedFiles] = useState<any>(null);
  const { state: postState, handlePost } = usePost();
  const { auth } = useContext(AuthUser);
  const { OK, greenFlag, redFlag } = useOK();

  const [ownTask, setOwnTask] = useState(false);

  const appendFile = (file: any) => {
    setUploadedFiles((prevFiles: File[]) =>
      prevFiles === null ? [file] : [...prevFiles, file]
    );
  };

  const deleteFile = (file: any) => {
    const newFiles = uploadedfiles.filter(
      (fileItem: any) => fileItem.key !== file.key
    );
    setUploadedFiles(newFiles);
  };

  const submitTask = async (event: React.FormEvent) => {
    event.preventDefault();
    if (uploadedfiles < 1) {
      alert('Please upload files to submit');
      return;
    }
    const formData = new FormData();
    formData.append('taskid', taskid as string);
    for (let i = 0; i < uploadedfiles.length; i++) {
      formData.append(`file`, uploadedfiles[i].file);
    }
    handlePost(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
        `task/submit/${taskid}/${auth.user.id}`,
      formData
    );
  };

  const onDrop = useCallback((acceptedfiles: File[]) => {
    const maxSize = 1024 * 1024 * 1024;
    acceptedfiles.forEach((file) => {
      const fileKeyID = file.name + '_' + (Math.random() * 500).toFixed(0);
      const fileItem = { file: file, key: fileKeyID };
      if (file.size <= maxSize) {
        appendFile(fileItem);
      } else {
        alert('File size too large');
      }
    });
  }, []);

  const checkOwnTask = () => {
    if (auth.user.specialid === state.data.task.staffid) {
      setOwnTask(true);
    }
  };

  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  const uploadfile = () => {
    event?.preventDefault();
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.click();
    input.addEventListener('change', (e) => {
      const maxSize = 1024 * 1024 * 1024;
      const files = (e.target as HTMLInputElement)?.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const fileKeyID =
            files[i].name + '_' + (Math.random() * 500).toFixed(0);
          const fileItem = { file: files[i], key: fileKeyID };
          files[i].size < maxSize
            ? appendFile(fileItem)
            : alert('File size too large');
        }
      }
    });
  };

  const makeTimeDiff = (date: string) => {
    let eventDate = dayjs(date);
    const currentDate = dayjs();
    const yearDiff = eventDate.diff(currentDate, 'year');
    eventDate = eventDate.subtract(yearDiff, 'year');
    const monthDiff = eventDate.diff(currentDate, 'month');
    eventDate = eventDate.subtract(monthDiff, 'month');
    const dayDiff = eventDate.diff(currentDate, 'day');
    eventDate = eventDate.subtract(dayDiff, 'day');
    const hourDiff = eventDate.diff(currentDate, 'hour');
    eventDate = eventDate.subtract(hourDiff, 'hour');
    const minuteDiff = eventDate.diff(currentDate, 'minute');
    eventDate = eventDate.subtract(minuteDiff, 'minute');
    const secondDiff = eventDate.diff(currentDate, 'second');
    return { yearDiff, monthDiff, dayDiff, hourDiff, minuteDiff, secondDiff };
  };

  const wordBuilder = (timeDiff: any) => {
    makeTimeDiff(task.duedate);
    let word = '';
    if (timeDiff.yearDiff > 0) {
      word += `${timeDiff.yearDiff} year(s) `;
    }
    if (timeDiff.monthDiff > 0) {
      word += `${timeDiff.monthDiff} month(s) `;
    }
    if (timeDiff.dayDiff > 0) {
      word += `${timeDiff.dayDiff} day(s) `;
    }
    if (timeDiff.dayDiff <= 1) {
      if (timeDiff.hourDiff > 0) {
        word += `${timeDiff.hourDiff} hour(s) `;
      }
      if (timeDiff.minuteDiff > 0) {
        word += `${timeDiff.minuteDiff} minute(s) `;
      }
      if (timeDiff.secondDiff > 0) {
        word += `${timeDiff.secondDiff} second(s) `;
      }
    }

    setWord(word);
  };

  useEffect(() => {
    redFlag();
    handleGet(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
        'task/' +
        taskid +
        '?userid=' +
        auth.user.id
    );
  }, []);

  useEffect(() => {
    if (state.data !== null) {
      setTask(state.data.task);
      setTaskFiles(state.data.files);
      checkOwnTask();
      setStuffToEdit({
        tasktitle: state.data.task.tasktitle,
        duedate: dayjs(state.data.task.duedate),
        taskdescription: state.data.task.taskdescription,
        lock: state.data.task.lock,
      });
    }
  }, [state.data]);

  useEffect(() => {
    if (task) zoneChecker();
  }, [task]);

  const [afterSubmission, setAfterSubmission] = useState<string>();

  const zoneChecker = () => {
    let type = 'before any';
    if (task.isyellowshamed) type = 'yellow';
    if (task.isredshamed) type = 'red';
    if (task.isblackshamed) type = 'black';
    setAfterSubmission(type);
  };

  const [submissionFiles, setSubmissionFiles] = useState<any>([]);
  const { state: submissionState, handleGet: getSubmission } = useGet();

  useEffect(() => {
    if (ownTask) {
      getSubmission(
        `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}task/submission/get?taskid=${taskid}`
      );
    }
  }, [ownTask]);

  useEffect(() => {
    if (submissionState.data) {
      setSubmissionFiles(submissionState.data);
    }
  }, [submissionState.data]);

  useEffect(() => {
    if (task !== null) {
      task.iscoordinator ? setColor('IndicatorRed') : setColor('SparesIndigo');
      wordBuilder(makeTimeDiff(task.duedate));
    }
  }, [task]);

  const deleteItem = (event: React.MouseEvent, id: string) => {
    event?.preventDefault();
    deleteFile({ key: id });
  };

  useEffect(() => {
    if (postState.data !== null) {
      if (postState.data.message === 'Task Submitted Successfully!') {
        handleGet(
          import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + 'task/' + taskid
        );
      } else {
        alert('Task submission failed error code' + postState.data.status);
      }
      greenFlag();
    }
  }, [postState.data]);

  const [dialogOpen, setDialogOpen] = useState(false);

  function editTask() {
    setDialogOpen(true);
  }

  const [snackState, setSnackState] = useState({
    open: false,
    message: '',
    severity: 'success' as AlertColor,
  });

  const goto = useNavigate();

  function deleteTask(confirmation: boolean) {
    if (!confirmation) {
      setSnackState({
        open: true,
        message: 'Are you sure you want to delete this task?',
        severity: 'error',
      });
    } else {
      setSnackState({
        open: false,
        message: 'Are you sure you want to delete this task?',
        severity: 'error',
      });
      handleGet(
        `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}task/delete/${taskid}`
      );
      goto('../');
    }
  }

  const { state: rollbackState, handleGet: rollback } = useGet();
  const rollbackSubmission = () => {
    rollback(
      `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}task/rollback/${taskid}/${auth.user.id}`
    );
  };

  useEffect(() => {
    if (rollbackState.data) {
      window.location.reload();
    }
  }, [rollbackState]);

  const [pressuring, setPressuring] = useState({
    loading: false,
    done: false,
    message: 'Send Notification Letters',
  });

  const { state: pressureState, handleGet: pressureGet } = useGet();
  const pressure = () => {
    setPressuring({
      loading: true,
      done: false,
      message: 'Pressuring your users',
    });
    pressureGet(
      `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}task/pressure/${taskid}`
    );
  };

  useEffect(() => {
    if (pressureState.data) {
      setPressuring({
        loading: false,
        done: true,
        message: pressureState.data.message,
      });
    } else if (pressureState.error) {
      setPressuring({
        loading: false,
        done: true,
        message: 'Error occured while pressuring',
      });
    }
  }, [pressureState]);

  useEffect(() => {
    if (pressuring.done) {
      setTimeout(() => {
        setPressuring({
          loading: false,
          done: false,
          message: 'Send Notification Letters',
        });
      }, 2500);
    }
  }, [pressuring.done]);

  const [stuffToEdit, setStuffToEdit] = useState({
    tasktitle: '',
    duedate: dayjs(),
    taskdescription: '',
    lock: false,
  });

  const [stuffToEditErrors, setStuffToEditErrors] = useState({
    tasktitle: '',
    taskdescription: '',
    duedate: '',
  });

  const validate = () => {
    const errors = {
      tasktitle: '',
      taskdescription: '',
      duedate: '',
    };
    if (stuffToEdit.tasktitle === '') {
      errors.tasktitle = 'Task title cannot be empty';
    } else if (stuffToEdit.tasktitle.length < 3) {
      errors.tasktitle = 'Task title must be more than 3 characters';
    }
    if (stuffToEdit.taskdescription === '') {
      errors.taskdescription = 'Task description cannot be empty';
    } else if (stuffToEdit.taskdescription.length < 5) {
      errors.taskdescription =
        'Task description must be more than 5 characters';
    }
    if (dayjs(stuffToEdit.duedate).format() === 'Invalid Date') {
      errors.duedate = 'Due date cannot be empty';
    } else if (dayjs(stuffToEdit.duedate).isSame(dayjs())) {
      errors.duedate = 'Due date cannot be today';
    } else if (dayjs(stuffToEdit.duedate).isBefore(dayjs())) {
      errors.duedate = 'Due date cannot be in the past';
    }
    return errors;
  };

  useEffect(() => {
    setStuffToEditErrors(validate());
  }, [stuffToEdit]);

  const { handlePost: editPost } = usePost();

  const toEdit = () => {
    const errors = validate();
    if (
      errors.tasktitle === '' &&
      errors.taskdescription === '' &&
      errors.duedate === ''
    ) {
      editPost(
        `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}task/edit/${taskid}`,
        stuffToEdit
      );
    }
  };

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth>
        <DialogTitle
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <div>
            <MdEdit /> Edit Task
          </div>{' '}
          <IconButton onClick={() => setDialogOpen(false)}>
            <MdClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form
            style={{
              flexDirection: 'column',
              display: 'flex',
              justifyContent: 'center',
              minHeight: '490px',
            }}
            onSubmit={toEdit}>
            <TextField
              sx={{ marginBottom: '20px' }}
              label="Task Title"
              value={stuffToEdit.tasktitle}
              error={stuffToEditErrors.tasktitle !== ''}
              helperText={stuffToEditErrors.tasktitle}
              onChange={(event) =>
                setStuffToEdit({
                  ...stuffToEdit,
                  tasktitle: event.target.value,
                })
              }
            />
            <TextField
              sx={{ marginBottom: '20px' }}
              label="Task Description"
              value={stuffToEdit.taskdescription}
              error={stuffToEditErrors.taskdescription !== ''}
              helperText={stuffToEditErrors.taskdescription}
              onChange={(event) =>
                setStuffToEdit({
                  ...stuffToEdit,
                  taskdescription: event.target.value,
                })
              }
              multiline
              rows={4}
              maxRows={4}
            />
            <FormControl sx={{ marginBottom: '20px' }}>
              <DateField
                label="Due Date"
                onChange={(value) =>
                  setStuffToEdit({ ...stuffToEdit, duedate: dayjs(value) })
                }
                value={stuffToEdit.duedate}
              />
              <FormHelperText error>{stuffToEditErrors.duedate}</FormHelperText>
            </FormControl>
            <p>Lock Task</p>
            <ToggleButton
              value={stuffToEdit.lock}
              selected={stuffToEdit.lock}
              onChange={() =>
                setStuffToEdit({ ...stuffToEdit, lock: !stuffToEdit.lock })
              }
              sx={{
                height: '50px',
                color: 'white',
                marginBottom: '20px',
                backgroundColor: 'var(--GoodGreen)',
              }}>
              {stuffToEdit.lock ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BsLockFill />
                  &nbsp;<p className="subtitle">Locking Task after Due</p>
                </div>
              ) : (
                <BsUnlock />
              )}
            </ToggleButton>
            <button>Edit Task</button>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackState.open}
        onClose={() =>
          setSnackState({ open: false, message: '', severity: 'success' })
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        key={'top' + 'center'}>
        <Alert
          onClose={() =>
            setSnackState({ open: false, message: '', severity: 'success' })
          }
          severity={snackState.severity}
          sx={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          {snackState.message}
          <IconButton aria-label="" onClick={() => deleteTask(true)}>
            <MdCheck />
          </IconButton>
        </Alert>
      </Snackbar>

      {OK ? (
        postState.data.message === 'Task Submitted Successfully!' ? (
          <Popup
            title="Cool!"
            content="You have successfully submitted your task!"
            button1="Hooray!"
            yesClicked={() => {
              redFlag();
              window.location.reload();
            }}
          />
        ) : (
          <Popup
            title="Oops!"
            content="Something went wrong with your submission!"
            button1="Oh no!"
            yesClicked={() => {
              redFlag();
            }}
          />
        )
      ) : null}
      {task !== null ? (
        <>
          <h1>{task.tasktitle}</h1>
          <div
            style={{
              alignItems: 'center',
              backgroundColor: `var(--${color})`,
            }}
            className="cool-line">
            <p>
              {task.iscoordinator ? 'Coordinator' : 'Supervisor'} Assigned Task
            </p>
          </div>
          <Grid
            container
            sx={{
              backgroundColor: 'var(--DarkBlue)',
              color: 'white',
              padding: '5px 10px',
              textAlign: 'center',
            }}>
            <Grid item xs={12} md={6}>
              <p style={{ display: 'flex', alignItems: 'center' }}>
                <IoMdClock />
                &nbsp;Due at&nbsp;
                <b>{dayjs(task.duedate).format('DD MMMM YYYY')}</b>
              </p>
            </Grid>
            {dayjs().isAfter(dayjs(task.duedate)) ? (
              <p>Task is already due</p>
            ) : (
              <>
                <Grid item xs={12} md={6}>
                  <p
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'left',
                    }}>
                    <IoMdWarning /> {ownTask ? null : 'You have'}&nbsp;{word}to
                    go before the due date
                  </p>
                </Grid>
              </>
            )}
          </Grid>
          {ownTask ? (
            <Grid container>
              <Grid item xs={12} md={6}>
                <button
                  onClick={editTask}
                  style={{ margin: '10px 0px' }}
                  className="buttonWithLeading">
                  <MdEdit />
                  &nbsp;Edit Task
                </button>
              </Grid>
              <Grid item xs={12} md={6}>
                <button
                  onClick={() => deleteTask(false)}
                  style={{
                    margin: '10px 0px',
                    backgroundColor: 'var(--IndicatorRed)',
                  }}
                  className="buttonWithLeading">
                  <MdDelete />
                  &nbsp;Delete Task
                </button>
              </Grid>
            </Grid>
          ) : null}
          <Divider
            sx={{ height: '20px', display: 'flex', alignItems: 'center' }}
          />
          <h2>Details</h2>
          <p>{task.taskdescription}</p>
          <div style={{ width: '100%', overflowX: 'scroll' }}>
            {taskFiles.map((file: any) => {
              return (
                <FileCard
                  fileName={file.taskfilename}
                  fileurl={file.taskfile}
                  typeOfFile={file.filetype}
                />
              );
            })}
          </div>
          <Divider
            sx={{ height: '20px', display: 'flex', alignItems: 'center' }}
          />
          {ownTask ? (
            <>
              <button
                disabled={pressuring.loading || pressuring.done}
                onClick={() => pressure()}
                style={{
                  backgroundColor: pressuring.done
                    ? 'var(--DarkBlue)'
                    : pressuring.loading
                      ? 'var(--NeutralGrey)'
                      : 'var(--SparesIndigo)',
                  margin: '10px 0px',
                }}>
                {pressuring.loading ? (
                  <Circles height="20" width="20" color="white" />
                ) : pressuring.done ? (
                  <MdCheck />
                ) : (
                  <MdMail />
                )}
                &nbsp;{pressuring.message}
              </button>
              <h3>Submission File(s)</h3>
              {submissionFiles &&
                submissionFiles.map((file: any) => {
                  return (
                    <>
                      <Accordion>
                        <AccordionSummary
                          id="panel-header"
                          aria-controls="panel-content">
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              margin: '15px 0',
                            }}>
                            <Avatar
                              src={
                                file.profilepic ? `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}assets${file.profilepic}` : DefaultImage
                              }
                            />
                            <div style={{ marginLeft: '15px' }}>
                              <h3>{file.name}</h3>
                              <p className="subtitle">{file.matricnumber}</p>
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container>
                            {file.files &&
                              file.files.map((item: any) => (
                                <Grid item xs={12} md={3}>
                                  <FileCard
                                    fileName={item.filename}
                                    fileurl={item.tasksubmissionfile}
                                    typeOfFile={item.typeoffile}
                                  />
                                </Grid>
                              ))}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </>
                  );
                })}
            </>
          ) : !task.submissionstatus ? (
            <>
              <h2>Submission</h2>
              <form onSubmit={(event) => submitTask(event)}>
                <Card>
                  <CardContent>
                    {task.lock && new Date(task.duedate) < new Date() ? (
                      <h2>Task is locked</h2>
                    ) : (
                      <>
                        <Dropper
                          isDragActive={isDragActive}
                          getRootProps={getRootProps}
                          uploadfile={uploadfile}
                        />
                        <div
                          style={{
                            display: 'flex',
                            width: '100%',
                            overflowX: 'scroll',
                          }}
                          className="uploaded-files">
                          {uploadedfiles !== null
                            ? uploadedfiles.map((fileItem: any) => {
                                return (
                                  <UploadedFileCard
                                    key={fileItem.key}
                                    filestaticid={fileItem.key}
                                    filename={fileItem.file.name}
                                    filetype={fileItem.file.type}
                                    filesize={fileItem.file.size}
                                    onDelete={deleteItem}
                                  />
                                );
                              })
                            : null}
                        </div>
                        <button
                          type="submit"
                          className="full-width"
                          style={{ marginTop: '10px' }}>
                          Submit Task
                        </button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ translateY: 10, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '450px',
              }}>
              <BiSolidSmile size={128} />
              <h2>Congratluations on finishing your task!</h2>
              <div
                style={{
                  backgroundColor:
                    afterSubmission === 'yellow'
                      ? 'var(--IndicatorYellow)'
                      : afterSubmission === 'red'
                        ? 'var(--IndicatorRed)'
                        : afterSubmission === 'black'
                          ? 'var(--DarkBlue)'
                          : 'var(--GoodGreen)',
                  color: 'white',
                  padding: '5px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                {afterSubmission === 'yellow' ? (
                  <MdWarningAmber />
                ) : afterSubmission === 'red' ? (
                  <MdWarning />
                ) : afterSubmission === 'black' ? (
                  <FaSadCry />
                ) : (
                  <BiSolidSmile />
                )}
                <p>You've finished the task {afterSubmission} zone</p>
              </div>
              {new Date(task.duedate) < new Date() ? null : (
                <button
                  style={{
                    marginTop: '10px',
                    backgroundColor: 'var(--IndicatorRed)',
                  }}
                  className="buttonWithLeading"
                  onClick={() => rollbackSubmission()}>
                  <IoReload />
                  &nbsp;Retract submission
                </button>
              )}
            </motion.div>
          )}
        </>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default TaskPage;
