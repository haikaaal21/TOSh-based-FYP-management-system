import {
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  ToggleButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import TaskContext from '../../context/TaskContext';
import Chart from 'react-google-charts';
import {
  useCheckEmpty,
  useCheckLength,
  useCheckMaxLength,
} from '../../hooks/newHooks/checkerHooks';
import { useDropzone } from 'react-dropzone';
import dayjs from 'dayjs';
import Dropper from './Dropper';
import { MdAdd } from 'react-icons/md';
import UploadedFileCard from './UploadedFileCard';
import { BsLockFill, BsUnlock } from 'react-icons/bs';
import AuthUser from '../../context/AuthUserContext';

interface TaskCreationComponentProps {
  goto: (stage: number) => void;
}
const TaskCreationComponent: React.FC<TaskCreationComponentProps> = (props) => {
  const { onChangetask, task, appendFiles, deleteFile, lockLogic } =
    useContext(TaskContext);

  const onDrop = (acceptedFiles: any) => {
    filterAndAppendFiles(acceptedFiles);
  };

  const uploadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = (e: any) => {
      filterAndAppendFiles(e.target.files);
    };
  };

  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  const onChange = (e: any) => {
    onChangetask(e.target.name, e.target.value);
  };

  const dateOnChange = (date: any, name: string) => {
    if (date === null) {
      const nowDate = new Date();
      onChangetask(name, nowDate);
      return;
    } else {
      const convertedDate = new Date(date);
      onChangetask(name, convertedDate);
    }
  };

  const [errors, setErrors] = useState({} as { [key: string]: string });

  const [checkEmpty, checkLength, checkMaxLength] = [
    useCheckEmpty,
    useCheckLength,
    useCheckMaxLength,
  ];

  const validate = (values: any) => {
    let prevErrors = {} as { [key: string]: string };
    Object.keys(values).map((key) => {
      let errorObject = {} as { [key: string]: string };
      if (key !== 'duedate' && key !== 'yellowzone' && key !== 'redzone') {
        errorObject[key] = checkEmpty(values[key]);
        if (errorObject[key] === '') {
          errorObject[key] = checkLength(values[key], 3);
        }
        if (errorObject[key] === '') {
          errorObject[key] = checkMaxLength(values[key], 255);
        }
        prevErrors = { ...prevErrors, ...errorObject };
      }
    });
    return prevErrors;
  };

  const validateDate = () => {
    if (!task || !task.yellowzone || !task.redzone || !task.duedate) {
      return { date: 'Some dates are still empty' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yellow = new Date(task.yellowzone);
    yellow.setHours(0, 0, 0, 0);
    const red = new Date(task.redzone);
    red.setHours(0, 0, 0, 0);
    const due = new Date(task.duedate);
    due.setHours(0, 0, 0, 0);

    const logic = today < yellow && yellow < red && red < due;
    return !logic ? { date: 'Invalid date order' } : { date: '' };
  };

  useEffect(() => {
    if (task) {
      const validationErrors = validate(task);
      const dateErrors = validateDate();
      setErrors({ ...errors, ...validationErrors, ...dateErrors });
    }
    const savedItems = {
      tasktitle: task.tasktitle,
      taskdescription: task.taskdescription,
      duedate: '',
      yellowzone: '',
      redzone: '',
      lock: task.lock,
      batch: task.batch,
      taskfiles: [],
      taskRecipients: [],
    };
    sessionStorage.setItem('task', JSON.stringify(savedItems));
  }, [task]);

  const filterAndAppendFiles = (files: File[]) => {
    const maxSize = 10 * 1024 * 1024;
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        alert('File size too large');
      } else {
        appendFiles([files[i]]);
      }
    }
  };

  const { auth } = useContext(AuthUser);

  const nextStage = () => {
    if (
      errors.tasktitle !== '' ||
      errors.taskdescription !== '' ||
      errors.date !== ''
    ) {
      return;
    } else {
      onChangetask('assignedfrom', auth.user.specialid);
      props.goto(3);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>
      <TextField
        sx={{ marginBottom: '15px' }}
        variant="outlined"
        fullWidth
        required
        value={task.tasktitle}
        name="tasktitle"
        onChange={(e) => onChange(e)}
        label="Task name"
        error={errors.tasktitle !== ''}
        helperText={errors.tasktitle}
      />
      <TextField
        sx={{ marginBottom: '15px' }}
        variant="outlined"
        fullWidth
        value={task.taskdescription}
        name="taskdescription"
        onChange={(e) => onChange(e)}
        required
        label="Task description"
        maxRows={4}
        rows={4}
        multiline
        error={errors.taskdescription !== ''}
        helperText={errors.taskdescription}
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth sx={{ marginBottom: '15px' }}>
            <DatePicker
              label="Yellow Zone"
              value={dayjs(task.yellowzone)}
              name="yellowzone"
              onChange={(value) => dateOnChange(value, 'yellowzone')}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth sx={{ marginBottom: '15px' }}>
            <DatePicker
              label="Red Zone"
              value={dayjs(task.redzone)}
              name="redzone"
              onChange={(value) => dateOnChange(value, 'redzone')}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth sx={{ marginBottom: '15px' }}>
            <DatePicker
              label="Due date"
              name="duedate"
              value={dayjs(task.duedate)}
              onChange={(value) => dateOnChange(value, 'duedate')}
            />
          </FormControl>
        </Grid>
      </Grid>
      <FormHelperText error>{errors.date}</FormHelperText>
      <h3>Gantt chart</h3>
      <div style={{ minHeight: '200px' }}>
        {errors.date === '' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Chart
              chartType="Timeline"
              loader={<div>Loading Chart</div>}
              legendToggle={false}
              data={[
                [
                  { type: 'string', id: 'Name' },
                  { type: 'date', id: 'Start' },
                  { type: 'date', id: 'End' },
                ],
                ['Yellow Zone', new Date(), task.yellowzone],
                ['Red Zone', new Date(), task.redzone],
                ['Due Date', new Date(), task.duedate],
              ]}
              options={{
                timeline: { showRowLabels: false },
                avoidOverlappingGridLines: false,
                colors: ['FFBF00', 'FF0000', '0C0A00'],
              }}
            />
          </motion.div>
        ) : null}
      </div>
      <Grid
        sx={{
          alignItems: 'center',
          backgroundColor: task.lock
            ? 'var(--NeutralGrey)'
            : 'var(--IndicatorBlue)',
          color: 'white',
          justifyContent: 'space-between',
        }}
        container>
        <Grid
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '300px',
          }}
          item
          xs={12}
          md={6}>
          <ToggleButton
            value={task.lock}
            selected={task.lock}
            onChange={() => lockLogic()}
            sx={{
              width: '50px',
              height: '50px',
              color: 'white',
              backgroundColor: 'var(--GoodGreen)',
            }}>
            {task.lock ? <BsLockFill /> : <BsUnlock />}
          </ToggleButton>
          <p>&nbsp;&nbsp;Lock Task on past due</p>
        </Grid>
        <Grid item xs={12} md={6}>
          <p style={{ color: 'white' }} className="subtitle">
            {task.lock ? '! Locking task after it has been due' : ''}
          </p>
        </Grid>
      </Grid>
      <FormControl fullWidth>
        <h3>Documents</h3>
        <Dropper
          isDragActive={isDragActive}
          getRootProps={getRootProps}
          uploadfile={() => uploadFile()}
        />
        <div
          style={{
            display: 'flex',
            overflowX: 'scroll',
            minHeight: '200px',
            maxHeight: '400px',
          }}>
          {task.taskfiles
            ? task.taskfiles.map((file: any, index: number) => {
                return (
                  <UploadedFileCard
                    filestaticid={file.name.charAt(0) + index}
                    key={index}
                    filename={file.name}
                    filesize={file.size}
                    filetype={file.type}
                    onDelete={() => {
                      deleteFile(file);
                    }}
                  />
                );
              })
            : null}
        </div>
      </FormControl>
      <button
        onClick={() => nextStage()}
        className="buttonWithLeading full-width"
        style={{ margin: '10px 0' }}>
        <MdAdd />
        &nbsp;Create task
      </button>
    </motion.div>
  );
};

export default TaskCreationComponent;
