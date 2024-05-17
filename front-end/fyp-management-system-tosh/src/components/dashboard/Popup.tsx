import { Card, CardActions, CardContent } from '@mui/material';
import '../../styles/pop.css';
import { motion } from 'framer-motion';
import { HiExclamationCircle } from 'react-icons/hi';

interface PopupProps {
  title: string;
  content: string;
  button1: string;
  button2?: string;
  yesClicked?: () => void;
  noClicked?: () => void;
}

const Popup: React.FC<PopupProps> = (props) => {
  const handleYesClick = props.yesClicked || (() => {});
  const handleNoClick = props.noClicked || (() => {});

  return (
    <motion.div
      className="popupbg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}>
      <Card className="popup">
        <CardContent>
          <h5>{props.title}</h5>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}>
            <HiExclamationCircle
              style={{
                fontSize: '4rem',
                color: 'black',
                margin: '0 auto',
                display: 'block',
                textAlign: 'center',
              }}
            />
          </motion.div>
          <p>{props.content}</p>
        </CardContent>
        <CardActions>
          <button onClick={handleYesClick}>{props.button1}</button>
          {props.button2 ? (
            <button onClick={handleNoClick}>{props.button2}</button>
          ) : null}
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default Popup;
