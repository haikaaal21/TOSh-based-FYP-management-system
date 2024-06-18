import { Card, Divider, Grid, InputLabel, TextField } from '@mui/material';
import '../../styles/panels.css';
import { VscNewFile } from 'react-icons/vsc';
import { motion } from 'framer-motion';
import Dropper from './Dropper';
import { useDropzone } from 'react-dropzone';
import { useCallback, useContext, useEffect, useState } from 'react';
import UploadedFileCard from './UploadedFileCard';
import usePost from '../../hooks/api/usePost';
import AuthUser from '../../context/AuthUserContext';
import Popup from './Popup';
import { useNavigate } from 'react-router';

const CreateComplaint = () => {
  const goto = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);

  const initialAnimationprops = {
    opacity: 0,
    translateY: 10,
  };

  const finalAnimationprops = {
    opacity: 1,
    translateY: 0,
  };

  const [values, setValues] = useState({
    title: '',
    description: '',
  });

  const [files, setFiles] = useState<any[]>([]);
  const [errors, setErrors] = useState({} as { [key: string]: string });
  const { state, handlePost } = usePost();
  const { auth } = useContext(AuthUser);

  const validator = (items: string[]) => {
    const errors = {} as { [key: string]: string };
    for (let i = 0; i < items.length; i++) {
      if (items[i] === '') {
        errors[Object.keys(values)[i]] = 'This field is required';
      } else if (items[i].length < 6) {
        errors[Object.keys(values)[i]] =
          'This field must be at least 6 characters';
      } else {
        errors[Object.keys(values)[i]] = '';
      }
    }
    setErrors(errors);
  };

  const submitComplaint = () => {
    event?.preventDefault();
    if (
      Object.keys(errors).length === 0 ||
      Object.values(errors).every((value) => value === '')
    ) {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i].file);
      }
      console.log(formData);
      handlePost(
        import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
          'complaint/create/' +
          auth.user.specialid,
        formData
      );
    }
  };

  const uploadFile = () => {
    event?.preventDefault();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.click();
    fileInput.onchange = (e: any) => {
      processFiles(e.target.files);
    };
  };

  const changeValue = (e: any, target: string) => {
    setValues({ ...values, [target]: e.target.value });
  };

  useEffect(() => {
    validator([values.title, values.description]);
  }, [values]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    processFiles(acceptedFiles);
  }, []);

  const deleteFile = (event: React.MouseEvent, filestaticid: string) => {
    event.preventDefault();
    const newFiles = files.filter(
      (fileItem: any) => fileItem.key !== filestaticid
    );
    setFiles(newFiles);
  };

  useEffect(() => {
    if (state.data !== null) {
      if (state.data.status) {
        setOpenPopup(true);
      } else {
        setOpenPopup(false);
      }
    }
  }, [state.data]);

  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  const processFiles = (files: File[]) => {
    for (let i = 0; i < files.length; i++) {
      const id = files[i].name + '_' + (Math.random() * 500).toFixed(0);
      if (files[i].size > 1024 * 1024 * 1024) {
        alert('File size too large');
        return;
      } else {
        const fileItem = {
          file: files[i],
          key: id,
        };
        setFiles((prevFiles: any) => [...prevFiles, fileItem]);
      }
    }
  };

  const closePopup = () => {
    event?.preventDefault();
    if (state.data !== null) {
      state.data.status === 200 ? goto('../complaints') : setOpenPopup(false);
    }
  };

  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      container
      gap={2}>
      {openPopup ? (
        <Popup
          title={
            state.data.status === 200 && state.data !== null
              ? 'Success'
              : 'Error'
          }
          content={state.data.message}
          button1="Okay"
          yesClicked={() => closePopup()}
        />
      ) : null}
      <Grid item xs={12} md={7}>
        <h1>Create a new complaint</h1>
        <div
          style={{
            height: '20px',
          }}
        />
        <form onSubmit={submitComplaint}>
          <InputLabel>Complaint Title*</InputLabel>
          <TextField
            fullWidth
            onChange={(e) => changeValue(e, 'title')}
            value={values.title}
            autoFocus
            helperText={errors.title}
          />
          <div style={{ height: '20px' }} />
          <InputLabel>Complaint Description*</InputLabel>
          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={12}
            helperText={errors.description}
            onChange={(e) => changeValue(e, 'description')}
            value={values.description}
            autoFocus
          />
          <div style={{ height: '20px' }} />
          <Dropper
            isDragActive={isDragActive}
            getRootProps={getRootProps}
            uploadfile={uploadFile}
          />

          <div style={{ height: '20px' }} />
          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <VscNewFile size={24} />
            &nbsp; Submit Complaint
          </button>
        </form>
      </Grid>

      <Grid item xs={12} md={4}>
        {values.title !== '' ||
        values.description !== '' ||
        files.length > 0 ? (
          <Card
            sx={{
              padding: '10px',
              width: '100%',
            }}>
            <p className="subtitle"> Display of your new complaint</p>
            {values.title !== '' ? (
              <motion.h2
                initial={initialAnimationprops}
                animate={finalAnimationprops}
                style={{ wordWrap: 'break-word' }} // Add this line
              >
                {values.title}
              </motion.h2>
            ) : null}
            <Divider />
            {values.description !== '' ? (
              <motion.p
                initial={initialAnimationprops}
                animate={finalAnimationprops}
                style={{
                  wordWrap: 'break-word',
                }}>
                {values.description}
              </motion.p>
            ) : null}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                overflowX: 'scroll',
              }}>
              {files.length > 0
                ? files.map((item: any) => {
                    return (
                      <UploadedFileCard
                        filestaticid={item.key}
                        filename={item.file.name}
                        filetype={item.file.type}
                        filesize={item.file.size}
                        onDelete={deleteFile}
                      />
                    );
                  })
                : null}
            </div>
          </Card>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default CreateComplaint;
