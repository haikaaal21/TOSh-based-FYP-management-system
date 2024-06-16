import { Card, CardContent, CardMedia } from '@mui/material';
import { IoPerson } from 'react-icons/io5';
import DefaultImage from '../../assets/images/default/Speaker.png';

interface Speaker {
  eventspeakerid: number;
  eventspeaker: string;
  eventspeakerbio: string;
  eventspeakercontact: string;
  eventspeakerimage: string;
}

const SpeakerCard: React.FC<Speaker> = (props) => {
  return (
    <Card sx={{ display: 'flex', minWidth: '550px' }}>
      <CardMedia
        component="img"
        image={
          props.eventspeakerimage
            ? props.eventspeakerimage.includes('blob')
              ? props.eventspeakerimage
              : import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
                props.eventspeakerimage
            : DefaultImage
        }
        sx={{ width: '200px', height: '200px' }}
      />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}>
        <h3>{props.eventspeaker}</h3>
        <p style={{ textAlign: 'justify' }}>{props.eventspeakerbio}</p>
        <a
          className="contact-item"
          href={`mailto:${props.eventspeakercontact}`}>
          <IoPerson size={22} /> <p>Email</p>
        </a>
      </CardContent>
    </Card>
  );
};

export default SpeakerCard;
