import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { MdCategory, MdPerson } from 'react-icons/md';
import { useNavigate } from 'react-router';
import DefaultImage from '../assets/images/default/Project.png';

interface BriefProjectProps {
  title: string;
  name: string;
  typeOfProject: string;
  imageUrl: string;
  id: string;
}
const BriefProject: React.FC<BriefProjectProps> = ({
  title,
  name,
  typeOfProject,
  imageUrl,
  id,
}) => {
  const goto = useNavigate();

  const viewProject = () => {
    goto('../projects/' + id);
  };

  return (
    <Card sx={{ minWidth: 345, margin: '5px', width: '645px' }}>
      <div onClick={viewProject} style={{ width: '100%', height: '100%' }}>
        <CardActionArea sx={{ height: '100%', width: '100%', padding: '5px' }}>
          <CardMedia
            component="img"
            height="180"
            image={
              imageUrl
                ? import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + imageUrl
                : DefaultImage
            }
            alt={title}
            sx={{
              objectFit: 'cover',
              minWidth: '100%',
              borderRadius: '10px',
            }}
          />
          <CardContent>
            <Typography
              sx={{
                height: '70px',
              }}
              gutterBottom
              variant="h5"
              component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <MdPerson /> {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <MdCategory /> {typeOfProject}
            </Typography>
          </CardContent>
        </CardActionArea>
      </div>
    </Card>
  );
};

export default BriefProject;
