import { Grid } from '@mui/material';
import ItemCard from './ItemCard';
import '../../styles/monthlyGridStyle.css';
import ItemCardProps from '../../types/itemCardsProps';
import { useEffect } from 'react';

interface MonthlyGridProps {
  currentMonth: string;
  items: ItemCardProps[];
}

const MonthlyGrid: React.FC<MonthlyGridProps> = ({ currentMonth, items }) => {
  return (
    <Grid item md={4} xs={12}>
      <h2 className="monthly-grid-h">{currentMonth}</h2>
      <Grid container spacing={4}>
        <Grid item xs={10}>
          {items !== null ? (
            items.map((items: any) => {
              return <ItemCard {...items} />;
            })
          ) : (
            <p>Loading</p>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MonthlyGrid;
