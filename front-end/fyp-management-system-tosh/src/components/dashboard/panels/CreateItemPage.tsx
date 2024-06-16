import { FormControl, Grid, ToggleButton } from '@mui/material';
import { useState } from 'react';
import TaskCreationComponent from '../TaskCreationComponent';
import TaskCreateCard from '../TaskCreateCard';
import EventCreationComponent from '../EventCreationComponent';
import EventCreateCard from '../EventCreateCard';
import { IoMdDocument } from 'react-icons/io';
import { MdEvent } from 'react-icons/md';
import SpeakerCreationComponent from '../SpeakerCreationComponent';
import ParticipantCreationComponent from '../ParticipantCreationComponent';
import SubmittingProcess from './SubmittingProcess';

const checkType = () => {
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  if (type !== '' || !type) {
    return type;
  } else {
    return '';
  }
};

const CreateItemPage = () => {
  const [type, setType] = useState(checkType);
  const [stage, setStage] = useState(1);

  const gotoStage = (stage: number) => {
    setStage(stage);
  };

  return (
    <>
      <h1>Creation Page</h1>
      <Grid
        gap={1}
        sx={{ padding: '15px 5px', justifyContent: 'space-between' }}
        container>
        <Grid item xs={12} md={7.5}>
          <FormControl fullWidth>
            <Grid container>
              <Grid item xs={12} md={6}>
                <ToggleButton
                  fullWidth
                  disabled={stage > 1}
                  value="Task"
                  selected={type === 'Task'}
                  onChange={() => setType('Task')}>
                  {' '}
                  <IoMdDocument />
                  &nbsp;Task{' '}
                </ToggleButton>
              </Grid>
              <Grid item xs={12} md={6}>
                <ToggleButton
                  fullWidth
                  disabled={stage > 1}
                  value="Event"
                  selected={type === 'Event'}
                  onChange={() => setType('Event')}>
                  {' '}
                  <MdEvent />
                  &nbsp;Event{' '}
                </ToggleButton>
              </Grid>
            </Grid>
          </FormControl>
          <div style={{ padding: '15px 0' }}>
            {stage === 1 ? (
              type === 'Task' ? (
                <TaskCreationComponent goto={gotoStage} />
              ) : type === 'Event' ? (
                <EventCreationComponent goto={gotoStage} />
              ) : null
            ) : stage === 2 ? (
              <SpeakerCreationComponent goto={gotoStage} />
            ) : stage === 3 ? (
              <ParticipantCreationComponent
                goto={gotoStage}
                type={type ? type : ''}
              />
            ) : stage === 4 ? (
              <SubmittingProcess type={type ? type : ''} />
            ) : null}
          </div>
        </Grid>
        <Grid item xs={12} md={3.5}>
          {type === 'Task' ? (
            <TaskCreateCard />
          ) : type === 'Event' ? (
            <EventCreateCard />
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

export default CreateItemPage;
