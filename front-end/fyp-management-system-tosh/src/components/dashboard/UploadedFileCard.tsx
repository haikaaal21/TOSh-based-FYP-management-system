import { Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { FaFile } from 'react-icons/fa';
import { MdDelete, MdImage } from 'react-icons/md';

interface UploadedFileCardProps {
  filestaticid: string;
  filename: string;
  filesize: number;
  filetype: string;
  onDelete: (event: React.MouseEvent, id: string) => void;
}

const UploadedFileCard: React.FC<UploadedFileCardProps> = (props) => {
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
  ];

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      id={props.filestaticid}>
      <Card
        style={{
          position: 'relative',
          width: '350px',
          height: '250px',
          margin: '14px 7px',
          display: 'flex',
        }}>
        <button
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'var(--IndicatorRed)',
            color: 'white',
            width: '12%',
            aspectRatio: '1/1',
            margin: '5px',
            borderRadius: '20%',
          }}
          onClick={(event) => props.onDelete(event, props.filestaticid)}>
          <MdDelete size={24} />
        </button>
        <CardContent>
          {props.filetype ===
          imageFileType.find((type) => type === props.filetype) ? (
            <MdImage size={64} />
          ) : (
            <FaFile size={64} />
          )}
          <h2
            style={{
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '6rem',
            }}>
            {props.filename}
          </h2>
          <div>
            <p>{props.filetype}</p>
            <p>{(props.filesize / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UploadedFileCard;
