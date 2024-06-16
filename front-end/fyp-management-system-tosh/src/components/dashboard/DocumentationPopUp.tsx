import { Card, FormControl, FormHelperText, TextField } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdDelete, MdUpload } from 'react-icons/md';
import Dropper from './Dropper';
import '../../styles/panels.css';
import { motion } from 'framer-motion';
import usePost from '../../hooks/api/usePost';
import AuthUser from '../../context/AuthUserContext';
import { useParams } from 'react-router';

interface DocumentationPopUpProps {
  onXClick: () => void;
  openSnackbar: (message: string, severity: 'success' | 'error') => void;
}
const DocumentationPopUp: React.FC<DocumentationPopUpProps> = (props) => {
  const [image, setImage] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    filterAndSet(file);
  }, []);

  const { getRootProps, isDragActive } = useDropzone({ onDrop });
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');

  const uploadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    input.click();
    input.addEventListener('change', (e) => {
      const selectedFile = (e.target as HTMLInputElement)?.files?.[0];
      if (selectedFile) {
        filterAndSet(selectedFile);
      }
    });
  };

  const filterAndSet = (file: File) => {
    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
    const fileSizeMax = 25 * 1024 * 1024;
    if (!allowedFormats.includes(file.type)) {
      setError('File format not supported');
      return;
    } else if (file.size > fileSizeMax) {
      setError('File size too large');
      return;
    } else {
      setImage(file);
    }
  };

  const validate = () => {
    if (!title) {
      setError('Please enter a title');
    } else if (title.length < 5) {
      setError('Title must be at least 5 characters long');
    } else if (!image?.name) {
      setError('Please upload a file');
    } else {
      setError('');
    }
  };

  useEffect(() => {
    validate();
  }, [image, title]);

  const deleteImage = () => {
    setImage(null);
  };

  const { state, handlePost } = usePost();
  const { batchid } = useParams();

  const { auth } = useContext(AuthUser);

  const url =
    import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
    'batch/documentation/upload/' +
    batchid +
    '/' +
    auth.user.id;

  const submitToApi = (event: React.FormEvent) => {
    event.preventDefault();
    validate();
    if (error.length === 0) {
      const formData = new FormData();
      formData.append('documentationtitle', title);
      formData.append('image', image as File);
      handlePost(url, formData);
    }
  };

  useEffect(() => {
    if (state.data) {
      if (!state.error) {
        props.openSnackbar('Documentation uploaded successfully', 'success');
        props.onXClick();
      } else {
        props.openSnackbar('Failed to upload documentation', 'error');
      }
    }
  }, [state.data]);

  return (
    <div className="popupbg">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Card
          sx={{
            padding: '15px 25px',
          }}
          className="free-float">
          <form onSubmit={(event) => submitToApi(event)}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}>
              <h2
                className="with-leading"
                style={{ justifyContent: 'flex-start' }}>
                <MdUpload />
                &nbsp;Upload a documentation
              </h2>
              <button
                onClick={props.onXClick}
                className="buttonWithLeading"
                style={{
                  backgroundColor: 'var(--IndicatorRed)',
                  width: '50px',
                  aspectRatio: '1/1',
                }}>
                X
              </button>
            </div>
            <h3>Name</h3>
            <TextField
              sx={{ marginBottom: '10px' }}
              variant="outlined"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FormControl sx={{ marginBottom: '10px' }} fullWidth>
              {image ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: 'var(--SparesIndigo)',
                    borderRadius: '5px',
                    position: 'relative',
                  }}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="uploaded"
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '650px',
                      maxHeight: '650px',
                      objectFit: 'contain',
                    }}
                  />
                  <button
                    onClick={() => deleteImage()}
                    className="buttonWithLeading"
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      backgroundColor: 'var(--IndicatorRed)',
                      height: '50px',
                      width: '50px',
                    }}>
                    <MdDelete />
                  </button>
                </div>
              ) : (
                <Dropper
                  isDragActive={isDragActive}
                  getRootProps={getRootProps}
                  uploadfile={uploadFile}
                />
              )}
            </FormControl>
            <button
              type="submit"
              disabled={error.length > 0}
              className="buttonWithLeading full-width">
              <MdUpload />
              &nbsp;Upload File
            </button>
            <FormHelperText error>{error}</FormHelperText>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default DocumentationPopUp;
