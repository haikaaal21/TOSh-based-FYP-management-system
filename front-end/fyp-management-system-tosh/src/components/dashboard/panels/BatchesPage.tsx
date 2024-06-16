import { useContext, useEffect, useState } from 'react';
import { MdAdd, MdSchool } from 'react-icons/md';
import AuthUser from '../../../context/AuthUserContext';
import useGet from '../../../hooks/api/useGet';
import { Grid } from '@mui/material';
import BatchCard from '../BatchCard';
import { useNavigate } from 'react-router';
import ErrorPanel from './ErrorPanel';

const BatchesPage = () => {
  const { auth } = useContext(AuthUser);
  const { handleGet, state } = useGet();
  const [batches, setBatches] = useState([]);
  const goto = useNavigate();

  useEffect(() => {
    const institutionWithUnderScore = auth.user.institution.replace(/\s/g, '_');
    handleGet(
      `${import.meta.env.VITE_APPLICATION_TEST_SERVER_URL}batch/fetch/${institutionWithUnderScore}`
    );
  }, []);

  useEffect(() => {
    if (state.data) {
      setBatches(state.data);
    }
  }, [state]);

  return (
    <>
      {state.error ? (
        <ErrorPanel />
      ) : (
        <>
          <h1>Current Batches</h1>
          <Grid
            sx={{
              justifyContent: 'space-between',
            }}
            gap={1}
            container>
            <Grid item xs={12} md={5}>
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  color: 'grey',
                }}>
                <MdSchool />
                &nbsp;{auth.user.institution}
              </h3>
            </Grid>
            <Grid item xs={12} md={5}>
              <button
                onClick={() => {
                  goto('create');
                }}
                className="buttonWithLeading full-width">
                <MdAdd />
                &nbsp;Create another Batch
              </button>
            </Grid>
          </Grid>
          <div style={{ height: '15px' }} />
          <Grid gap={1} container>
            {batches.map((batch: any) => {
              return (
                <Grid item xs={12}>
                  <BatchCard
                    batchId={batch.batchid}
                    batchName={batch.batchname}
                    batchYear={batch.batchyear}
                    status={batch.batchstatus}
                    supervisors={batch.supervisorCount}
                    students={batch.studentCount}
                    projects={batch.projectCount}
                    batchHead={batch.name}
                    batchImage={batch.batchimage}
                  />
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </>
  );
};

export default BatchesPage;
