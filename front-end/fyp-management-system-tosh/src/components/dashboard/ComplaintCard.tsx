import { Card, CardActionArea, Grid } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
interface ComplaintCardProps {
  complaintdate: string;
  complaintnotification: number;
  complaintstatus: string;
  complainttext: string;
  complainttitle: string;
  complaintid: string;
}

const ComplaintCard: React.FC<ComplaintCardProps> = (props) => {
  const [statusColor, setStatusColor] = useState<String>('');

  useEffect(() => {
    if (props.complaintstatus === 'Pending') {
      setStatusColor('gray');
    } else if (props.complaintstatus === 'Closed') {
      setStatusColor('green');
    } else if (props.complaintstatus === 'Under Review') {
      setStatusColor('yellow');
    } else if (props.complaintstatus === 'Under Process') {
      setStatusColor('blue');
    }
    console.log(statusColor);
  }, []);

  return (
    <Grid item xs={12}>
      <Card>
        <CardActionArea
          href={`./complaint/${props.complaintid}`}
          sx={{ padding: '0.5rem 1rem' }}>
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              <p>
                <i>
                  Created on {dayjs(props.complaintdate).format('DD/MM/YYYY')}
                </i>
              </p>
              <p>{props.complaintnotification} Notifications</p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              <h2>{props.complainttitle}</h2>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: statusColor as string,
                  padding: '0px 35px',
                  height: '30px',
                  borderRadius: '10px',
                }}>
                <p
                  style={{
                    color: 'white',
                  }}>
                  {props.complaintstatus}
                </p>
              </div>
            </div>
          </div>
          <p style={{ textAlign: 'justify', fontWeight: '400' }}>
            {`${props.complainttext}`.slice(0, 400)}
          </p>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default ComplaintCard;
