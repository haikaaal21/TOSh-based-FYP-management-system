import { Avatar } from '@mui/material';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
interface ComplaintReplyProps {
  profilepic: string;
  name: string;
  complaintreplytext: string;
  complaintreplyid: string;
  ComplaintReply: string;
}

const ComplaintReply: React.FC<ComplaintReplyProps> = (props) => {
  const [replyDate, setReplyDate] = useState<string>(props.ComplaintReply);

  useEffect(() => {
    setReplyDate(dayjs(props.ComplaintReply).format('DD/MM/YYYY'));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 25 }}
      animate={{ opacity: 1, translateY: 0 }}
      key={props.complaintreplyid}
      style={{
        margin: '10px 0',
        position: 'relative',
        backgroundColor: 'white',
        padding: '15px 10px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
      }}>
      <p
        style={{
          position: 'absolute',
          top: '5px',
          right: '10px',
        }}
        className="subtitle">
        {replyDate}
      </p>
      <div>
        <Avatar
          src={
            import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + props.profilepic
          }
        />
      </div>
      <div style={{ width: '15px' }} />
      <div>
        <h3>{props.name}</h3>
        <p>{props.complaintreplytext}</p>
      </div>
    </motion.div>
  );
};

export default ComplaintReply;
