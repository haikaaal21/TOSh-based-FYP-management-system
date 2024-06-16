import {
  Grid,
  TextField,
  FormControl,
  FormHelperText,
  Card,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useContext, useEffect, useState } from 'react';
import { MdCreate, MdPeople } from 'react-icons/md';
import useGet from '../../../hooks/api/useGet';
import AuthUser from '../../../context/AuthUserContext';
import dayjs from 'dayjs';
import Repository from '../../repository';
import {
  useCheckEmpty,
  useCheckLength,
  useCheckMaxLength,
} from '../../../hooks/newHooks/checkerHooks';
import usePost from '../../../hooks/api/usePost';
import Popup from '../Popup';
import { useNavigate } from 'react-router';

const CreateBatch = () => {
  const { state, handleGet } = useGet();
  const { auth } = useContext(AuthUser);
  const { handlePost, state: postState } = usePost();

  const [fetchData, setFetchData] = useState({
    supervisors: [] as any,
    students: [] as any,
  });

  const goPost = () => {
    handlePost(
      `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}batch/create`,
      {
        batchname: batch.batchName,
        batchyear: dayjs(batch.batchYear).format('YYYY'),
        batchhead: auth.user.specialid,
        staff: batch.supervisorIDs,
        students: batch.studentIDs,
      }
    );
  };

  useEffect(() => {
    const institutionwithUnderScore = auth.user.institution.replace(/\s/g, '_');
    handleGet(
      `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}user/fetchByUni/${institutionwithUnderScore}`
    );
  }, []);

  useEffect(() => {
    if (state.data) {
      const supervisorData = state.data.staff.map((staff: any) => {
        return {
          name: staff.name,
          id: staff.staffid,
          image: staff.image,
        };
      });
      const studentData = state.data.students.map((student: any) => {
        return {
          name: student.name,
          id: student.studentid,
          image: student.image,
        };
      });
      setFetchData({
        supervisors: supervisorData,
        students: studentData,
      });
    }
  }, [state]);

  const [batch, setBatch] = useState({
    batchName: '',
    batchYear: '',
    supervisors: [] as any,
    students: [] as any,
    supervisorIDs: [] as number[],
    studentIDs: [] as number[],
  });

  const appendSupervisor = (id: number) => {
    const supervisor = fetchData.supervisors.find(
      (supervisor: any) => supervisor.id === id
    );
    setBatch({
      ...batch,
      supervisors: [...batch.supervisors, supervisor],
      supervisorIDs: [...batch.supervisorIDs, id],
    });
    setFetchData({
      ...fetchData,
      supervisors: fetchData.supervisors.filter(
        (supervisor: any) => supervisor.id !== id
      ),
    });
  };

  const appendStudent = (id: number) => {
    const student = fetchData.students.find(
      (student: any) => student.id === id
    );
    setBatch({
      ...batch,
      students: [...batch.students, student],
      studentIDs: [...batch.studentIDs, id],
    });
    setFetchData({
      ...fetchData,
      students: fetchData.students.filter((student: any) => student.id !== id),
    });
  };

  const removeSupervisor = (id: number) => {
    const supervisor = batch.supervisors.find(
      (supervisor: any) => supervisor.id === id
    );
    setBatch({
      ...batch,
      supervisors: batch.supervisors.filter(
        (supervisor: any) => supervisor.id !== id
      ),
      supervisorIDs: batch.supervisorIDs.filter(
        (supervisorID: number) => supervisorID !== id
      ),
    });
    setFetchData({
      ...fetchData,
      supervisors: [...fetchData.supervisors, supervisor],
    });
  };

  const removeStudent = (id: number) => {
    const student = batch.students.find((student: any) => student.id === id);
    setBatch({
      ...batch,
      students: batch.students.filter((student: any) => student.id !== id),
      studentIDs: batch.studentIDs.filter(
        (studentID: number) => studentID !== id
      ),
    });
    setFetchData({
      ...fetchData,
      students: [...fetchData.students, student],
    });
  };

  const onChange = (e: any) => {
    setBatch({
      ...batch,
      [e.target.name]: e.target.value,
    });
  };

  const [errors, setErrors] = useState({
    batchName: '',
    batchYear: '',
    studentLength: '',
    supervisorLength: '',
  });

  const [checkEmpty, checkLength, checkMaxLength] = [
    useCheckEmpty,
    useCheckLength,
    useCheckMaxLength,
  ];

  const validate = (values: any) => {
    let prevErrors = { ...errors };
    Object.keys(values).map((key) => {
      let errorObject = {} as { [key: string]: string };
      if (key === 'studentLength') {
        if (values[key] < 10) {
          errorObject[key] = 'At least 10 students are required';
        } else {
          errorObject[key] = '';
        }
      } else if (key === 'supervisorLength') {
        if (values[key] < 3) {
          errorObject[key] = 'At least 3 supervisors are required';
        } else {
          errorObject[key] = '';
        }
      } else if (key === 'batchYear') {
        errorObject[key] =
          dayjs(values[key]).format('YYYY') < dayjs().format('YYYY')
            ? 'Batch year cannot be in the past'
            : '';
        if (errorObject[key] === '') {
          errorObject[key] = dayjs(values[key]).isValid() ? '' : 'Invalid date';
        }
      } else {
        errorObject[key] = checkEmpty(values[key]);
        errorObject[key] === ''
          ? (errorObject[key] = checkLength(values[key], 3))
          : null;
        errorObject[key] === ''
          ? (errorObject[key] = checkMaxLength(values[key], 50))
          : null;
      }
      prevErrors = Object.assign(prevErrors, errorObject);
    });
    setErrors(prevErrors);
  };

  useEffect(() => {
    const filteredValues = {
      batchName: batch.batchName,
      batchYear: batch.batchYear,
      studentLength: batch.students.length,
      supervisorLength: batch.supervisors.length,
    };
    validate(filteredValues);
  }, [batch]);

  const handleSubmission = () => {
    if (Object.values(errors).every((error) => error === '')) {
      goPost();
    }
  };

  const [popup, setPopup] = useState(false);
  const logicPop = () => {
    setPopup(!popup);
  };

  const [popupProps, setPopupProps] = useState({
    title: '',
    content: '',
    button1: '',
    yesClicked: logicPop,
  });

  const goto = useNavigate();

  const closePop = () => {
    setPopup(false);
  };

  useEffect(() => {
    if (postState.data) {
      setPopupProps({
        title: 'Batch Created',
        content: 'Batch has been created successfully',
        button1: 'Okay',
        yesClicked: () => {
          goto('../batch');
        },
      });
      logicPop();
    } else if (postState.error) {
      setPopupProps({
        ...popupProps,
        title: 'Error',
        content:
          'An error occured while creating the batch, please try again later',
        button1: 'Okay',
        yesClicked: closePop,
      });
      logicPop();
    }
  }, [postState]);

  return (
    <>
      {popup ? <Popup {...popupProps} /> : null}
      <h1>Create a batch</h1>
      <Grid gap={0.5} sx={{ justifyContent: 'space-between' }} container>
        <Grid item xs={12} md={7.5}>
          <h3>Batch Name</h3>
          <TextField
            fullWidth
            name="batchName"
            onChange={onChange}
            value={batch.batchName}
            error={errors.batchName !== ''}
            helperText={errors.batchName}
          />
          <FormControl fullWidth error={errors.batchYear !== ''}>
            <h3>Batch Year</h3>
            <DatePicker
              views={['year']}
              value={batch.batchYear}
              onChange={(date: any) =>
                setBatch({
                  ...batch,
                  batchYear: date,
                })
              }
            />
            <FormHelperText>{errors.batchYear}</FormHelperText>
          </FormControl>
          <Grid
            gap={1}
            sx={{
              justifyContent: 'space-between',
            }}
            container>
            <Grid item xs={12} md={5.5}>
              <FormControl error={errors.supervisorLength !== ''}>
                <h3>Batch Supervisors</h3>
                <Repository
                  add={true}
                  buttonClick={appendSupervisor}
                  items={fetchData.supervisors}
                  staff={true}
                />
                <FormHelperText>{errors.supervisorLength}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5.5}>
              <FormControl error={errors.studentLength !== ''}>
                <h3>Students Involved</h3>
                <Repository
                  add={true}
                  buttonClick={appendStudent}
                  items={fetchData.students}
                  staff={false}
                />
                <FormHelperText>{errors.studentLength}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
          <div style={{ height: '15px' }} />
          <button
            onClick={handleSubmission}
            className="buttonWithLeading full-width">
            <MdCreate />
            &nbsp;Create Batch
          </button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ padding: '10px', margin: '10px 0' }}>
            <p className="subtitle">#BatchID#XXXX</p>
            <MdPeople size={86} />
            <h2>{batch.batchName}</h2>
            <p>
              {dayjs(batch.batchYear).format('YYYY') !== 'Invalid Date'
                ? dayjs(batch.batchYear).format('YYYY')
                : null}
            </p>
            <p>Supervisors : {batch.supervisors.length}</p>
            <p>Student : {batch.students.length}</p>
            <h3>Supervisors Involved</h3>
            {batch.supervisors.length > 0 ? (
              <Repository
                add={false}
                buttonClick={removeSupervisor}
                items={batch.supervisors}
                staff={true}
              />
            ) : null}
            <h3>Students Involved</h3>
            {batch.students.length > 0 ? (
              <Repository
                add={false}
                buttonClick={removeStudent}
                items={batch.students}
                staff={false}
              />
            ) : null}
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateBatch;
