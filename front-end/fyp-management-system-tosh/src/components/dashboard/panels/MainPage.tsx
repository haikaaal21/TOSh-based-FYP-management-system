import ItemCard from '../ItemCard';
import LegendCard from '../LegendCard';
import '../../../styles/mainPageStyle.css';
import Grid from '@mui/material/Grid';
import { Divider } from '@mui/material';
import useGet from '../../../hooks/api/useGet';
import { useContext, useEffect, useState } from 'react';
import ItemCardProps from '../../../types/itemCardsProps';
import AuthUser from '../../../context/AuthUserContext';
import TableOfShame from '../../TableOfShame';
import { Chart } from 'react-google-charts';
import dayjs from 'dayjs';
import Loading from '../../Loading';

const MainPage = () => {
  /**
   * TODO:
   * - Add logic to display upcoming tasks and events
   * - Add logic to fetch the user's name and batch
   */

  const { handleGet, state } = useGet();
  const { auth } = useContext(AuthUser);
  const currentDate = dayjs();

  useEffect(() => {
    handleGet(
      import.meta.env.VITE_APPLICATION_TEST_SERVER_URL + 'items/' + auth.user.id
    );
  }, []);

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (state.data !== null) {
      setData(state.data);
    }
  }, [state.data]);

  const [emptyCount, setEmptyCount] = useState(0);

  return (
    <>
      <p>Final Year Project - Batch</p>
      <h1>{auth.user.batchname ? auth.user.batchname : ''}</h1>
      <h2>Hall of Shame (Experimental)</h2>
      <TableOfShame />
      {/**? Don't forget to add the table comp */}
      <h2>Upcoming Tasks and Events</h2>
      <div className="deadlines">
        {data ? (
          data.length > 0 ? (
            data.map((item: ItemCardProps) => {
              return (
                <div style={{ margin: '0px 10px' }}>
                  <ItemCard {...item} />
                </div>
              );
            })
          ) : data.length === 0 ? (
            <p>No upcoming tasks or events</p>
          ) : (
            <p>Loading</p>
          )
        ) : (
          <p>Error, could not fetch Datas!</p>
        )}
      </div>
      <h2>Timeline</h2>
      <p style={{ textAlign: 'right' }} className="subtitle">
        Current Year:&nbsp;<b>{dayjs().format('YYYY')}</b>
      </p>
      <div style={{ position: 'relative' }} className="timeline">
        {data !== null ? (
          <>
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '8px',
                width: '10%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                height: '80%',
                zIndex: '1',
              }}>
              <div
                style={{
                  width: '5px',
                  height: '50%',
                  zIndex: 1,
                  backgroundColor: 'red',
                }}></div>
              <div>
                <p
                  style={{
                    lineHeight: '1',
                  }}
                  className="subtitle">
                  You
                </p>
                <p
                  style={{
                    lineHeight: '1',
                  }}
                  className="subtitle">
                  {dayjs().format('ddd')}
                </p>
                <p
                  style={{
                    lineHeight: '1',
                  }}
                  className="subtitle">
                  {dayjs().format('MM/DD')}
                </p>
              </div>
            </div>
            <Chart
              chartType="Timeline"
              loader={<div>Loading Chart</div>}
              legendToggle={false}
              data={[
                [
                  { type: 'string', id: 'Role' },
                  { type: 'string', id: 'Name' },
                  { type: 'date', id: 'Start' },
                  { type: 'date', id: 'End' },
                ],
                ...data.map((item: any) => {
                  {
                    return [
                      item.typeOfItem,
                      item.title,
                      item.typeOfItem === 'task'
                        ? new Date()
                        : new Date(item.dueDate),
                      item.typeOfItem === 'task'
                        ? new Date(item.dueDate)
                        : new Date(
                            new Date(item.dueDate).getTime() +
                              1000 * 60 * 60 * 24
                          ),
                    ];
                  }
                }),
              ]}
              options={{
                timeline: { showRowLabels: false },
                avoidOverlappingGridLines: false,
                colors: ['#333333'],
              }}
            />
          </>
        ) : (
          <Loading />
        )}
        <Divider />
        <h3 style={{ margin: '1rem 0' }}>Legend</h3>
        <Grid container spacing={1}>
          {data ? (
            data.map((item: any) => {
              return (
                <LegendCard
                  coordinator={item.coordinatorDesignated}
                  title={item.title}
                  name={item.dateFrom}
                  desc1={dayjs(item.dueDate).format('DD/MM/YYYY')}
                  desc2={
                    item.typeOfItem.charAt(0).toUpperCase() +
                    item.typeOfItem.slice(1)
                  }
                />
              );
            })
          ) : (
            <p>Error, could not fetch Datas!</p>
          )}
        </Grid>
      </div>
    </>
  );
};

export default MainPage;
