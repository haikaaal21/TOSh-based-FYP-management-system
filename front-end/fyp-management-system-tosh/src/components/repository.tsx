import { Grid, TextField } from '@mui/material';
import { useState } from 'react';
import { MdSearch } from 'react-icons/md';
import ProfileCard from './ProfileCard';

interface basicProfile {
  name: string;
  id: number;
  image: string;
}
interface RepositoryProps {
  items: basicProfile[];
  staff: boolean;
  buttonClick: (id: number) => void;
  add: boolean;
  hidden?: boolean;
  noDetails? :boolean;
}

const Repostitory: React.FC<RepositoryProps> = (props) => {
  const [search, setSearch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredItems = props.items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: '400px',
      }}>
      <h4
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          color: 'grey',
        }}>
        <MdSearch />
        Search
      </h4>
      <TextField
        fullWidth
        sx={{ margin: '10px 0 ' }}
        value={search}
        onChange={handleChange}
      />
      <Grid
        sx={{
          maxHeight: '600px',
          overflowY: 'scroll',
        }}
        gap={1}
        container>
        {filteredItems.map((item) => {
          return (
            <Grid item xs={12}>
              <ProfileCard
                add={props.add}
                buttonClick={props.buttonClick}
                id={item.id}
                image={item.image}
                name={item.name}
                staff={props.staff}
                hidden={props.hidden}
                noDetails={props.noDetails}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Repostitory;
