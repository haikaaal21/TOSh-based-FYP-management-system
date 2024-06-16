import { useContext, useEffect, useState } from 'react';
import AuthUser from '../../context/AuthUserContext';
import useGet from '../../hooks/api/useGet';
import { MdAdd, MdArrowBack, MdPersonAdd } from 'react-icons/md';
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
} from '@mui/material';
import TaskContext from '../../context/TaskContext';
import EventContext from '../../context/EventContext';

interface ParticipantCreationComponentProps {
  type: string;
  goto: (stage: number) => void;
}
const ParticipantCreationComponent: React.FC<
  ParticipantCreationComponentProps
> = (props) => {
  const { auth } = useContext(AuthUser);
  const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;
  const { state: batchGetState, handleGet: getBatch } = useGet();
  const { state: usersState, handleGet: getUsers } = useGet();
  const university = auth.user.institution.replace(/\s/g, '_');

  const [batch, setBatch] = useState('');
  const [users, setUsers] = useState([]);

  const { alterAttendees, onChangeEvent, eventItem } = useContext(EventContext);
  const { alterRecipients, onChangetask, task } = useContext(TaskContext);

  const [allSelected, setAllSelected] = useState(false);

  const comboboxAlter = (ids: number[]) => {
    if (props.type === 'Event') {
      alterAttendees(ids);
    } else if (props.type === 'Task') {
      alterRecipients(ids);
    }
  };

  const selectAll = () => {
    setAllSelected(!allSelected);
    if (!allSelected) {
      comboboxAlter(users.map((item: any) => item.userid));
    } else {
      comboboxAlter([]);
    }
  };

  useEffect(() => {
    getBatch(url + 'batch/fetch/' + university +'?batchstatus=2');
  }, []);

  const getBatchData = () => {
    getBatch(url + 'batch/fetch/' + university + '?batchstatus=2');
  };

  const fetchUsers = () => {
    if (auth.user.role.includes('Coordinator')) {
      getUsers(url + 'user/fetch/' + batch + '?uni=' + university);
    } else {
      getUsers(url + 'user/fetch/' + batch + '?staffid=' + auth.user.specialid);
    }
  };

  useEffect(() => {
    if (batch !== '') {
      fetchUsers();
    }
  }, [batch]);

  useEffect(() => {
    if (usersState.data) {
      setUsers(usersState.data.data);
    }
  }, [usersState.data]);

  const goBack = () => {
    if (props.type === 'Event') {
      props.goto(2);
    } else if (props.type === 'Task') {
      props.goto(1);
    }
  };

  const [errors, setErrors] = useState('');

  useEffect(() => {
    checkParticipants();
  }, [eventItem, task]);

  const checkParticipants = () => {
    if (props.type === 'Event') {
      if (eventItem.attendees.length === 0) {
        setErrors('Please select at least one participant');
      } else {
        setErrors('');
      }
    } else if (props.type === 'Task') {
      if (task.taskRecipients.length === 0) {
        setErrors('Please select at least one participant');
      } else {
        setErrors('');
      }
    }
  };

  const submitItem = () => {
    console.log('Item');
    errors === '' ? props.goto(4) : null;
  };

  useEffect(() => {
    if (props.type === 'Event') {
      onChangeEvent('batch', batch);
      console.log(eventItem);
    } else if (props.type === 'Task') {
      onChangetask('batch', batch);
    }
  }, [batch]);

  return (
    <>
      <h3 className="with-leading" style={{ justifyContent: 'flex-start' }}>
        <MdPersonAdd />
        &nbsp;Add the people involved
      </h3>
      <FormControl sx={{ margin: '15px 0' }} fullWidth>
        <InputLabel>Batch</InputLabel>
        <Select
          label="Batch"
          value={batch}
          onClick={() => getBatchData()}
          onChange={(e) => setBatch(e.target.value as string)}>
          {batchGetState.data &&
            batchGetState.data.map((item: any) => {
              return <MenuItem value={item.batchid}>{item.batchname}</MenuItem>;
            })}
        </Select>
      </FormControl>
      {batch !== '' && usersState.data ? (
        <FormControl sx={{ margin: '15px 0' }} fullWidth>
          <div style={{ display: 'flex' }}>
            <ToggleButton
              value="check"
              selected={allSelected}
              onClick={() => selectAll()}
              className="full-width">
              <MdPersonAdd />
              &nbsp;Everyone in this batch
            </ToggleButton>
          </div>
          <Autocomplete
            disableCloseOnSelect
            aria-required
            multiple
            id="tags-standard"
            disabled={allSelected}
            options={users}
            onChange={(e, value) => {
              console.log(e);
              comboboxAlter(value.map((item: any) => item.userid));
            }}
            getOptionLabel={(option: any) => option.name}
            groupBy={(option: any) =>
              option.isstaff ? 'Supervisor' : 'Student'
            }
            renderOption={(props, option, {}) => (
              <li
                style={{ display: 'flex', justifyContent: 'space-between' }}
                {...props}>
                <div>
                  <Checkbox
                    checked={eventItem.attendees.includes(option.userid)}
                  />
                  {option.name}
                </div>{' '}
                <p className="subtitle"> {option.matricnumber}</p>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Participants"
                placeholder="Participants"
              />
            )}
          />
        </FormControl>
      ) : null}
      <FormHelperText error>{errors}</FormHelperText>
      <Grid sx={{ justifyContent: 'space-between' }} gap={0.5} container>
        <Grid item xs={12} md={5.75}>
          <button
            onClick={() => goBack()}
            style={{ justifyContent: 'center' }}
            className="with-leading full-width">
            <MdArrowBack />
            &nbsp;Back
          </button>
        </Grid>
        <Grid item xs={12} md={5.75}>
          <button
            onClick={() => submitItem()}
            className="buttonWithLeading full-width">
            <MdAdd />
            &nbsp;Create {props.type}
          </button>
        </Grid>
      </Grid>
    </>
  );
};

export default ParticipantCreationComponent;
