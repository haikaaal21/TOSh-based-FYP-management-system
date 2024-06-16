import { useParams } from 'react-router';
import useGet from '../../../hooks/api/useGet';
import { useEffect, useState } from 'react';
import { MdCheck, MdClose } from 'react-icons/md';
import { Alert, Card, Grid, Snackbar } from '@mui/material';
import DefaultImage from '../../../assets/images/default/PFP.png';
import usePost from '../../../hooks/api/usePost';
import ErrorPanel from './ErrorPanel';
import { IoSad } from 'react-icons/io5';
import Loading from '../../Loading';
import { IoMdEye } from 'react-icons/io';
import { motion } from 'framer-motion';

const RequestsPage = () => {
  const { projectid } = useParams();
  const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;
  const { state: reqState, handleGet: get } = useGet();
  const { state: postState, handlePost: postItem } = usePost();
  const { state: close, handleGet: closeProject } = useGet();
  const [requests, setRequests] = useState([] as any);

  const reqItem = () => {
    get(`${url}project/get/${projectid}/requests`);
  };

  useEffect(() => {
    reqItem();
  }, []);

  const [details, setDetails] = useState({
    approvalstatus: false,
    recruitment: false,
  });

  useEffect(() => {
    if (reqState.data) {
      setRequests(reqState.data.requests);
      setDetails(reqState.data.projectstatus);
    }
  }, [reqState]);

  const openCloseProject = (open: boolean) => {
    if (open) {
      closeProject(`${url}project/openclose/${projectid}/false`);
    } else {
      closeProject(`${url}project/openclose/${projectid}/true`);
    }
  };

  const accordecline = (acc: boolean, studentid: number) => {
    if (acc) {
      postItem(`${url}project/verify?accept=true`, {
        projectid: projectid,
        studentid: studentid,
      });
    } else {
      postItem(`${url}project/verify?accept=false`, {
        projectid: projectid,
        studentid: studentid,
      });
    }
  };

  useEffect(() => {
    if (postState.data) {
      setSnackState({
        open: true,
        message: postState.data.message,
        severity: 'success',
      });
    } else if (postState.error) {
      setSnackState({
        open: true,
        message: 'Error in connecting to the server',
        severity: 'error',
      });
    }
    reqItem();
  }, [postState, close]);

  const [snackstate, setSnackState] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  return (
    <>
      <Snackbar
        open={snackstate.open}
        autoHideDuration={6000}
        onClose={() =>
          setSnackState({ open: false, message: '', severity: 'success' })
        }
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert sx={{ width: '80vw' }} severity={snackstate.severity}>
          {snackstate.message}
        </Alert>
      </Snackbar>
      {reqState.error ? (
        <ErrorPanel />
      ) : reqState.data && details.approvalstatus ? (
        <>
          <h2>Requests</h2>
          {details.recruitment ? (
            <button
              onClick={() => openCloseProject(true)}
              style={{
                backgroundColor: 'var(--IndicatorRed)',
              }}
              className="buttonWithLeading">
              <MdClose />
              &nbsp;Close Requests
            </button>
          ) : (
            <button
              onClick={() => openCloseProject(false)}
              style={{
                backgroundColor: 'var(--GoodGreen)',
              }}
              className="buttonWithLeading">
              <MdCheck />
              &nbsp;Open Requests
            </button>
          )}
          <div
            style={{
              position: 'relative',
            }}>
            {!details.recruitment ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'black',
                    textAlign: 'center',
                  }}>
                  {' '}
                  <IoMdEye size={128} />
                  <h3>
                    You must open the recruitment first to view the requests
                  </h3>
                </motion.div>
              </>
            ) : null}
            <Grid
              style={{
                paddingTop: '10px',
                filter: !details.recruitment ? 'blur(5px)' : 'none',
              }}
              gap={1}
              container>
              {requests.map((request: any) => {
                return (
                  <>
                    <Grid item xs={12}>
                      <Card>
                        <div
                          style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            height: 'fit-content',
                          }}>
                          <img
                            style={{
                              width: '25%',
                            }}
                            src={
                              request.profilepic
                                ? `${url}profilepic`
                                : DefaultImage
                            }
                            alt={request.name}
                          />
                          <div style={{ padding: '10px' }}>
                            <h2>{request.name}</h2>
                            <p>{request.matricnumber}</p>
                            <p>{request.email}</p>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                          }}>
                          <button
                            onClick={() => {
                              accordecline(false, request.studentid);
                            }}
                            style={{
                              backgroundColor: 'var(--IndicatorRed)',
                            }}
                            className="full-width">
                            <MdClose />
                            &nbsp;Decline Request{' '}
                          </button>
                          <button
                            onClick={() => {
                              accordecline(true, request.studentid);
                            }}
                            style={{
                              backgroundColor: 'var(--GoodGreen)',
                            }}
                            className="full-width">
                            <MdCheck />
                            &nbsp;Accept Request{' '}
                          </button>
                        </div>
                      </Card>
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </div>
        </>
      ) : reqState.data && !details.approvalstatus ? (
        <div
          style={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IoSad size={124}/>
          <h3>Project has yet to be approved by a coordinator</h3>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default RequestsPage;
