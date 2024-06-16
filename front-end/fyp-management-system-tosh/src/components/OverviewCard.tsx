import { Card } from '@mui/material';

interface OverviewCardProps {
  name: string;
  duedate: string;
  lecturername: string;
  type: string;
  supervisor: boolean;
}
const OverviewCard: React.FC<OverviewCardProps> = (props) => {
  return (
    <Card
      sx={{
        padding: '10px',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <div>
        <h3>{props.name}</h3>
        <p>By {props.lecturername}</p>
        <p>{props.type}</p>
        <p>{props.duedate}</p>
      </div>
      <div
        style={{
          backgroundColor: `var(--${props.supervisor ? '--IndicatorRed' : 'SparesIndigo'})`,
          height: '100%',
          aspectRatio: '1/1',
          width: '50px',
          borderRadius: '15px',
        }}></div>
    </Card>
  );
};

export default OverviewCard;
