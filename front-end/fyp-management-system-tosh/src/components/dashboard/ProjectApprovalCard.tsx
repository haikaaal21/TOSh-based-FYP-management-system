import { Card, CardContent, Grid, Typography } from '@mui/material';
import { IoMdCheckmark } from 'react-icons/io';
import { MdCancel, MdCategory, MdDelete, MdPerson, MdViewAgenda } from 'react-icons/md';
import { useNavigate } from 'react-router';
import useGet from '../../hooks/api/useGet';
import { useEffect } from 'react';
import DefaultImage from '../../assets/images/default/Project.png';

interface ProjectApprovalCardProps {
  id: string;
  title: string;
  supervisor: string;
  type: string;
  description: string;
  imageUrl: string;
  openSnackbar: (message: string, severity: 'success' | 'error') => void;
  forDeletion?: boolean;
}
const ProjectApprovalCard: React.FC<ProjectApprovalCardProps> = (props) => {
  const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;
  const goto = useNavigate();
  const { handleGet, state } = useGet();

  const approveProject = () => {
    if (props.forDeletion) {
      handleGet(url + 'project/truncate/' + props.id);
    } else {
      handleGet(url + 'project/approve/' + props.id);
    }
  };

  const declineProject = () => {
    if(props.forDeletion){
      handleGet(url + 'project/restore/' + props.id);
    } else {
      handleGet(url + 'project/disapprove/' + props.id);
    }
  };

  const viewProject = () => {
    goto('../projects/' + props.id);
  };

  useEffect(() => {
    if (state.error) {
      props.openSnackbar(state.data.message, 'error');
    } else if (state.data) {
      props.openSnackbar(state.data.message, 'success');
    }
  }, [state.data]);

  return (
    <Card
      key={props.id}
      sx={{
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
      <Grid sx={{ minHeight: '250px' }} container>
        <Grid item xs={12} md={5}>
          
          <img
            src={props.imageUrl ? url + '/assets' + props.imageUrl : DefaultImage}
            alt={props.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
           {
              props.forDeletion ? (
                <p className='subtitle with-leading' style={{
                  color: 'var(--SparesRed)',
                  justifyContent: 'flex-start',
                  fontWeight: 'bold',
                }}><MdDelete />&nbsp;Requesting the project to be deleted</p>
              ) : null
           }
            <Typography gutterBottom variant="h5" component="div">
              {props.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <MdPerson /> Supervisor : {props.supervisor}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <MdCategory /> Type : {props.type}
            </Typography>
            <Typography
              sx={{ overflowY: 'scroll', textAlign: 'justify' }}
              variant="body2"
              color="text.secondary">
              {props.description}
            </Typography>
          </CardContent>
        </Grid>
        <Grid item xs={12} md={2}>
          <button
            onClick={() => approveProject()}
            style={{
              backgroundColor: 'var(--GoodGreen)',
              margin: '5px 0',
            }}
            className="buttonWithLeading full-width">
            <IoMdCheckmark />
            &nbsp;Approve
          </button>
          <button
            onClick={() => declineProject()}
            style={{
              backgroundColor: 'var(--IndicatorRed)',
              margin: '5px 0',
            }}
            className="buttonWithLeading full-width">
            <MdCancel />
            &nbsp;Reject
          </button>
         {
            !props.forDeletion ? (
              <button
              onClick={() => viewProject()}
              style={{ margin: '5px 0' }}
              className="buttonWithLeading full-width">
              <MdViewAgenda />
              &nbsp;View Project
            </button>
            ) : null
         }
        </Grid>
      </Grid>
    </Card>
  );
};
export default ProjectApprovalCard;

