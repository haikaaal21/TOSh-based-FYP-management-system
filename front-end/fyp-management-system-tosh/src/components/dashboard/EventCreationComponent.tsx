import { FormControl, FormHelperText, Grid, TextField } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { motion } from 'framer-motion';
import Dropper from './Dropper';
import { useDropzone } from 'react-dropzone';
import { useCallback, useContext, useEffect, useState } from 'react';
import { MdArrowForward, MdDelete, MdImage, MdUpload } from 'react-icons/md';
import EventContext from '../../context/EventContext';
import {
  useCheckEmpty,
  useCheckLength,
  useCheckMaxLength,
} from '../../hooks/newHooks/checkerHooks';
import dayjs from 'dayjs';
import UploadedFileCard from './UploadedFileCard';

interface EventCreationComponentProps {
  goto: (stage: number) => void;
}
const EventCreationComponent: React.FC<EventCreationComponentProps> = (
  props
) => {
  const {
    eventItem,
    appendFiles,
    changeImage,
    onChangeEvent,
    deleteImage,
    deleteItem,
  } = useContext(EventContext);

  const fileDrop = useCallback((acceptedFiles: File[]) => {
    filesProcessing(acceptedFiles);
  }, []);

  const imageProcessing = (file: File[]) => {
    console.log('CALLED', file);
    const item = file[0];
    const maxSize = 10 * 1024 * 1024;
    const acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (item.size > maxSize) {
      setErrors({ ...error, image: 'File size too large' });
    } else if (!acceptedTypes.includes(item.type)) {
      setErrors({ ...error, image: 'Invalid file type' });
    } else {
      setErrors({ ...error, image: '' });
      changeImage(item);
    }
  };

  const filesProcessing = (files: File[]) => {
    console.log(files);
    const maxSize = 10 * 1024 * 1024;
    files.forEach((file) => {
      if (file.size > maxSize) {
        setErrors({ ...error, files: 'File size too large' });
      } else {
        setErrors({ ...error, files: '' });
        appendFiles(files);
      }
    });
  };

  const nextStage = () => {
    if (Object.values(error).every((error) => error === '')) {
      props.goto(2);
    } else {
      return;
    }
  };

  useEffect(() => {
    const whatToSet = {
      title: eventItem.title,
      description: eventItem.description,
      location: eventItem.location,
      date: '',
      time: '',
      image: {} as File,
      files: [],
      attendees: [],
      speakers: [],
      eventhead: 0,
      batch: 0,
    };
    sessionStorage.setItem('event', JSON.stringify(whatToSet));
  }, [eventItem]);

  const { getRootProps, isDragActive } = useDropzone({ onDrop: fileDrop });

  const uploadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.click();
    input.addEventListener('change', (e: any) => {
      const crutch: File[] = Array.from(e.target.files);
      filesProcessing(crutch);
    });
  };

  const uploadImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    input.click();
    input.addEventListener('change', (e: any) => {
      const file: File[] = Array.from(e.target.files);
      imageProcessing(file);
    });
  };

  const [error, setErrors] = useState({} as { [key: string]: string });

  const [checkEmpty, checkLength, checkMaxLength] = [
    useCheckEmpty,
    useCheckLength,
    useCheckMaxLength,
  ];

  const validate = () => {
    let prevErrors = {} as { [key: string]: string };
    Object.keys(eventItem).forEach((key) => {
      let errorInstance = {} as { [key: string]: string };
      if (key === 'title' || key === 'description' || key === 'location') {
        errorInstance[key] = checkEmpty(eventItem[key]);
        if (errorInstance[key] === '') {
          errorInstance[key] = checkLength(eventItem[key], 3);
        }
        if (errorInstance[key] === '') {
          if (key === 'location') {
            errorInstance[key] = checkMaxLength(eventItem[key], 800);
          } else {
            errorInstance[key] = checkMaxLength(eventItem[key], 250);
          }
        }
      }
      if (key === 'date') {
        errorInstance['dateNTime'] = '';
        const concat = `${dayjs(eventItem.date).format('YYYY-MM-DD')}T${eventItem.time}`;
        const date = new Date(concat);
        const now = new Date();
        console.log(date < now);
        if (eventItem.date && eventItem.time && date) {
          if (date < now) {
            errorInstance['dateNTime'] = 'Event cannot be in the past';
          }
        } else if (!eventItem.date || !eventItem.time) {
          errorInstance['dateNTime'] = 'Date or time cannot be empty';
        } else {
          errorInstance['dateNTime'] = '';
        }
      }
      prevErrors = { ...prevErrors, ...errorInstance };
    });
    setErrors({ ...error, ...prevErrors });
  };

  useEffect(() => {
    validate();
  }, [eventItem]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>
      <FormControl fullWidth sx={{ marginBottom: '10px' }}>
        <h3>Event Image</h3>
        {eventItem.image.name ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
            }}>
            <button
              onClick={deleteImage}
              style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: 'var(--IndicatorRed)',
                color: 'white',
                border: 'none',
                padding: '0.5rem',
                borderRadius: '5px',
                cursor: 'pointer',
                zIndex: 1,
                width: '50px',
                height: '50px',
              }}>
              <MdDelete />
            </button>
            <h3
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                zIndex: 1,
                color: 'white',
                padding: '0.5rem',
              }}>
              Your Event Image
            </h3>
            <img
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                borderRadius: '5px',
                objectFit: 'cover',
                objectPosition: 'center',
                boxShadow: '0 0 5px 0 rgba(0,0,0,0.2)',
                filter: 'brightness(0.6)',
              }}
              src={URL.createObjectURL(eventItem.image)}
              alt=""
            />
          </div>
        ) : (
          <div
            style={{
              height: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'column',
            }}>
            <div />
            <MdImage size={128} />
            <button
              type="button"
              onClick={uploadImage}
              className="full-width"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MdUpload size={24} /> &nbsp;Click here to upload your image
            </button>
          </div>
        )}
        <FormHelperText error>{error.image}</FormHelperText>
      </FormControl>

      <TextField
        fullWidth
        label="Event Title"
        variant="outlined"
        sx={{ marginBottom: '15px' }}
        value={eventItem.title}
        name="title"
        onChange={(e) => onChangeEvent(e.target.name, e.target.value)}
        error={error.title !== ''}
        helperText={error.title}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        maxRows={4}
        label="Event Description"
        variant="outlined"
        sx={{ marginBottom: '15px' }}
        value={eventItem.description}
        name="description"
        onChange={(e) => onChangeEvent(e.target.name, e.target.value)}
        error={error.description !== ''}
        helperText={error.description}
      />
      <Grid gap={1} sx={{ justifyContent: 'space-between' }} container>
        <Grid item xs={12} md={5.5}>
          <FormControl fullWidth>
            <DatePicker
              label="Event Date"
              value={eventItem.eventdate}
              onChange={(date) => onChangeEvent('date', date)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={5.5}>
          <FormControl fullWidth>
            <TimePicker
              label="Event Time"
              value={eventItem.time}
              onChange={(time) => onChangeEvent('time', time)}
            />
          </FormControl>
        </Grid>
      </Grid>
      <FormHelperText sx={{ marginBottom: '15px' }} error>
        {error.dateNTime}
      </FormHelperText>
      <TextField
        fullWidth
        label="Event Location Embed"
        variant="outlined"
        sx={{ marginBottom: '15px' }}
        value={eventItem.location}
        name="location"
        onChange={(e) => onChangeEvent(e.target.name, e.target.value)}
        error={error.location !== ''}
        helperText={error.location}
      />
      <FormControl sx={{ marginBottom: '15px' }} fullWidth>
        <h3>Files for the event</h3>
        <Dropper
          id="fileDrop"
          isDragActive={isDragActive}
          getRootProps={getRootProps}
          uploadfile={uploadFile}
        />
        <div
          style={{
            display: 'flex',
            width: '100%',
            minHeight: '150px',
            overflowX: 'scroll',
          }}>
          {eventItem.files.map((file: File, index: string) => {
            return (
              <UploadedFileCard
                filestaticid={index}
                filename={file.name}
                filesize={file.size}
                filetype={file.type}
                onDelete={() => deleteItem(file)}
              />
            );
          })}
        </div>
        <FormHelperText error>{error.files}</FormHelperText>
      </FormControl>
      <button onClick={nextStage} className="buttonWithLeading full-width">
        Next&nbsp;
        <MdArrowForward />
      </button>
    </motion.div>
  );
};

export default EventCreationComponent;
