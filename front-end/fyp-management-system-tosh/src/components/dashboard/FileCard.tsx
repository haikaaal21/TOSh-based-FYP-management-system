import { Card, CardActionArea } from '@mui/material';
import { FaFile } from 'react-icons/fa';
import { MdImage } from 'react-icons/md';

interface FileCardProps {
  typeOfFile: string;
  fileName: string;
  fileurl: string;
}

const FileCard: React.FC<FileCardProps> = (props) => {
  const imageFileType = [
    'JPEG',
    'PNG',
    'JPG',
    'GIF',
    'SVG',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/svg+xml',
    'image/webp',
  ];

  return (
    <Card
      sx={{
        width: '250px',
        minWidth: '200px',
        minHeight: '100px',
        margin: '14px 8px',
        display: 'flex',
      }}>
      <CardActionArea
        href={import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + 'assets' + props.fileurl}
        download={props.fileName}
        target="_blank"
        sx={{
          padding: '10px 15px',
          display: 'flex',
          justifyContent: 'space-evenly',
        }}>
        {props.typeOfFile ===
        imageFileType.find((type) => type === props.typeOfFile) ? (
          <MdImage size={48} />
        ) : (
          <FaFile size={48} />
        )}
        <div>
          <p style={{ fontWeight: 'bold' }}>{props.fileName}</p>
          <p
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '150px',
            }}>
            {props.typeOfFile}
          </p>{' '}
        </div>
      </CardActionArea>
    </Card>
  );
};

export default FileCard;
