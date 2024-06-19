import { Card, CardActionArea, Divider, Grid } from '@mui/material';
import { useEffect } from 'react';
import { MdCalendarMonth, MdPeople } from 'react-icons/md';
import { useNavigate } from 'react-router';
import DefaultImage from '../../assets/images/default/Batch.png';

interface batchCardProps {
  batchName: string;
  batchYear: string;
  supervisors: number;
  students: number;
  projects: number;
  status: string;
  batchId: number;
  batchHead: string;
  batchImage: string;
}

const BatchCard: React.FC<batchCardProps> = (props) => {
  const goto = useNavigate();

  const navigate = () => {
    goto(`${props.batchId}`);
  };

  useEffect(() => {
    console.log(props.status);
  });

  return (
    <div onClick={navigate} id={props.batchId.toString()}>
      <Card>
        <CardActionArea
          style={{
            padding: '5px 15px',
          }}>
          <Grid sx={{ justifyContent: 'space-between' }} container gap={0.5}>
            <Grid item xs={12} md={5.5}>
              <img
                src={
                  props.batchImage
                    ? import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + + '/assets' + 
                      props.batchImage
                    : DefaultImage
                }
                style={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: '5/3',
                  objectFit: 'cover',
                  backgroundColor: 'red',
                  borderRadius: '10px',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <MdPeople size={86} />
              <h2>{props.batchName}</h2>
              <p
                style={{
                  backgroundColor:
                    props.status === 'Preparation'
                      ? 'var(--Preparation)'
                      : props.status === 'Undergoing'
                        ? 'var(--IndicatorBlue)'
                        : 'var(--NeutralGrey)',
                  color: 'white',
                  padding: '5px',
                  borderRadius: '5px',
                }}>
                Batch Status : {props.status}
              </p>
              <p>Led by: {props.batchHead}</p>
              <p>
                <MdCalendarMonth />
                &nbsp;Year of operation : {props.batchYear}
              </p>
              <Divider />
              <h3>Item counts</h3>
              <p>Supervisors: {props.supervisors}</p>
              <p>Students: {props.students}</p>
              <p>Projects: {props.projects}</p>
            </Grid>
          </Grid>
        </CardActionArea>
      </Card>
    </div>
  );
};

export default BatchCard;
