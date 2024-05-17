import { Card, CardContent, Divider, Grid } from '@mui/material';
import '../../../styles/panels.css';
import { useParams } from 'react-router';
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

const TaskPage = () => {
  const [task, setTask] = useState<any>(null);
  const [taskFiles, setTaskFiles] = useState<any>(null);
  const { taskid } = useParams();
  const { state, handleGet } = useGet();
  const [color, setColor] = useState<String>('');
  const [word, setWord] = useState<String>('');
  const [uploadedfiles, setUploadedFiles] = useState<any>(null);
  const { state: postState, handlePost } = usePost();
  const { auth } = useContext(AuthUser);
  const { OK, greenFlag, redFlag } = useOK();

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
    return { yearDiff, monthDiff, dayDiff };
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
    setWord(word);
  };

  useEffect(() => {
    redFlag();
    handleGet(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + 'task/' + taskid
    );
  }, []);

  useEffect(() => {
    if (state.data !== null) {
      setTask(state.data.task);
      setTaskFiles(state.data.files);
    }
  }, [state.data]);

  useEffect(() => {
    if (task !== null) {
      task.iscoordinator ? setColor('IndicatorRed') : setColor('SparesIndigo');
      wordBuilder(makeTimeDiff(task.duedate));
    }
  }, [task]);

  useEffect(() => {}, [uploadedfiles]);

  const deleteItem = (event: React.MouseEvent, id: string) => {
    event?.preventDefault();
    deleteFile({ key: id });
  };

  useEffect(() => {
    if (postState.data !== null) {
      console.log(postState.data);
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

  return (
    <>
      {OK ? (
        postState.data.message === 'Task Submitted Successfully!' ? (
          <Popup
            title="Cool!"
            content="You have successfully submitted your task!"
            button1="Hooray!"
            yesClicked={() => {
              redFlag();
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
            <Grid item xs={12} md={6}>
              <p style={{ display: 'flex', alignItems: 'center' }}>
                <IoMdWarning /> You have&nbsp;<b>{word}</b>&nbsp;to go before
                the due date
              </p>
            </Grid>
          </Grid>
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
          {!task.submissionstatus ? (
            <>
              <h2>Submission</h2>
              <form onSubmit={(event) => submitTask(event)}>
                <Card>
                  <CardContent>
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
                    <button type="submit" style={{ marginTop: '10px' }}>
                      Submit Task
                    </button>
                  </CardContent>
                </Card>
              </form>
            </>
          ) : (
            <div>
              <h2>Congratluations on finishing your task!</h2>
            </div>
          )}
        </>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
};

export default TaskPage;
