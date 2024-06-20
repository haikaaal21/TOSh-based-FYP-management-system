import {
  Autocomplete,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import { useCallback, useContext, useEffect, useState } from 'react';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import Dropper from '../Dropper';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import AuthUser from '../../../context/AuthUserContext';
import useGet from '../../../hooks/api/useGet';
import Popup from '../Popup';
import {
  useCheckEmpty,
  useCheckLength,
  useCheckMaxLength,
} from '../../../hooks/newHooks/checkerHooks';
import usePost from '../../../hooks/api/usePost';
import { useNavigate } from 'react-router';
import { IoTrash } from 'react-icons/io5';

const getLocalProject = () => {
  const project = sessionStorage.getItem('project');
  if (project) {
    const parsedProject = JSON.parse(project);
    return parsedProject;
  } else {
    return {
      title: '',
      description: '',
      type: '',
      batch: '',
      image: null,
      markdown: '',
    };
  }
};

const CreateProject = () => {
  /**! TODO !
   * - Verification and Validation of input
   * - Backend implementation
   */

  const { handleGet, state } = useGet();
  const { auth } = useContext(AuthUser);
  const [project, setProject] = useState(getLocalProject);
  const [dummyImage, setDummyImage] = useState<string>();
  const [dummyBatch, setDummyBatch] = useState<string>();
  const [batches, setBatch] = useState<any>([]);
  const [tags, setTag] = useState<any>([]);
  const [pop, setPop] = useState(false);
  const [edittingProject, setEdittingProject] = useState(false);

  const [checkEmpty, checkLength, checkMaxLength] = [
    useCheckEmpty,
    useCheckLength,
    useCheckMaxLength,
  ];

  const getBatchAndType = async () => {
    const userinstitution = auth.user.institution.replace(/\s/g, '_');
    handleGet(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
        `project/fetchDetailsForCreate/${userinstitution}`
    );
  };

  const handlePop = () => {
    setPop(!pop);
  };

  const closePop = () => {
    setPop(false);
  };

  interface PopupProps {
    title: string;
    content: string;
    button1: string;
    button2?: string;
    yesClicked?: () => void;
    noClicked?: () => void;
  }

  const [popupProps, setPopupProps] = useState<PopupProps>({
    title: '',
    content: '',
    button1: '',
  });

  const queryParams = new URLSearchParams(window.location.search);
  const edit = queryParams.get('edit');
  const [projectid] = useState(queryParams.get('projectid'));

  //? On Render useEffect
  useEffect(() => {
    getBatchAndType();
    sessionStorage.removeItem('project');
    edit === 'true' ? setEdittingProject(true) : setEdittingProject(false);
  }, []);

  useEffect(() => {
    if (state.data) {
      setBatch(state.data.batches);
      setTag(state.data.tags);
    }
  }, [state.data]);

  const handleChange = (event: any) => {
    setProject({
      ...project,
      [event.target.name]: event.target.value,
    });
    if (event.target.name === 'batch') {
      setDummyBatch(
        batches.find((batch: any) => batch.batchid === event.target.value)
          .batchname
      );
    }
  };

  useEffect(() => {
    const savedData = {
      title: project.title,
      description: project.description,
      type: project.type,
      batch: '',
      image: null,
      markdown: project.markdown,
    };
    sessionStorage.setItem('project', JSON.stringify(savedData));

    const projectMandatoryData = {
      title: project.title,
      description: project.description,
      type: project.type,
      batch: project.batch,
    };
    validate(projectMandatoryData);
  }, [project]);

  const [errors, setErrors] = useState({} as { [key: string]: string });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFile = acceptedFiles[0];
    appendFile(imageFile);
  }, []);

  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  const uploadFile = () => {
    event?.preventDefault();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // Only accept image files
    input.multiple = false;
    input.click();
    input.addEventListener('change', (e) => {
      const files = (e.target as HTMLInputElement)?.files;
      if (files) {
        appendFile(files[0]);
      }
    });
  };

  const animationProperties = {
    initial: { opacity: 0, translateY: 10 },
    animate: {
      opacity: 1,
      translateY: 0,
      transition: { ease: 'easeOut' },
    },
  };

  const appendFile = (file: File) => {
    const maxSize = 1024 * 1024 * 35;
    const typeOfFile = 'image/*';
    const refuseGif = ['gif', 'webp', 'svg'];
    if (refuseGif.some((ext) => file.type.includes(ext))) {
      handlePop();
      setPopupProps({
        ...popupProps,
        title: 'File Type Not Allowed',
        content: 'Gif, Webp and SVG files are not allowed',
        button1: 'Okay',
        yesClicked: () => closePop(),
        button2: '',
      });
      return;
    } else if (!file.type.match(typeOfFile)) {
      handlePop();
      setPopupProps({
        ...popupProps,
        title: 'File Type Not Allowed',
        content: 'Only image files are allowed',
        button1: 'Okay',
        yesClicked: () => closePop(),
        button2: '',
      });
      return;
    } else if (file.size <= maxSize && file.type.match(typeOfFile)) {
      setProject({
        ...project,
        image: file,
      });
      setDummyImage(URL.createObjectURL(file));
    } else {
      handlePop();
      setPopupProps({
        ...popupProps,
        title: 'File Too Large',
        content: 'The file you are trying to upload is too large',
        button1: 'Okay',
        yesClicked: () => closePop(),
        button2: '',
      });
    }
  };

  const validate = (values: any) => {
    let prevErrors = {} as { [key: string]: string };
    Object.keys(values).map((key) => {
      const errorObject = {} as { [key: string]: string };
      errorObject[key] = checkEmpty(project[key]) as string;
      if (errorObject[key]) {
      } else if (errorObject[key] === '') {
        errorObject[key] = checkLength(project[key], 3) as string;
      } else {
        errorObject[key] = checkMaxLength(project[key] ?? '', 200) as string;
      }
      prevErrors = { ...prevErrors, ...errorObject };
    });
    setErrors(prevErrors);
  };

  const { handlePost, state: postState } = usePost();

  const createQuery =
    import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + 'project/create';
  const editQuery =
    import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + 'project/edit';

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (
      Object.values(errors).every(
        (value) => value === '' || value === undefined
      )
    ) {
      const titlewithnoSpace = project.title.replace(/\s/g, '_');
      const markdownBlob = new Blob([project.markdown], {
        type: 'text/markdown',
      });
      const markdownFile = new File(
        [markdownBlob],
        `${titlewithnoSpace}_markdown.md`,
        { type: 'text/markdown' }
      );
      const formData = new FormData();
      formData.append('projectStaff', auth.user.specialid);
      formData.append('projecttitle', project.title);
      formData.append('projectdescription', project.description);
      formData.append('projecttype', project.type);
      formData.append('projectbatch', project.batch);
      formData.append('projectFiles', project.image),
        `${titlewithnoSpace}_image.png`;
      formData.append(
        'projectFiles',
        markdownFile,
        `${titlewithnoSpace}_markdown.md`
      );
      if (edittingProject && projectid) {
        formData.append('projectid', projectid);
      }
      edittingProject
        ? handlePost(editQuery, formData)
        : handlePost(createQuery, formData);
    }
  };

  const goto = useNavigate();

  const redirectToProject = () => {
    goto('/staff/projects');
  };

  useEffect(() => {
    if (postState.error) {
      handlePop();
      setPopupProps({
        title: 'Error',
        content: postState.errorDetails.statusText,
        button1: 'Okay',
        yesClicked: () => closePop(),
        button2: '',
      });
    }
    if (postState.data) {
      sessionStorage.clear();
      handlePop();
      if (edittingProject) {
        setPopupProps({
          title: 'Project Edited',
          content: 'Your project has been edited successfully',
          button1: 'Neat!',
          yesClicked: () => redirectToProject(),
        });
      } else {
        setPopupProps({
          title: 'Project Created',
          content: 'Your project has been created successfully',
          button1: 'Neat!',
          yesClicked: () => redirectToProject(),
        });
      }
    }
  }, [postState]);

  const clearForm = (event: any) => {
    event.preventDefault();
    handlePop();
    setPopupProps({
      title: 'Clear Form',
      content: 'Are you sure you want to clear the form?',
      button1: 'Yes',
      button2: 'No',
      yesClicked: () => {
        actuallyClearForm();
        closePop();
      },
      noClicked: () => closePop(),
    });
  };

  const actuallyClearForm = () => {
    setProject({
      title: '',
      description: '',
      type: '',
      batch: '',
      image: null,
      markdown: '',
    });
    setDummyImage('');
    sessionStorage.clear();
  };

  const deleteProject = (event: any) => {
    event.preventDefault();
    handlePop();
    setPopupProps({
      title: 'Delete Project',
      content: 'Are you sure you want to delete this project?',
      button1: 'Yes',
      button2: 'No',
      yesClicked: () => {
        handlePost(
          import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + 'project/delete',
          { projectid }
        );
        goto('/staff/projects');
        sessionStorage.clear();
      },
      noClicked: () => closePop(),
    });
  };

  return (
    <>
      {pop ? <Popup {...popupProps} /> : null}
      <div className="create-project">
        <form
          onSubmit={(event) => {
            handleSubmit(event);
          }}>
          <h1>{edit ? 'Edit' : 'Create'} Project</h1>
          <Grid style={{ justifyContent: 'space-between' }} gap={1} container>
            <Grid item xs={12} md={7}>
              <FormControl
                fullWidth
                style={{
                  padding: '5px 0',
                }}>
                <h3>Project Image</h3>
                {project.image ? (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                    }}>
                    <button
                      onClick={() => {
                        setProject({ ...project, image: null });
                        setDummyImage('');
                      }}
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
                      Your Project Image
                    </h3>
                    <img
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '300px',
                        borderRadius: '5px',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        boxShadow: '0 0 5px 0 rgba(0,0,0,0.2)',
                        filter: 'brightness(0.6)',
                      }}
                      src={String(URL.createObjectURL(project.image))}
                      alt=""
                    />
                  </div>
                ) : (
                  <Dropper
                    isDragActive={isDragActive}
                    getRootProps={getRootProps}
                    uploadfile={uploadFile}
                  />
                )}
              </FormControl>
              <FormControl
                fullWidth
                style={{
                  padding: '5px 0',
                }}>
                <h3>Project Title*</h3>
                <TextField
                  name="title"
                  onChange={handleChange}
                  value={project.title}
                />
                <FormHelperText>{errors.title}</FormHelperText>
              </FormControl>
              <FormControl
                fullWidth
                style={{
                  padding: '5px 0',
                }}>
                <h3>Project Brief Description*</h3>
                <TextField
                  onChange={handleChange}
                  name="description"
                  value={project.description}
                  multiline
                  rows={4}
                  maxRows={6}
                />
                <FormHelperText>{errors.description}</FormHelperText>
              </FormControl>
              <Grid
                container
                gap={0.5}
                style={{
                  justifyContent: 'space-between',
                }}>
                <Grid item xs={12} md={5.75}>
                  <FormControl
                    fullWidth
                    style={{
                      padding: '5px 0',
                    }}>
                    <h3>Project Type*</h3>
                    <Autocomplete
                      freeSolo
                      value={project.type || ''}
                      onChange={(event, newValue) =>
                        {
                          console.log(event);
                          setProject({
                            ...project,
                            type: newValue || '',
                          })
                        }
                      }
                      onInputChange={(event, value) =>
                        {
                          console.log(event);
                          handleChange({
                            target: { name: 'type', value },
                          })
                        }
                      }
                      options={tags.map((tag: any) => tag.tagname)}
                      renderInput={(params) => (
                        <TextField name="type" {...params} />
                      )}
                    />
                    <FormHelperText>{errors.type}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <FormControl
                    fullWidth
                    style={{
                      padding: '5px 0',
                    }}>
                    <h3>Project Batch*</h3>
                    <Select
                      name="batch"
                      value={project.batch}
                      onChange={handleChange}>
                      {state.data ? (
                        batches.map((batch: any) => {
                          return (
                            <MenuItem value={batch.batchid}>
                              {batch.batchname}
                            </MenuItem>
                          );
                        })
                      ) : (
                        <MenuItem value={''}>Loading...</MenuItem>
                      )}
                    </Select>
                    <FormHelperText>{errors.batch}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
              <h3>Project Brief Markdown</h3>
              <div data-color-mode="light">
                <MDEditor
                  height={400}
                  value={project.markdown}
                  onChange={(value) =>
                    setProject({ ...project, markdown: value || '' })
                  }
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, translateY: 10 }}
                animate={{
                  opacity: 1,
                  translateY: 0,
                  transition: { ease: 'easeOut' },
                }}>
                <Card
                  sx={{
                    padding: '5px 15px',
                  }}>
                  {projectid ? (
                    <motion.p className="subtitle" {...animationProperties}>
                      Editing PID#{projectid}
                    </motion.p>
                  ) : (
                    <p className="subtitle">New Project Preview</p>
                  )}
                  <img
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '300px',
                      borderRadius: '5px',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                    src={String(dummyImage)}
                    alt=""
                  />
                  {project.title !== '' ? (
                    <motion.h2 {...animationProperties}>
                      {project.title}
                    </motion.h2>
                  ) : null}
                  {project.description !== '' ? (
                    <motion.p {...animationProperties}>
                      {project.description}
                    </motion.p>
                  ) : null}
                  <Grid container>
                    <Grid item xs={12} md={6}>
                      {project.type !== '' ? (
                        <motion.p {...animationProperties}>
                          Type:&nbsp;<b>{project.type}</b>
                        </motion.p>
                      ) : null}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {project.batch !== '' ? (
                        <motion.p {...animationProperties}>
                          Batch:&nbsp;<b>{dummyBatch}</b>
                        </motion.p>
                      ) : null}
                    </Grid>
                  </Grid>
                  <div
                    data-color-mode="light"
                    style={{
                      border: '1px solid var(--SparesIndigo)',
                      borderRadius: '5px',
                      margin: '1rem 0.5rem',
                      padding: '0.5rem',
                      maxHeight: '400px',
                      overflowX: 'scroll',
                    }}>
                    <MDEditor.Markdown source={project.markdown} />
                  </div>
                  {edittingProject ? (
                    <button
                      onClick={(event) => deleteProject(event)}
                      style={{
                        backgroundColor: 'var(--IndicatorRed)',
                      }}>
                      <IoTrash /> Delete Project
                    </button>
                  ) : null}
                </Card>
              </motion.div>
            </Grid>
          </Grid>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '1rem 0',
            }}>
            <button
              onClick={(event) => clearForm(event)}
              style={{
                maxWidth: '150px',
                backgroundColor: 'var(--IndicatorRed)',
              }}>
              <IoTrash /> Clear Form
            </button>
            <button
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                margin: '1rem',
              }}
              type="submit">
              {edittingProject ? <MdEdit /> : <MdAdd />}
              &nbsp;{edittingProject ? 'Edit' : 'Create'} Project
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
