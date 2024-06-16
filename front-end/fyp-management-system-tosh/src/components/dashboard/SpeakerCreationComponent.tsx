import { useContext, useEffect, useState } from 'react';
import {
  MdAdd,
  MdArrowBack,
  MdArrowForward,
  MdCancel,
  MdDelete,
  MdPerson,
  MdPersonAdd,
} from 'react-icons/md';
import EventContext from '../../context/EventContext';
import {
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import Dropper from './Dropper';
import {
  useCheckEmpty,
  useCheckLength,
  useCheckMaxLength,
} from '../../hooks/newHooks/checkerHooks';
import Popup from './Popup';
import SpeakerCard from './SpeakerCard';

interface SpeakerCreationComponentProps {
  goto: (stage: number) => void;
}
const SpeakerCreationComponent: React.FC<SpeakerCreationComponentProps> = (
  props
) => {
  const {
    appendSpeaker,
    eventItem,
    newSpeaker,
    deleteSpeakerImage,
    onChangeSpeaker,
    uploadSpeakerImage,
    deleteSpeaker,
  } = useContext(EventContext);
  const [adding, setAdding] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    appendImage(acceptedFiles[0]);
  };

  const uploadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    input.click();
    input.onchange = (e: any) => {
      appendImage(e.target.files[0]);
    };
  };

  const nextPage = (alreadyWarned: boolean) => {
    console.log(alreadyWarned);
    //TODO: Make an alert if there are no speakers
    if (eventItem.speakers.length < 1 && !alreadyWarned) {
      setPop(true);
    } else {
      setPop(false);
      props.goto(3);
    }
  };

  const backPage = () => {
    props.goto(1);
  };

  const appendImage = (file: File) => {
    const maxSize = 10 * 1024 * 1024 * 1024;
    const acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (file.size > maxSize) {
      setErrors({ ...errors, image: 'File size too large' });
    } else if (!acceptedTypes.includes(file.type)) {
      setErrors({ ...errors, image: 'File type not supported' });
    } else {
      setErrors({ ...errors, image: '' });
      uploadSpeakerImage(file);
    }
  };

  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  const addingLogic = () => {
    setAdding(!adding);
  };

  const appendToContext = (event: any) => {
    event.preventDefault();
    if (Object.values(errors).every((error) => error === '')) {
      setAdding(false);
      appendSpeaker();
    }
  };

  const [checkEmpty, checkLength, checkMaxLength] = [
    useCheckEmpty,
    useCheckLength,
    useCheckMaxLength,
  ];

  const [errors, setErrors] = useState({} as { [key: string]: string });

  const validate = (checkValues: any) => {
    let errorsItem = {} as { [key: string]: string };
    Object.keys(checkValues).forEach((key) => {
      let error = {} as { [key: string]: string };
      if (key !== 'image') {
        error[key] = checkEmpty(checkValues[key]);
        if (error[key] === '') {
          error[key] = checkLength(checkValues[key], 3);
        }
        if (error[key] === '') {
          error[key] = checkMaxLength(checkValues[key], 255);
        }
        errorsItem = { ...errorsItem, ...error };
      }
    });
    setErrors({ ...errors, ...errorsItem });
  };

  useEffect(() => {
    validate(newSpeaker);
  }, [newSpeaker]);

  const [pop, setPop] = useState(false);

  return (
    <>
      {pop ? (
        <Popup
          title="No Speakers"
          content="Are you sure you want to proceed without adding any speakers?"
          button1="Yes"
          button2="No"
          yesClicked={() => nextPage(true)}
          noClicked={() => setPop(false)}
        />
      ) : (
        eventItem.speakers.map((speaker: any, index: number) => (
          <>
            <SpeakerCard
              eventspeakerid={0}
              eventspeaker={speaker.name}
              eventspeakerbio={speaker.bio}
              eventspeakercontact={speaker.contact}
              eventspeakerimage={
                speaker.image instanceof Blob
                  ? URL.createObjectURL(speaker.image)
                  : ''
              }
            />
            <button
              onClick={() => deleteSpeaker(index)}
              style={{ backgroundColor: 'var(--IndicatorRed)' }}
              className="full-width">
              <MdDelete />
              &nbsp;Remove
            </button>
          </>
        ))
      )}
      <h3 style={{ justifyContent: 'flex-start' }} className="with-leading">
        <MdPerson />
        &nbsp;Speakers
      </h3>
      {adding ? (
        <>
          <button
            style={{
              marginTop: '10px',
              justifyContent: 'center',
              backgroundColor: 'var(--IndicatorRed)',
            }}
            className="with-leading"
            onClick={() => addingLogic()}>
            <MdCancel />
            &nbsp;Cancel adding
          </button>
          <Divider sx={{ padding: '15px' }} />
          <motion.div
            initial={{
              opacity: 0,
              translateY: '-10',
            }}
            animate={{
              opacity: 1,
              translateY: '0',
            }}
            exit={{
              opacity: 0,
            }}>
            <form onSubmit={(event: any) => appendToContext(event)}>
              {newSpeaker.image.type !== undefined ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                  }}>
                  <button
                    onClick={deleteSpeakerImage}
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
                    Your Event Speaker Image
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
                    src={String(URL.createObjectURL(newSpeaker.image))}
                    alt=""
                  />
                </div>
              ) : (
                <FormControl fullWidth>
                  <Dropper
                    getRootProps={getRootProps}
                    isDragActive={isDragActive}
                    uploadfile={uploadFile}
                  />
                  <FormHelperText error>{errors.image}</FormHelperText>
                </FormControl>
              )}
              <TextField
                sx={{ margin: '20px 0' }}
                fullWidth
                label="Full Name"
                variant="outlined"
                name="name"
                value={newSpeaker.name}
                onChange={(e: any) =>
                  onChangeSpeaker(e.target.name, e.target.value)
                }
                error={errors.name ? true : false}
                helperText={errors.name}
              />
              <TextField
                fullWidth
                label="Biography"
                variant="outlined"
                multiline
                minRows={4}
                maxRows={4}
                name="bio"
                value={newSpeaker.bio}
                onChange={(e: any) =>
                  onChangeSpeaker(e.target.name, e.target.value)
                }
                error={errors.bio ? true : false}
                helperText={errors.bio}
              />
              <TextField
                fullWidth
                sx={{ margin: '20px 0' }}
                label="Email"
                variant="outlined"
                name="contact"
                value={newSpeaker.contact}
                onChange={(e: any) =>
                  onChangeSpeaker(e.target.name, e.target.value)
                }
                error={errors.contact ? true : false}
                helperText={errors.contact}
              />
              <button type="submit" className="buttonWithLeading full-width">
                <MdPersonAdd />
                &nbsp;Add speaker
              </button>
            </form>
          </motion.div>
        </>
      ) : (
        <button
          onClick={() => addingLogic()}
          style={{ justifyContent: 'center', marginTop: '10px' }}
          className="with-leading full-width">
          Add a speaker&nbsp;
          <MdAdd />
        </button>
      )}
      <Grid gap={0.5} sx={{ justifyContent: 'space-between' }} container>
        <Grid item xs={12} md={5.75}>
          <button
            onClick={() => backPage()}
            style={{ justifyContent: 'center', marginTop: '10px' }}
            className="with-leading full-width">
            <MdArrowBack />
            &nbsp;Back
          </button>
        </Grid>
        <Grid item xs={12} md={5.75}>
          <button
            onClick={() => nextPage(false)}
            style={{ justifyContent: 'center', marginTop: '10px' }}
            className="with-leading full-width">
            Forward&nbsp;
            <MdArrowForward />
          </button>
        </Grid>
      </Grid>
    </>
  );
};

export default SpeakerCreationComponent;
