import { Card, CardActionArea, Grid } from '@mui/material';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import AuthUser from '../../context/AuthUserContext';
import { useNavigate } from 'react-router';
import DefaultImage from '../../assets/images/default/PFP.png';

interface ComplaintCardProps {
  complaintdate: string;
  complaintnotification: number;
  complaintstatus: string;
  complainttext: string;
  complainttitle: string;
  complaintid: string;
  name?: string;
  profilepic?: string;
  matricnumber?: string;
}

const ComplaintCard: React.FC<ComplaintCardProps> = (props) => {
  const [statusColor, setStatusColor] = useState<string>('');
  const { auth } = useContext(AuthUser);

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
  }, []);

  const goto = useNavigate();

  return (
    <Grid item xs={12}>
      <Card>
        <div
          onClick={() => {
            goto(`../complaint/${props.complaintid}`);
          }}>
          <CardActionArea sx={{ padding: '0.5rem 1rem' }}>
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
                {auth.user.role === 'Student' ? (
                  <p>{props.complaintnotification} notifcation(s) </p>
                ) : null}
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
                    padding: '0px 15px',
                    height: '30px',
                    borderRadius: '25px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
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
            {props.name ? (
              <>
                <p className="subtitle" style={{ fontWeight: '500' }}>
                  By:{' '}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: '500',
                  }}>
                  <img
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      padding: '0 10px',
                    }}
                    src={
                      props.profilepic
                        ? import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + 'assets' + 
                          props.profilepic
                        : DefaultImage
                    }
                    alt="image"
                  />
                  <div>
                    <p>{props.name}</p>
                    <p>{props.matricnumber}</p>
                  </div>
                </div>
              </>
            ) : null}
          </CardActionArea>
        </div>
      </Card>
    </Grid>
  );
};

export default ComplaintCard;
