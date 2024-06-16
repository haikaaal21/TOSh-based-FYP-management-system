import { motion } from 'framer-motion';
import { IoFolder, IoHandRight } from 'react-icons/io5';
import { MdUpload } from 'react-icons/md';
interface DropperProps {
  isDragActive: boolean;
  getRootProps: () => any;
  uploadfile: () => void;
  id?: string;
}

const Dropper: React.FC<DropperProps> = (props) => {
  return (
    <div
      id={props.id}
      style={{
        backgroundColor: props.isDragActive ? 'var(--SparesIndigo)' : '',
      }}
      {...props.getRootProps()}
      className="dropzone">
      {props.isDragActive ? (
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
          initial={{ translateY: 10, opacity: 0 }}
          animate={{
            translateY: 0,
            opacity: 1,
            transition: { ease: 'easeOut' },
          }}>
          <IoHandRight size={64} />
          <h3>Drop it like it's steaming hot!</h3>
        </motion.div>
      ) : (
        <>
          <IoFolder size={64} />
          <p>Drop your files here</p>
          <p>Or</p>
          <button
            type="button"
            onClick={props.uploadfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MdUpload size={24} /> &nbsp;Click here to upload your files
          </button>
        </>
      )}
    </div>
  );
};

export default Dropper;
