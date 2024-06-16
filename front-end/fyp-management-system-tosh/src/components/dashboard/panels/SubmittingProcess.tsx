import { motion } from 'framer-motion';
import { useContext, useEffect, useRef, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import AuthUser from '../../../context/AuthUserContext';
import EventContext from '../../../context/EventContext';
import TaskContext from '../../../context/TaskContext';
import usePost from '../../../hooks/api/usePost';
import { MdCancel, MdCheckCircle } from 'react-icons/md';
import { useNavigate } from 'react-router';

interface SubmittingProcessProps {
  type: string;
}
const SubmittingProcess: React.FC<SubmittingProcessProps> = (props) => {
  const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;
  const [text, setText] = useState('Submitting ' + props.type);
  const { auth } = useContext(AuthUser);
  const { getFormedDataFormat: eventFormat } = useContext(EventContext);
  const { getFormedDataFormat: taskFormat } = useContext(TaskContext);
  const { state, handlePost } = usePost();

  const submitCalled = useRef(false);

  useEffect(() => {
    if (!submitCalled.current) {
      submitItem();
      submitCalled.current = true;
    }
    sessionStorage.clear();
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 3) count = 0;
      let dots = '';
      for (let i = 0; i < count; i++) {
        dots += ' . ';
      }
      setText('Submitting ' + props.type + dots);
    }, 750);
    return () => clearInterval(interval);
  }, []);

  const submitItem = () => {
    if (props.type === 'Event') {
      handlePost(url + 'event/create/' + auth.user.specialid, eventFormat());
    } else if (props.type === 'Task') {
      console.log(taskFormat());
      handlePost(url + 'task/create/' + auth.user.id, taskFormat());
    }
  };

  const goto = useNavigate();

  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minHeight: '700px',
      }}
      initial={{ opacity: 0, translateX: 25 }}
      animate={{ opacity: 1, translateX: 0 }}>
      {state.data ? (
        <>
          <MdCheckCircle size={32} />
          <p className="subtitle">{state.data.message}</p>
          <button
            onClick={() => {
              goto('../');
            }}>
            Neat!
          </button>
        </>
      ) : state.error ? (
        <>
          <MdCancel size={32} />
          <p>Error in submitting {props.type}</p>
          <button
            onClick={() => {
              window.location.reload();
            }}>
            Retry creation
          </button>
          <p>{JSON.stringify(eventFormat())}</p>
        </>
      ) : (
        <>
          <ThreeDots wrapperClass="loader-item" color="var(--SparesOrange)" />
          <p className="subtitle">{text}</p>
        </>
      )}
    </motion.div>
  );
};

export default SubmittingProcess;
