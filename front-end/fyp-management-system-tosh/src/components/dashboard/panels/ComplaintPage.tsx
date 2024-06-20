import { Card, Divider, Grid, TextField } from '@mui/material';
import ComplaintReply from '../ComplaintReply';
import { IoChatbox, IoDocument } from 'react-icons/io5';
import FileCard from '../FileCard';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import useGet from '../../../hooks/api/useGet';
import Loading from '../../Loading';
import dayjs from 'dayjs';
import { MdCalendarMonth, MdClose, MdSend } from 'react-icons/md';
import usePost from '../../../hooks/api/usePost';
import AuthUser from '../../../context/AuthUserContext';
import Popup from '../Popup';
import ErrorPanel from './ErrorPanel';
import { IoMdHappy } from 'react-icons/io';

const ComplaintPage = () => {
  const { complaintid } = useParams();
  const [complaint, setComplaint] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const { state, handleGet } = useGet();
  const { state: postState, handlePost } = usePost();
  const { auth } = useContext(AuthUser);

  const [replyInput, setReplyInput] = useState('');
  const [replyError, setReplyError] = useState('');

  const onChange = (e: any) => {
    setReplyInput(e.target.value);
  };

  const validator = () => {
    if (replyInput.length < 1) {
      setReplyError('Reply cannot be empty');
    } else if (replyInput.length < 8) {
      setReplyError('Reply too short');
    } else if (replyInput.length > 500) {
      setReplyError('Reply too long');
    } else {
      setReplyError('');
    }
  };

  const [popupItem, setPopupItem] = useState<any>(null);
  const [replyBool, setReplyBool] = useState(false);

  const handleReplyCreation = (e: any) => {
    e.preventDefault();
    if (replyError === '') {
      setReplyBool(!replyBool);
      handlePost(
        `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}complaint/${complaint.complaintid}/reply/create/${auth.user.id}`,
        {
          replytext: replyInput,
          fromstaff: auth.user.role.includes('Staff') ? true : false,
        }
      );
      setReplyBool(!replyBool);
    } else {
      setPopupItem({
        title: 'Reply Error',
        content: 'Please check the reply input field for errors.',
        button1: 'OK',
        yesClicked: () => {
          setPopupItem(null);
        },
      });
    }
  };

  useEffect(() => {
    if (postState.data && postState.data.status === 500) {
      setPopupItem({
        title: 'Reply Error',
        content:
          'There was an error while creating the reply. Please try again later.',
        button1: 'OK',
        yesClicked: () => {
          setPopupItem(null);
        },
      });
    } else if (postState.data && postState.data.status === 200) {
      if (auth.user.role === 'Student') {
        handleGet(
          import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
            `complaint/fetchdetails/${complaintid}`
        );
      } else {
        handleGet(
          import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
            `complaint/fetchdetails/${complaintid}?isstaff=true`
        );
      }
      setReplyInput('');
    }
  }, [postState, replyBool]);

  useEffect(() => {
    validator();
  }, [replyInput]);


  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) return;

    getDetails();
    didMount.current = true;
  }, []);

  const getDetails = () => {
    if (auth.user.role === 'Student') {
      handleGet(
        import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
          `complaint/fetchdetails/${complaintid}`
      );
    } else {
      handleGet(
        import.meta.env.VITE_APPLICATION_TEST_SERVER_URL +
          `complaint/fetchdetails/${complaintid}?isstaff=true`
      );
    }
  };

  useEffect(() => {
    if (state.data !== null) {
      setComplaint(state.data.complaints.details);
      setFiles(state.data.complaints.files);
      setReplies(state.data.complaints.replies);
    }
  }, [state]);

  const { state: closeState, handleGet: closeComplaintItem } = useGet();

  const closeComplaint = () => {
    setPopupItem({
      title: 'Close Complaint',
      content: 'Are you sure you want to close this complaint?',
      button1: 'Yes',
      button2: 'No',
      yesClicked: () => {
        closeComplaintItem(
          `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}complaint/close/${complaint.complaintid}`
        );
        setPopupItem(null);
      },
      noClicked: () => {
        setPopupItem(null);
      },
    });
  };

  useEffect(() => {
    if (closeState.data) {
      window.location.reload();
    }
  }, [closeState]);

  return (
    <>
      {state.error ? (
        <ErrorPanel />
      ) : (
        <>
          {complaint && files && replies ? (
            <>
              {popupItem ? <Popup {...popupItem} /> : null}
              <div style={{ height: '25px' }} />
              <Card
                sx={{
                  height: '90vh',
                  overflowY: 'scroll',
                  color:
                    complaint.complaintstatus === 'Closed'
                      ? 'var(--NeutralGrey)'
                      : 'black',
                }}>
                {complaint.complaintstatus === 'Closed' ? (
                  <div
                    style={{
                      backgroundColor: 'var(--NeutralGrey)',
                      padding: '15px',
                    }}>
                    <h3
                      style={{
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                      <IoMdHappy />
                      &nbsp;Complaint is closed
                    </h3>
                  </div>
                ) : null}
                <Grid container>
                  <Grid item sx={{ padding: '15px 10px' }} xs={12} md={6}>
                    <Grid container>
                      <Grid item xs={12} md={6}>
                        <p
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          className="subtitle">
                          <IoDocument />
                          Ticket ID#{complaint.complaintid}
                        </p>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <p
                          className="subtitle"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          <MdCalendarMonth />
                          &nbsp; Created on :{' '}
                          {dayjs(complaint.complaintdate).format(
                            'DD MMMM YYYY'
                          )}
                        </p>
                      </Grid>
                    </Grid>
                    {complaint.complaintstatus === 'Closed' ? null : (
                      <button
                        onClick={closeComplaint}
                        style={{ backgroundColor: 'var(--NeutralGrey)' }}
                        className="buttonWithLeading">
                        <MdClose />
                        &nbsp;Close Complaint
                      </button>
                    )}
                    <h1>{complaint.complainttitle}</h1>
                    <p>{complaint.complainttext}</p>
                    <Divider sx={{ height: '25px' }} />
                    <h2>Attached Files</h2>
                    <div
                      style={{
                        width: '100%',
                        overflowX: 'scroll',
                        display: 'flex',
                      }}>
                      {files.map((file: any) => {
                        return (
                          <>
                            <FileCard
                              typeOfFile={file.complaintfiletype}
                              fileName={file.complaintfiletitle}
                              fileurl={file.complaintfilename}
                            />
                          </>
                        );
                      })}
                    </div>
                  </Grid>
                  <Grid item sx={{ padding: '15px 10px' }} xs={12} md={6}>
                    <h2>
                      <IoChatbox /> Replies
                    </h2>
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: 'silver',
                        padding: '15px 10px',
                        borderRadius: '10px 10px 0px 0px',
                        maxHeight: '60vh',
                        overflowY: 'scroll',
                      }}>
                      {replies.map((reply: any) => {
                        return <ComplaintReply {...reply} />;
                      })}
                    </div>
                    {complaint.complaintstatus === 'Closed' ? null : (
                      <form onSubmit={handleReplyCreation}>
                        <div style={{ display: 'flex', margin: '10px 0' }}>
                          <TextField
                            value={replyInput}
                            onChange={onChange}
                            variant="outlined"
                            fullWidth
                            multiline
                            maxRows={4}
                          />
                          <button
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <MdSend />
                          </button>
                        </div>
                        <p className="subtitle">{replyError}</p>
                      </form>
                    )}
                  </Grid>
                </Grid>
              </Card>
            </>
          ) : (
            <div
              style={{
                width: '100%',
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Loading />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ComplaintPage;
