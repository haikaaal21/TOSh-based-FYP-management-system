import { Grid } from '@mui/material';

const ProjectViewPage = () => {
  return (
    <>
      <div style={{ height: '25px' }} />
      <img
        src=""
        alt=""
        style={{
          width: '100%',
          height: '350px',
          borderRadius: '25px',
          backgroundColor: 'red',
          objectFit: 'cover',
        }}
      />
      <h1>Your Project</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <h2>Supervisor</h2>
          <img
            src=""
            alt=""
            style={{
              aspectRatio: '1/1',
              backgroundColor: 'red',
              height: '200px',
              borderRadius: '20px',
            }}
          />
          <p>Name</p>
          <p>
            <i>Programmer</i>
          </p>
          <button
            style={{
              width: '35%',
              borderRadius: '5px',
              backgroundColor: 'var(--SparesLightBlue',
              color: 'black',
            }}>
            <span>Icon </span>
            <b>Contact</b>
          </button>
        </Grid>
        <Grid item xs={12} sm={8}>
          <h2>Category</h2>
          <div
            style={{
              aspectRatio: '1/1',
              backgroundColor: 'red',
              height: '200px',
              borderRadius: '20px',
            }}
          />
          <p>Blank Application</p>
        </Grid>
      </Grid>
      <div style={{ height: '25px' }} />
      <h2>About</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero odio
        totam, rem, soluta minus, tenetur culpa ea reprehenderit iste natus
        reiciendis. Soluta eos, earum impedit perspiciatis culpa doloremque
        minus! Distinctio. Cupiditate, expedita eius at recusandae quidem beatae
        qui laborum dolor, ratione blanditiis ipsam quam ipsa deserunt
        repellendus cumque facilis, quos mollitia. Accusamus architecto quaerat
        labore eaque iusto sequi consequuntur quae. Dolor, ab inventore voluptas
        veritatis, harum in, esse dolorem corporis laboriosam dolores error eum
        officiis recusandae debitis sit qui id odio dolore minima eius sed vero
        assumenda! Blanditiis, quae ducimus! Dolor temporibus deserunt iusto
        incidunt minus, nihil eos labore, optio nisi aperiam et ipsam eius
        aliquid! Exercitationem molestias omnis accusamus, quasi eos enim sunt!
        Odio eos numquam harum sit reiciendis. Debitis iusto, excepturi aut
        repellat error omnis cupiditate similique voluptatem voluptas voluptate
        quasi accusamus tempora maxime quidem nemo beatae dolor necessitatibus
        dolore ut eos laboriosam! Commodi sint similique magni reiciendis.
      </p>
    </>
  );
};

export default ProjectViewPage;
