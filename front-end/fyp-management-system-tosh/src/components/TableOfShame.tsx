import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import '../styles/table.css';
import { useContext, useEffect, useState } from 'react';
import DefaultImage from '../assets/images/default/PFP.png';
import Loading from './Loading';
import { IoSad } from 'react-icons/io5';
import { MdRestartAlt } from 'react-icons/md';
import AuthUser from '../context/AuthUserContext';

interface rowItem {
  no: number;
  name: string;
  position: string;
  institution: string;
  shamepoints: number;
  profilepic: string;
}

const RowItem: React.FC<rowItem> = (props) => {
  const url = import.meta.env.VITE_APPLICATION_TEST_SERVER_URL;
  return (
    <TableRow className="row-item">
      <TableCell>{props.no}</TableCell>
      <TableCell
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        <img
          src={props.profilepic ? url + 'assets' + props.profilepic : DefaultImage}
          alt="Avatar"
          className="hide-before-hover"
          style={{ width: '90px' }}
        />
        {props.name}
      </TableCell>
      <TableCell>{props.position}</TableCell>
      <TableCell>{props.institution}</TableCell>
      <TableCell className="importantItem">{props.shamepoints}</TableCell>
    </TableRow>
  );
};

const TableOfShame = () => {
  const [data, setData] = useState<any>(null);
  const [socketError, setSocketError] = useState(true);
  const { auth } = useContext(AuthUser);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_SERVER_URL);

    ws.onopen = () => {
      let data;
      if (auth.auth) {
        data = {
          type: 'GET',
          payload: 'fetch-institution',
          institution: auth.user.institution,
        };
      } else {
        data = {
          type: 'GET',
          payload: 'fetch-me-vanilla',
        };
      }
      ws.send(JSON.stringify(data));
    };

    ws.onmessage = (message) => {
      setData(JSON.parse(message.data));
    };

    ws.onclose = () => {
      console.log('Disconnected from the server');
    };

    ws.onerror = (error) => {
      console.log('Error connecting to the server', error);
      setSocketError(true);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'scroll',
        overflowY: 'scroll',
      }}>
      {data ? (
        <Table className="table-item">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Institution</TableCell>
              <TableCell className="importantItem">Shame points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ? data.map((fetched: any, index: number) => {
                  return (
                    <RowItem
                      no={index + 1}
                      name={fetched.name}
                      position={
                        (fetched.isstaff as boolean) ? 'Lecturer' : 'Student'
                      }
                      institution={fetched.institution}
                      shamepoints={fetched.shamepoints}
                      profilepic={fetched.profilepic}
                    />
                  );
                })
              : null}
          </TableBody>
        </Table>
      ) : socketError ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '450px',
          }}>
          <IoSad size={128} />
          <h3>Error connecting to the server</h3>
          <button
            onClick={() => {
              window.location.reload();
            }}>
            <MdRestartAlt />
            &nbsp;Click here to retry
          </button>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default TableOfShame;
