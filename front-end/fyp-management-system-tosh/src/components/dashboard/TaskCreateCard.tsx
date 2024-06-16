import { Card } from '@mui/material';
import { useContext, useEffect } from 'react';
import TaskContext from '../../context/TaskContext';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { IoMdClock } from 'react-icons/io';
import { BsLockFill, BsUnlock } from 'react-icons/bs';

const TaskCreateCard = () => {
  const { task } = useContext(TaskContext);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0 }}>
      <Card
        sx={{
          padding: '10px 8px',
        }}>
        <p className="subtitle">Task#xxxx</p>
        <h3>
          {task.lock ? <BsLockFill /> : <BsUnlock />} {task.tasktitle}
        </h3>
        <p
          style={{
            wordWrap: 'break-word',
          }}>
          {task.taskdescription}
        </p>
        <p
          style={{ justifyContent: 'flex-start' }}
          className="subtitle with-leading">
          <IoMdClock />
          &nbsp;Deadlines
        </p>
        <div style={{ backgroundColor: 'yellow' }}>
          <p className="subtitle">Yellowzone</p>
          <p>{dayjs(task.yellowzone).format('DD/MMMM/YYYY')}</p>
        </div>
        <div style={{ backgroundColor: 'red', color: 'white' }}>
          <p style={{ color: 'white' }} className="subtitle">
            Redzone
          </p>
          <p>{dayjs(task.redzone).format('DD/MMMM/YYYY')}</p>
        </div>
        <div style={{ backgroundColor: 'black', color: 'white' }}>
          <p style={{ color: 'white' }} className="subtitle">
            Deadline
          </p>
          <p>{dayjs(task.duedate).format('DD/MMMM/YYYY')}</p>
        </div>
        {task.taskfiles ? <p>Document Count: {task.taskfiles.length}</p> : null}
      </Card>
    </motion.div>
  );
};

export default TaskCreateCard;
