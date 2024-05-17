import Grid from '@mui/material/Grid';
import '../../styles/legendCards.css';
import { CardActionArea } from '@mui/material';

interface LegendCardProps {
  coordinator: boolean;
  title: string;
  name: string;
  desc1: string;
  desc2: string;
}
const LegendCard: React.FC<LegendCardProps> = (props) => {
  return (
    <Grid
      sx={{ display: 'flex', alignItems: 'flex-start' }}
      item
      xl={3}
      lg={4}
      md={6}
      sm={6}
      xs={12}>
      <Grid className="legend-content" container spacing={4}>
        <Grid item xs={2}>
          <div
            style={{
              margin: '0.3rem 0',
              width: '2rem',
              height: '2rem',
              backgroundColor: props.coordinator
                ? 'var(--IndicatorRed)'
                : 'var(--IndicatorBlue)',
            }}></div>
        </Grid>
        <Grid item xs={10}>
          <p>
            <b>{props.title}</b>
          </p>
          <div className="description">
            <p>By: {props.name}</p>
            <p>{props.desc1}</p>
            <p>{props.desc2}</p>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LegendCard;
