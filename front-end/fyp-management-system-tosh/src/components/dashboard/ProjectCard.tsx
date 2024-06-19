import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
} from '@mui/material';
import ProjectCardProps from '../../types/ProjectCardProps';
import {
  MdCategory,
  MdDelete,
  MdNotifications,
  MdPeople,
  MdPerson,
} from 'react-icons/md';
import DefaultImage from '../../assets/images/default/Project.png';
import { Link } from 'react-router-dom';

const ProjectCard: React.FC<ProjectCardProps> = ({ ...props }) => {
  const currentUrl = window.location.href;
  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Card
        id={props.projectid.toString()}
        sx={{ borderRadius: '15px', height: '430px', backgroundColor: props.pendingForDeletion ? 'var(--SparesRed)' : 'white' }}>
        <Link to={props.pendingForDeletion ? '' : `${currentUrl}/${props.projectid}`}>
        <CardActionArea
          sx={{
            height: '100%',
          }}
          disabled={props.pendingForDeletion}
          >
          {props.projectNotification && props.projectNotification > 0 ? (
            <div
              style={{
                backgroundColor: 'var(--SparesOrange)',
                color: 'white',
                padding: '5px',
                textAlign: 'center',
                borderRadius: '10px',
                margin: '5px 8px',
                width: '50px',
                display: 'inline-block',
              }}>
              <MdNotifications /> {props.projectNotification}
            </div>
          ) : null}
          <div style={{ padding: '10px' }}>
            <CardMedia
              component="img"
              image={
                props.projectimg
                  ? import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
                    props.projectimg
                  : DefaultImage
              }
              sx={{ aspectRatio: '4/2', borderRadius: '10px' }}
            />
          </div>
          <CardContent>
            {
              props.pendingForDeletion ? <p style={{color:'white', justifyContent:'flex-start'}} className='subtitle with-leading'><MdDelete />&nbsp;On request for deletion</p> : null
            }
            <h3>{props.projecttitle}</h3>
            <b
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
              }}>
              <MdPerson /> &nbsp;Supervisor : {props.supervisorname}
            </b>
            <br />
            <b
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
              }}>
              <MdCategory /> &nbsp; Type : {props.typeofproject}
            </b>
            <br />
            {props.projectBatch ? (
              <b
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}>
                <MdPeople /> &nbsp;Batch : {props.projectBatch}
              </b>
            ) : null}
            <p
              style={{
                textAlign: 'justify',
                fontWeight: '200',
                fontSize: '12pt',
              }}>
              {props.projectdescription.slice(0, 150)}
            </p>
          </CardContent>
        </CardActionArea>
        </Link>
      </Card>
    </Grid>
  );
};

export default ProjectCard;
