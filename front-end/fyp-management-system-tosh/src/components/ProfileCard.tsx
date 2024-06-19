import { Card, CardActions, CardContent, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';
import { MdAdd, MdRemove } from 'react-icons/md';
import DefaultImage from '../assets/images/default/PFP.png';

interface profileCardProps {
  name: string;
  id: number;
  image: string;
  buttonClick: (id: number) => void;
  add: boolean;
  staff: boolean;
  disabled?: boolean;
  hidden?: boolean;
  matricnumber?: string;
  noDetails?: boolean;
}

const ProfileCard: React.FC<profileCardProps> = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <CardMedia
          sx={{
            height: '100px',
            width: '100px',
            backgroundColor: 'red',
          }}
          component="img"
          image={props.image ? `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}assets${props.image}` : DefaultImage}
        />
        <CardContent>
          <h4
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '160px',
              overflow: 'hidden',
            }}>
            {props.name}
          </h4>
          <p className="subtitle">
            {props.noDetails? '' : props.staff ? 'StaID#' : 'StuID#'}
            {props.id}
          </p>
          <p className="subtitle">{props.matricnumber}</p>
        </CardContent>
        {props.hidden ? (
          <div></div>
        ) : (
          <CardActions>
            <button
              disabled={props.disabled}
              onClick={() => {
                props.buttonClick(props.id);
              }}
              style={{
                backgroundColor: props.add
                  ? 'var(--SparesIndigo)'
                  : 'var(--IndicatorRed)',
              }}
              className="buttonWithLeading">
              {props.add ? <MdAdd /> : <MdRemove />}
            </button>
          </CardActions>
        )}
      </Card>
    </motion.div>
  );
};
export default ProfileCard;
